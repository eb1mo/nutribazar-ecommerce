import { useState } from "react";
import { useDispatch } from "react-redux";
import { saveShippingDetails } from "../../redux/features/cart/shippingSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProgressSteps from "../../Components/ProgressSteps";

const Shipping = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOrder = (e) => {
    e.preventDefault();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !address ||
      !city ||
      !zipcode ||
      !phone ||
      !country
    ) {
      toast.error("All fields are required");
      return;
    }

    const shippingData = {
      firstName,
      lastName,
      email,
      address,
      city,
      country,
      phone,
      zipcode,
      paymentMethod,
    };

    // Save shipping details in Redux
    dispatch(saveShippingDetails(shippingData));

    // Move to PlaceOrder page
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <ProgressSteps step1 step2 />

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg mt-10">
        <h1 className="text-2xl font-semibold text-green-700 mb-6 text-center">
          Shipping Details
        </h1>

        <form onSubmit={handleOrder} className="space-y-5">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">
                First Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Last Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium">Address</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter Address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* City & Zip Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">City</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter City"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Postal/Zip Code
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Zip Code"
                onChange={(e) => setZipcode(e.target.value)}
              />
            </div>
          </div>

          {/* Country & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Country</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Country"
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Phone</label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Phone Number"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-gray-700 font-medium">
              Select Payment Method
            </label>
            <div className="mt-2 flex items-center gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-600"
                  name="paymentMethod"
                  value="Khalti"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2 text-gray-700">Khalti</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-green-600"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2 text-gray-700">Cash on Delivery</span>
              </label>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition duration-200"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
