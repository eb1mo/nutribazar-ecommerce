import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      if (!token) {
        setError("No token found. User not logged in.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/order/history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-green-700">Order History</h1>
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {orders.length === 0 && !error ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="w-3/4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-5 mb-6 rounded-2xl shadow-lg"
            >
              <h2 className="text-xl font-semibold text-green-800">
                Order ID: {order._id}
              </h2>
              <p className="text-gray-700">
                <span className="font-semibold">Payment Status:</span>{" "}
                {order.paymentStatus}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Amount:</span> Rs.{" "}
                {order.amount / 100}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Shipping Name:</span>{" "}
                {order.shipping_name}
              </p>
              <h3 className="mt-3 font-semibold text-green-800">Items:</h3>
              <ul className="mt-2">
                {order.items.map((item) => (
                  <li key={item._id} className="ml-4 text-gray-800">
                    {item.product.title} ({item.quantity}) - Rs.{" "}
                    {item.product.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
