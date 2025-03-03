import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-10 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">About NutriBazar</h2>
            <p className="text-sm text-gray-300">
              Your go-to online store for high-quality nutrition products. We
              offer a wide range of health supplements to keep you fit and
              strong.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/" className="hover:text-green-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-green-400 transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-green-400 transition">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-green-400 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social Media */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-300 text-sm">
              Email: support@nutribazar.com
            </p>
            <p className="text-gray-300 text-sm">Phone: +977-9812345678</p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-green-400 transition"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} NutriBazar. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
