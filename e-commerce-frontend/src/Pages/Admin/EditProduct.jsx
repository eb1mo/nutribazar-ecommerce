import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for better request handling
import "react-toastify/dist/ReactToastify.css";

const EditProduct = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch categories and product data on load
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/category");
        setCategories(res.data);
      } catch (error) {
        toast.error("Failed to load categories");
        console.error(error);
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/product/${id}`);
        const data = res.data;
        setProductName(data.name || "");
        setDescription(data.description || "");
        setPrice(data.price || "");
        setQuantity(data.stock || "");
        setCategory(data.category._id || "");
        setExistingImage(data.productImage || "");
      } catch (error) {
        toast.error("Failed to load product data");
        console.error("Error fetching product:", error);
      }
    };

    fetchCategory();
    fetchProduct();
  }, [id]);

  const handleEditProduct = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", {
      name: productName,
      description,
      price,
      stock: quantity,
      category,
      productImage: image ? "New image selected" : "No new image"
    });

    try {
      // Get user info from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      if (!token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", quantity);
      formData.append("category", category);
      if (image) {
        formData.append("productImage", image);
      }

      console.log("Sending request to:", `http://localhost:5000/api/product/update/${id}`);
      console.log("Request method: PATCH");
      console.log("Request headers:", {
        Authorization: `Bearer ${token}`
      });

      const response = await fetch(`http://localhost:5000/api/product/update/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      toast.success("Product updated successfully");
      navigate("/allproducts");
    } catch (error) {
      console.error("Error updating product:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        status: error.status,
        headers: error.headers
      });
      toast.error(error.message || "Failed to update product");
    }
  };

  return (
    <div className="container mx-auto my-10 p-10 bg-white rounded-lg shadow-sm max-w-4xl">
      <h1 className="text-2xl font-semibold text-green-600 mb-6">
        Edit Product
      </h1>

      {/* Image Upload Section */}
      <div className="mb-6">
        <label className="border-2 border-green-500 text-green-600 px-6 py-3 rounded-lg cursor-pointer font-semibold block w-full text-center hover:bg-green-100">
          {image
            ? image.name
            : existingImage
            ? "Change Product Image"
            : "Upload Product Image"}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        {existingImage && !image && (
          <div className="mt-4 text-center text-gray-500">
            <img
              src={`http://localhost:5000/${existingImage}`}
              alt="Existing product"
              className="w-32 h-32 object-cover mx-auto"
            />
            <p className="text-xs mt-1">Current image</p>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <form onSubmit={handleEditProduct}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="productName"
              className="text-green-600 text-sm font-medium"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="text-green-600 text-sm font-medium"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="quantity"
              className="text-green-600 text-sm font-medium"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="text-green-600 text-sm font-medium"
            >
              Category
            </label>
            <select
              id="category"
              className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" className="text-green-600">
                Please Choose a Category
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="text-green-600 text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors mt-6"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
