import { Outlet } from "react-router-dom";
import Navigation from "./Pages/Auth/Navigation";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

function App() {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );
  return (
    <>
      <ToastContainer />
      <Navigation userInfo={userInfo} />
      <main className="m-auto">
        <Outlet context={{ setUserInfo }} />
      </main>
    </>
  );
}

export default App;
