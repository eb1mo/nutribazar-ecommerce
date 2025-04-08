import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Card = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product");
        const shuffledProduct = res.data.sort(() => 0.5 - Math.random());
        setProducts(shuffledProduct);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="w-full max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
        >
          <Link to={`/singleproduct/${product.id}`}>
            <img
              className="w-full h-60 rounded-t-xl object-cover transition-transform duration-300 ease-in-out hover:scale-105"
              src={`http://localhost:5000/${product.productImage}`}
              alt={product.name}
            />
          </Link>
          <div className="p-4 space-y-4">
            <Link to={`/singleproduct/${product.id}`}>
              <h5 className="text-xl font-semibold text-gray-900 hover:text-green-600 transition-colors duration-300">
                {product.name}
              </h5>
            </Link>
            <div className="flex items-center mt-2">
              <span className="text-sm font-medium text-gray-500">
                {product.category?.name || 'Uncategorized'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-2xl font-bold text-gray-900">NPR {product.price}</span>
              <Link
                to={`/singleproduct/${product._id}`}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm"
              >
                View Product
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;