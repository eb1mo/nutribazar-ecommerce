import Order from "../models/OrderModel";

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user");
    res.json(orders);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export { getAllOrders };
