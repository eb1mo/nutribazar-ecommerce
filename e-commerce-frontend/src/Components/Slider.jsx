import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Slider = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product");
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="relative w-full bg-gray-100 p-4 rounded-lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Flash Deals
        </h2>
      </div>
      {/* Slider Container */}
      <div className="flex flex-col md:flex-row justify-between items-center space-x-4 overflow-hidden">
        {products.slice(0, 2).map((product) => (
          <div
            key={product._id}
            className="w-full md:w-1/2 bg-white border border-gray-200 rounded-lg shadow-lg mb-6 md:mb-0"
          >
            <div className="flex flex-col md:flex-row">
              {/* Left part - Image */}
              <div className="w-full md:w-1/2 h-96 flex justify-center items-center">
                <img
                  className="object-cover h-full w-full rounded-l-lg"
                  src={`http://localhost:5000/${product.productImage}`}
                  alt={product.name}
                />
              </div>
              {/* Right part - Product Info */}
              <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {product.name}
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-gray-900">
                    NPR {product.price}
                  </span>
                  <Link
                    to={`/singleproduct/${product._id}`}
                    className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-4 py-2.5"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => {}}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-green-600 hover:text-green-700 text-4xl font-bold focus:outline-none transition duration-300 ease-in-out"
      >
        &lt;
      </button>
      <button
        onClick={() => {}}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-green-600 hover:text-green-700 text-4xl font-bold focus:outline-none transition duration-300 ease-in-out"
      >
        &gt;
      </button>
    </div>
  );
};

export default Slider;
