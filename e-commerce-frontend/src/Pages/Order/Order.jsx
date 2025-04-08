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
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800 text-center">
          {isAdmin ? "All Orders" : "My Orders"}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      Order ID: {order._id}
                    </h2>
                    {isAdmin && (
                      <p className="text-gray-600 mt-1">
                        <span className="font-medium">Customer:</span>{" "}
                        {order.user?.username || 'Unknown'} ({order.user?.email || 'No email'})
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Amount:</span> Rs.{" "}
                      {order.amount / 100}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Shipping Name:</span>{" "}
                      {order.shipping_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Shipping Address:</span>{" "}
                      {order.shipping_address || 'Not provided'}
                    </p>
                    <p className="text-gray-700 mt-1">
                      <span className="font-medium">Shipping Phone:</span>{" "}
                      {order.shipping_phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Items:</h3>
                  <div className="space-y-4">
                    {order.items?.map((item) => (
                      <div key={item._id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={`http://localhost:5000/${item.product?.productImage}`} 
                          alt={item.product?.name} 
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.product?.name || 'Product name not available'}</p>
                          <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: Rs. {item.product?.price || 'Price not available'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
