import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
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
        setIsAdmin(response.data.isAdmin);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders. Please try again.");
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-green-700">
        {isAdmin ? "All Orders" : "My Orders"}
      </h1>
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
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-green-800">
                    Order ID: {order._id}
                  </h2>
                  {isAdmin && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Customer:</span>{" "}
                      {order.user?.username || 'Unknown'} ({order.user?.email || 'No email'})
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-gray-700">
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={`px-2 py-1 rounded ${
                      order.paymentStatus === "Completed" 
                        ? "bg-green-100 text-green-800" 
                        : order.paymentStatus === "Failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Amount:</span> Rs.{" "}
                  {order.amount / 100}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Shipping Name:</span>{" "}
                  {order.shipping_name || 'Not provided'}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Shipping Address:</span>{" "}
                  {order.shipping_address || 'Not provided'}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Shipping Phone:</span>{" "}
                  {order.shipping_phone || 'Not provided'}
                </p>
              </div>

              <h3 className="mt-3 font-semibold text-green-800">Items:</h3>
              <ul className="mt-2">
                {order.items?.map((item) => (
                  <li key={item._id} className="ml-4 text-gray-800 flex items-center gap-4">
                    <img 
                      src={`http://localhost:5000/${item.product?.productImage}`} 
                      alt={item.product?.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.product?.name || 'Product name not available'}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs. {item.product?.price || 'Price not available'}</p>
                    </div>
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
