import { Link, useNavigate } from "react-router-dom";
import ProgressSteps from "../../Components/ProgressSteps";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const shipping = useSelector((state) => state.shipping.shippingDetails);

  const itemsTotal = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCost = itemsTotal > 500 ? 0 : 10;
  const tax = itemsTotal * 0.1;
  const total = itemsTotal + shippingCost + tax;

  const handlePlaceOrder = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo ? userInfo.token : null;
      if (!token) {
        toast.error("You must be logged in to place an order.");
        return;
      }

      const payload = {
        items: cart.cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        email: shipping.email,
        shippingAddress: shipping.address,
        city: shipping.city,
        phone: shipping.phone,
        zipcode: shipping.zipcode,
        amount: total * 100,
      };

      const response = await axios.post(
        "http://localhost:5000/api/payment/initialize",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { payment_url } = response.data;
        if (!payment_url) {
          toast.success("Order placed successfully (Cash on Delivery).");
          navigate("/order");
        } else {
          window.location.href = payment_url;
        }
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Payment Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProgressSteps step1 step2 step3 />

        <div className="max-w-4xl mx-auto mt-8">
          {cart.cartItems.length === 0 ? (
            <div className="text-center py-12">
              <h1 className="text-2xl font-semibold text-gray-800">Cart is empty</h1>
              <Link 
                to="/shop" 
                className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {cart.cartItems.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <img
                            src={`http://localhost:5000/${item.productImage}`}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/product/${item._id}`}
                            className="text-green-600 hover:text-green-800 hover:underline"
                          >
                            {item.name}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                        <td className="px-6 py-4 text-gray-600">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-600">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items Total</span>
                        <span className="text-gray-800">${itemsTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-800">${shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-800">${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="font-semibold text-gray-800">Total</span>
                        <span className="font-semibold text-gray-800">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Shipping Details</h3>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Name:</span> {shipping.firstName} {shipping.lastName}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Address:</span> {shipping.address}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">City:</span> {shipping.city}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Phone:</span> {shipping.phone}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Zip Code:</span> {shipping.zipcode}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handlePlaceOrder}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
