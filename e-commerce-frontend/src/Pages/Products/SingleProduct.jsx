import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    dispatch(addToCart(product));
    toast.success("Product successfully added to cart");
    navigate("/shop");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/product/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (id) {
      fetchProducts();
    }
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 p-6 bg-white">
      {/* Product Image (Fixed Size & Aspect Ratio) */}
      <div className="w-full md:w-1/3 flex justify-center">
        <div className="w-80 h-80 bg-gray-100 flex items-center justify-center rounded-lg shadow-lg">
          <img
            src={`http://localhost:5000/${product.productImage}`}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-gray-500">{product.name}</h1>
        <h2 className="text-3xl font-bold text-gray-800">{product.title}</h2>
        <p className="text-gray-600 text-lg">{product.description}</p>
        <p className="text-xl font-semibold text-green-700">
          Price: ${product.price}
        </p>

        {/* Add to Cart Button */}
        <button
          className="w-full md:w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition duration-200"
          onClick={addToCartHandler}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default SingleProduct;
