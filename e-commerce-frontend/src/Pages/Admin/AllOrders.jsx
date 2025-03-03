import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/order/");
        setOrders(res.data);
      } catch (e) {
        toast.error(e.message);
      }
    };
    fetchAllOrders();
  }, []);
  return (
    <div className="text-white">
      <h1>All Orders</h1>
      {orders.map((order) => {
        return (
          <div key={order._id}>
            <p>{order.purchase_order_id}</p>
            <p>{order.user}</p>
            <p>{order.paymentStatus}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AllOrders;
