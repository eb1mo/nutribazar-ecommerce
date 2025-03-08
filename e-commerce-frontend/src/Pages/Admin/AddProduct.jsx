import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await fetch("http://localhost:5000/api/category");
      const data = await res.json();
      setCategories(data);
    };

    fetchCategory();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", quantity);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://localhost:5000/api/product/add", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setProductName("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setCategory("");
        setImage(null);
        toast.success("Product added successfully");
      } else {
        toast.error("Failed to add Product");
      }
    } catch {
      toast.error("Error");
    }
  };

  return (
    <div className="container mx-auto my-10 p-10 bg-white rounded-lg shadow-sm max-w-4xl">
      <h1 className="text-2xl font-semibold text-green-600 mb-6">Create Product</h1>

      {/* Image Upload Section */}
      <div className="mb-6">
        <label className="border-2 border-green-500 text-green-600 px-6 py-3 rounded-lg cursor-pointer font-semibold block w-full text-center hover:bg-green-100">
          {image ? image.name : "Upload Product Image"}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleAddProduct}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="productName" className="text-green-600 text-sm font-medium">Product Name</label>
            <input
              type="text"
              id="productName"
              className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="price" className="text-green-600 text-sm font-medium">Price</label>
            <input
              type="number"
              id="price"
              className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="quantity" className="text-green-600 text-sm font-medium">Quantity</label>
            <input
              type="number"
              id="quantity"
              className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="text-green-600 text-sm font-medium">Category</label>
            <select
              id="category"
              className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" className="text-green-600">Please Choose a Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="text-green-600 text-sm font-medium">Description</label>
          <textarea
            id="description"
            className="p-3 w-full bg-gray-100 border border-green-500 rounded-lg text-gray-800 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-colors mt-6"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
