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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          status === "success" ? "bg-green-100" : "bg-red-100"
        }`}>
          {status === "success" ? (
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${
          status === "success" ? "text-green-600" : "text-red-600"
        }`}>
          {paymentMessage}
        </h1>
        
        {status === "success" && (
          <>
            <p className="text-gray-600 mb-4">Your order has been placed successfully!</p>
            <p className="text-gray-700 font-medium">Order ID: {orderId}</p>
            <p className="text-gray-500 text-sm mt-4">Redirecting to home page in 5 seconds...</p>
          </>
        )}
        
        {status === "failed" && (
          <p className="text-gray-600">Please try again or contact support if the problem persists.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
