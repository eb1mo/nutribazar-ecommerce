// Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineSearch,
} from "react-icons/ai";
import { MdAdminPanelSettings, MdLogout, MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../Context/SearchContext";
import axios from "axios";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();
  const { updateSearchResults, updateSearchQuery } = useSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogOut = async () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingDetails");
    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const logoutAndCloseDropdown = () => {
    handleLogOut();
    setShowDropdown(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/product/search?name=${encodeURIComponent(searchQuery)}`
      );
      if (response.data) {
        updateSearchResults(response.data);
        updateSearchQuery(searchQuery);
        navigate('/search-results');
      }
    } catch (error) {
      console.error("Search error:", error);
      // You might want to show a toast notification here
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-green-700 text-white flex items-center justify-between p-4 shadow-lg z-50">
      {/* Logo Section */}
      <div className="text-xl font-bold"><Link to="/"> NutriBazar </Link> </div>

      {/* Search Field (Visible on Larger Screens) */}
      <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/3">
        <AiOutlineSearch className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full outline-none text-black px-2"
        />
      </form>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-white"
      >
        <MdMenu size={28} />
      </button>

      {/* Navigation Links, Search Field, and User Management */}
      <div
        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-green-700 md:bg-transparent md:flex md:items-center space-x-6 p-4 md:p-0 transition-all ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        {/* Search Field (Hidden on Large Screens) */}
        <form onSubmit={handleSearch} className="md:hidden flex items-center bg-white rounded-full px-4 py-2 w-full mb-4">
          <AiOutlineSearch className="text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-black px-2"
          />
        </form>

        <Link to="/" className="nav-link flex items-center hover:text-gray-300">
          <AiOutlineHome className="mr-2" /> Home
        </Link>
        <Link
          to="/shop"
          className="nav-link flex items-center hover:text-gray-300"
        >
          <AiOutlineShopping className="mr-2" /> Shop
        </Link>
        <Link
          to="/cart"
          className="nav-link flex items-center hover:text-gray-300"
        >
          <AiOutlineShoppingCart className="mr-2" /> Cart
        </Link>

        {/* User Management for Both Large and Small Screens */}
        <div className="md:flex md:space-x-4 flex flex-col md:flex-row">
          {userInfo ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="nav-link flex items-center hover:text-gray-300"
              >
                <MdAdminPanelSettings className="mr-2" /> {userInfo.username} {userInfo.role === "admin" ? "(Admin)" : ""}
              </button>
              {showDropdown && (
                <div className="absolute right-0 bg-white text-black shadow-md rounded-md py-2 w-48 flex flex-col">
                  {userInfo.role === "admin" ? (
                    <>
                      <Link to="/admindashboard" className="dropdown-item px-4 py-2 hover:bg-gray-200">Admin Dashboard</Link>
                      <Link to="/addcategory" className="dropdown-item px-4 py-2 hover:bg-gray-200">Add Category</Link>
                      <Link to="/addproduct" className="dropdown-item px-4 py-2 hover:bg-gray-200">Add Product</Link>
                      <Link to="/allorders" className="dropdown-item px-4 py-2 hover:bg-gray-200">Orders</Link>
                      <Link to="/allproducts" className="dropdown-item px-4 py-2 hover:bg-gray-200">Manage Products</Link>
                      <Link to="/allusers" className="dropdown-item px-4 py-2 hover:bg-gray-200">Manage Users</Link>
                    </>
                  ) : (
                    <>
                      <Link to="/profile" className="dropdown-item px-4 py-2 hover:bg-gray-200">Update Profile</Link>
                      <Link to="/allorders" className="dropdown-item px-4 py-2 hover:bg-gray-200">My Orders</Link>
                    </>
                  )}
                  <button onClick={logoutAndCloseDropdown} className="dropdown-item px-4 py-2 hover:bg-gray-200 w-full text-left">
                    <MdLogout className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link flex items-center hover:text-gray-300">Login</Link>
              {/* <Link to="/register" className="nav-link flex items-center hover:text-gray-300">Register</Link> */}
              {/* <Link to="/admin/login" className="nav-link flex items-center hover:text-gray-300">Admin Login</Link> */}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
