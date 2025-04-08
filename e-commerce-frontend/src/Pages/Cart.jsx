import { useDispatch, useSelector } from "react-redux";
import {
  decreasedQuantity,
  increasedQuantity,
  resetCart,
} from "../redux/features/cart/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const shippingDetails = useSelector(
    (state) => state.shipping.shippingDetails
  );

  const handleClearCart = () => {
    dispatch(resetCart());
  };

  const handleIncreaseQuantity = (id) => {
    dispatch(increasedQuantity(id));
  };

  const handleDecreaseQuantity = (id) => {
    dispatch(decreasedQuantity(id));
  };

  return (
    <div className="flex flex-col items-center text-gray-900 bg-white min-h-screen p-5">
      <h1 className="text-3xl font-semibold mt-10 p-10 mb-8 text-green-700">
        Shopping Cart
      </h1>

      {cartItems.length > 0 ? (
        <div className="w-full max-w-4xl">
          <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-600 text-white text-left">
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="border-b border-gray-300">
                  <td className="flex items-center gap-3 p-3">
                    <img
                      src={`http://localhost:5000/${item.productImage}`}
                      className="w-12 h-12 rounded-md object-cover"
                      alt={item.name}
                    />
                    {item.name}
                  </td>
                  <td className="p-3">NPR {item.price}</td>
                  <td className="p-3 flex items-center gap-3">
                    <button
                      className="px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                      onClick={() => handleDecreaseQuantity(item._id)}
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                      onClick={() => handleIncreaseQuantity(item._id)}
                    >
                      +
                    </button>
                  </td>
                  <td className="p-3 font-semibold">
                    NPR {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleClearCart}
              className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Clear Cart
            </button>

            <Link
              to={shippingDetails ? "/placeorder" : "/shipping"}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Checkout
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-5 text-lg">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
