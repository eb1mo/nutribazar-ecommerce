import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/product");
        setProducts(res.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/product/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (id) => {
    // Navigate to edit page (You can use React Router for this)
    window.location.href = `/editproduct/${id}`;
  };

  // const handleEdit = (id) => {
  //   const navigate = useNavigate();
  //   navigate(`/editproduct/${id}`);
  // };

  return (
    <div className="container mx-auto p-10 my-10 bg-white rounded-lg shadow-md max-w-6xl">
      <h1 className="text-3xl font-semibold text-center text-green-600 mb-10">
        All Products
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="py-3 px-4 text-sm font-semibold">Product Image</th>
              <th className="py-3 px-4 text-sm font-semibold">Product Name</th>
              <th className="py-3 px-4 text-sm font-semibold">Stock</th>
              <th className="py-3 px-4 text-sm font-semibold">Product Price</th>
              <th className="py-3 px-4 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-300 hover:bg-gray-50"
              >
                <td className="p-3">
                  <img
                    src={`http://localhost:5000/${product.productImage}`}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </td>
                <td className="py-3 px-4 text-gray-800">{product.name}</td>
                <td className="py-3 px-4 text-gray-800">{product.stock}</td>
                <td className="py-3 px-4 text-gray-800">{product.price}</td>
                <td className="py-3 px-4 space-x-4">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-400 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProducts;
