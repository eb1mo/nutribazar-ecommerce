import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pidx = searchParams.get("pidx");

  useEffect(() => {
    if (!pidx) return;

    const verifyPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/payment/verify?pidx=${pidx}`
        );
        if (response.data.success) {
          setTimeout(() => {
            navigate("/?status=success");
          }, 4000);
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        navigate("/?status=failed");
      }
    };

    verifyPayment();
  }, [pidx, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-xl font-semibold text-white">
        Verifying your payment...
      </h1>
    </div>
  );
};

export default PaymentSuccess;
