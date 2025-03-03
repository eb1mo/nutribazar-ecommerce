import axios from "axios";
import { useEffect, useState } from "react";
import { updateUser } from "../../../../e-commerce-backend/controllers/userController";

const UpdateUser = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.patch("http://localhost:5000/api/users/update");
        setUserInfo(res.data);
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchUser();
  }, []);
  return (
    <div>
      <h1>Update User</h1>
    </div>
  );
};

export default UpdateUser;
