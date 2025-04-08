import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const orderId = searchParams.get("orderId");

  const [paymentMessage, setPaymentMessage] = useState(
    status === "success" ? "Payment Successful!" : "Payment Failed"
  );

  useEffect(() => {
    if (status === "success") {
      // Clear cart and shipping details on successful payment
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingDetails");
      
      // Redirect to home after 5 seconds
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      // Redirect to home after 5 seconds on failure
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className={`text-2xl font-bold mb-4 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
          {paymentMessage}
        </h1>
        {status === "success" && (
          <>
            <p className="text-gray-600 mb-4">Your order has been placed successfully!</p>
            <p className="text-gray-600">Order ID: {orderId}</p>
            <p className="text-gray-600 mt-2">Redirecting to home page in 5 seconds...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
