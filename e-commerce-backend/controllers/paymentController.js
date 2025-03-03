// implement the khalti api in this
import axios from "axios";
import Order from "../models/OrderModel.js";
import Product from "../models/productModel.js";
import jwt from "jsonwebtoken";
import UserToken from "../models/usertokenModel.js";
import OrderItem from "../models/OrderItemModel.js";
import request from "request";

export const initializePayment = async (req, res) =>
{
    try
    {
        const tokenHeader = req.headers.authorization;
        if (!tokenHeader)
        {
            return res.status(401).json({ message: "No authorization header found" });
        }

        const token = tokenHeader.split(" ")[1];
        const isTokenExists = await UserToken.findOne({ jwt: token });
        if (!isTokenExists)
        {
            return res.status(401).json({ message: "Access Denied. Please login." });
        }

        const decoded = jwt.verify(token, process.env.JWT);
        const user = await UserToken.findOne({ userId: decoded.id });
        // console.log(user);
        if (!user)
        {
            return res.status(404).json({ message: "User not found" });
        }

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

        let totalAmount = 0;

        for (const item of items)
        {
            const product = await Product.findById(item.product);
            if (!product)
            {
                return res.status(404).json({ message: "Product not found" });
            }
            totalAmount += product.price * item.quantity;

            const orderItem = new OrderItem({
                product: [item.product],
                firstName,
                lastName,
                email,
                shippingAddress,
                city,
                phone,
                zipcode,
                quantity: item.quantity,
                user: decoded.id,
                amount: totalAmount,
            });
            await orderItem.save();
        }

        totalAmount += taxAmount + shippingCost;

        totalAmount *= 100;

        const newOrder = new Order({
            user: decoded.id,
            paymentStatus: "pending",
            purchase_order_id: `Order-${Date.now()}`,
            payment_token: "",
            amount: totalAmount,
        });
        await newOrder.save();

        const payload = {
            return_url: "http://localhost:5173/payment-success",
            website_url: "http://localhost:5000",
            amount: totalAmount,
            purchase_order_id: newOrder.purchase_order_id,
            purchase_order_name: `Order-${newOrder._id}`,
            customer_info: {
                name: `${firstName} ${lastName}`,
                email,
                phone,
            },
        };

        const options = {
            method: "POST",
            url: "https://a.khalti.com/api/v2/epayment/initiate/",
            headers: {
                Authorization: `Key ${process.env.KHALTI_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        };

        request(options, async (error, response) =>
        {
            if (error)
            {
                console.error("Khalti API error:", error);
                return res.status(400).json({ message: error.message });
            }

            if (response.statusCode === 200)
            {
                const responseData = JSON.parse(response.body);

                newOrder.payment_token = responseData.pidx;
                await newOrder.save();

                return res.status(200).json({
                    pidx: responseData.pidx,
                    payment_url: responseData.payment_url,
                    message: "Pyament successful",
                });
            } else
            {
                return res.status(response.statusCode).json({ message: response.body });
            }
        });
    } catch (e)
    {
        console.error(e);
        return res.status(400).json({ message: e.message });
    }
};

export const verifyPayment = async (req, res) =>
{
    try
    {
        const { pidx } = req.query;

        if (!pidx)
        {
            return res.status(400).json({ message: "Payment token is required" });
        }

        console.log("Received pidx:", pidx);

        const order = await Order.findOne({ payment_token: pidx });
        if (!order)
        {
            return res.status(404).json({ message: "Order not found" });
        }

        // console.log("Order found:", order);

        const payload = {
            token: pidx,
            amount: order.amount,
        };

        const header = {
            Authorization: `Key ${process.env.KHALTI_KEY}`,
            "Content-Type": "application/json",
        };

        console.log("Payload:", payload);
        // console.log("Headers:", header);

        const response = await axios.post(
            "https://a.khalti.com/api/v2/payment/verify/",
            payload,
            { headers: header }
        );

        console.log("Khalti API Response:", response);

        if (response.status === 200)
        {
            const responseData = response.data;
            const order = await Order.findOne({ payment_token: pidx });
            console.log(order);
            if (!order)
            {
                return res.status(404).json({ message: "Order not found" });
            }
            order.paymentStatus = "completed";
            await order.save();
            // console.log(order);

            return res.redirect("http://localhost:3000/home?status=success");
        }
        return res.status(response.status).json({ message: response.data });
    } catch (error)
    {
        // res.status(400).json({ message: e.message });
        console.error("Khalti API Error:", error.response?.data || error.message);
        res.status(400).json({ success: false, message: "Payment verification failed", error: error.response?.data });
    }
};