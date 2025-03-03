import { useEffect, useState } from "react";
import axios from "axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users");
        setUsers(res.data);
      } catch (e) {
        console.log(e.message);
      }
    };
    fetchUsers();
  }, []);
  return (
    <div className="text-center text-white">
      <h1 className="text-2xl font-semibold pt-16 mb-10">All Users</h1>
      <div className="flex justify-center mt-10">
        <table className="border border-gray-500 border-separate border-spacing-x-32 border-spacing-y-5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="bg-red-500 p-2 rounded ">Delete</button>
              </td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
