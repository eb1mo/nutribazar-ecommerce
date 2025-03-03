import NutritionCardList from "../Components/NutritionCards/NutritionCardList";
// import NutritionCards from "../Components/NutritionCards";
import Slider from "../Components/Slider";
import FeaturedProducts from "../Components/FeaturedProducts";
// import Card from "../Components/Card";
import AllProducts from "../Components/AllProducts";
import Footer from "../Components/Footer";

import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="my-10 py-10">
        {/* <Link to="/search" className="mb-10">
        Search
      </Link> */}
        <NutritionCardList />
      </div>
      <Slider />
      <FeaturedProducts />
      {/* <Card /> */}
      <AllProducts />
      <Footer />
    </div>
  );
}

export default Home;
