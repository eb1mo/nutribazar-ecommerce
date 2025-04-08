import { Outlet } from "react-router-dom";
import Navigation from "./Pages/Auth/Navigation";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { SearchProvider } from './Context/SearchContext';
import SearchResults from './Pages/SearchResults';
import Footer from './Components/Footer';

function App() {
  const [userInfo, setUserInfo] = useState(
    JSON.parse(localStorage.getItem("userInfo")) || null
  );

  return (
    <SearchProvider>
      <ToastContainer />
      <Navigation userInfo={userInfo} />
      <main className="m-auto">
        <Outlet context={{ setUserInfo }} />
      </main>
      <Footer />
    </SearchProvider>
  );
}

export default App;
