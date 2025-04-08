import axios from "axios";
import request from "request";
import jwt from "jsonwebtoken";

import Order from "../models/OrderModel.js";
import OrderItem from "../models/orderItemModel.js";
import Product from "../models/productModel.js";
import UserToken from "../models/usertokenModel.js";

export const initializePayment = async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader) {
      return res.status(401).json({ message: "No authorization header found" });
    }
    const token = tokenHeader.split(" ")[1];
    const isTokenExists = await UserToken.findOne({ jwt: token });
    if (!isTokenExists) {
      return res.status(401).json({ message: "Access Denied. Please login." });
    }
    const decoded = jwt.verify(token, process.env.JWT);

    const {
      items,
      firstName,
      lastName,
      email,
      shippingAddress,
      city,
      phone,
      zipcode,
      taxAmount,
      shippingCost,
    } = req.body;

    // Calculate total amount in the base currency
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      totalAmount += product.price * item.quantity;
    }

    // Add tax & shipping cost (if provided)
    totalAmount += (taxAmount || 0) + (shippingCost || 0);

    // Convert to paisa (smallest currency unit)
    const totalAmountInPaisa = totalAmount * 100;

    // Create a new Order in DB
    const newOrder = new Order({
      user: decoded.id,
      paymentStatus: "Pending",
      amount: totalAmountInPaisa,
      shipping_name: `${firstName} ${lastName}`,
      shipping_phone: phone,
      shipping_address: shippingAddress,
      shipping_city: city,
      shipping_zip: zipcode,
    });
    await newOrder.save();

    // Create order items and link them to the order
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const orderItem = new OrderItem({
        order: newOrder._id,
        product: item.product,
        quantity: item.quantity,
        user: decoded.id,
      });
      await orderItem.save();
      orderItems.push(orderItem._id);
    }

    // Update order with order items
    newOrder.items = orderItems;
    await newOrder.save();

    // Build payload for Khalti ePayment initiation
    const payload = {
      return_url: "http://localhost:5000/api/payment/verify",
      website_url: "http://localhost:5000",
      amount: totalAmountInPaisa,
      purchase_order_id: newOrder._id.toString(),
      purchase_order_name: `Order-${newOrder._id}`,
      customer_info: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
      },
    };

    // Make request to Khalti
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const responseData = response.data;

      // Update order with payment token
      newOrder.payment_token = responseData.pidx;
      await newOrder.save();

      return res.status(200).json({
        pidx: responseData.pidx,
        payment_url: responseData.payment_url,
        message: "Payment initiated. Redirect user to payment_url.",
      });
    } else {
      throw new Error("Failed to initialize payment");
    }
  } catch (error) {
    console.error("Payment initialization error:", error.response?.data || error.message);
    return res.status(400).json({ message: error.message });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const { pidx, status, transaction_id, amount, purchase_order_id } = req.query;

    if (!pidx) {
      return res.redirect("http://localhost:5173/payment-success?status=failed");
    }

    // Find order by purchase_order_id
    const order = await Order.findOne({ _id: purchase_order_id });
    if (!order) {
      return res.redirect("http://localhost:5173/payment-success?status=failed");
    }

    // Make lookup request to Khalti API
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const lookupData = response.data;

    // Only proceed if payment is actually completed
    if (lookupData.status === "Completed") {
      // Update order status
      order.paymentStatus = "Completed";
      order.paymentDetails = {
        pidx,
        transactionId: transaction_id,
        amount: amount / 100, // Convert paisa to rupees
        status: lookupData.status,
      };
      await order.save();

      // Redirect to success page with order ID
      return res.redirect(
        `http://localhost:5173/payment-success?status=success&orderId=${order._id}`
      );
    } else {
      // Update order status to failed
      order.paymentStatus = "Failed";
      order.paymentDetails = {
        pidx,
        status: lookupData.status,
        error: "Payment not completed",
      };
      await order.save();

      return res.redirect("http://localhost:5173/payment-success?status=failed");
    }
  } catch (error) {
    console.error("Payment verification error:", error.response?.data || error.message);
    return res.redirect("http://localhost:5173/payment-success?status=failed");
  }
};
  