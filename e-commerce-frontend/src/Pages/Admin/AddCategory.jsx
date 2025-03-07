import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/category");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setCategories([...categories, data]);
        setName("");
        toast.success("Category added successfully");
      }
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold text-green-600 mb-6">
        Add Category
      </h1>

      {/* Add Category Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <form onSubmit={handleAddCategory}>
          <label
            htmlFor="categoryName"
            className="text-green-600 font-semibold text-lg mb-2 block"
          >
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 w-full rounded-lg bg-gray-100 border border-green-600 text-gray-800 focus:ring-2 focus:ring-green-500 mb-4"
            placeholder="Enter category name"
          />
          <button
            type="submit"
            className="mr-5 w-full py-3 rounded-lg bg-green-500 hover:bg-green-400 text-white font-semibold transition-colors"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Existing Categories */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-lg font-semibold text-green-600 mb-4">
          Existing Categories
        </h3>
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories available</p>
        ) : (
          <ul>
            {categories.map((category) => (
              <li
                key={category._id}
                className="flex justify-between items-center p-4 mb-3 bg-gray-50 border rounded-lg border-green-200"
              >
                <span className="text-green-700">{category.name}</span>
                <button className="text-green-500 hover:text-green-400">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddCategory;
