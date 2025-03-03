import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product");
        const shuffled = res.data.sort(() => 0.5 - Math.random()).slice(0, 8);
        setProducts(shuffled);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="text-black">
      <h1 className="text-center text-3xl font-semibold mt-10 mb-6 text-green-700">
        Featured Products
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105"
          >
            <img
              className="w-full h-44 sm:h-52 rounded-t-lg object-cover"
              src={`http://localhost:5000/${product.productImage}`}
              alt={product.name}
            />
            <div className="p-3">
              <h5 className="text-sm sm:text-md font-semibold text-gray-900">
                {product.name}
              </h5>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-gray-900">
                  ${product.price}
                </span>
                <Link
                  to={`/singleproduct/${product._id}`}
                  className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs sm:text-sm hover:bg-green-700 transition-colors"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
