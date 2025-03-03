import { useState } from "react";

const SearchProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a product name to search.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/product/search/?name=${searchQuery}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data); // Assuming `data` is an array of products
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      alert("Could not fetch products. Please try again.");
    }
  };

  return (
    <div className="text-white">
      <div className="flex gap-5 pt-20">
        <label htmlFor="search">Search Product By Product Name</label>
        <input
          type="text"
          id="search"
          className="p-1 rounded text-black"
          placeholder="Enter Product Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="bg-blue-500 p-2 rounded" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="pt-5">
        {products.length > 0 ? (
          <ul>
            {products.map((product, index) => (
              <li key={index} className="border-b border-gray-700 py-2">
                {product.name} - {product.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchProduct;
