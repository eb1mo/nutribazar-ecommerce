import React from "react";
import NutritionCard from "./NutritionCard";
import { nutritionData } from "./data";

const NutritionCardList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
      {/* Left Side: Large Card */}
      <div className="md:col-span-1">
        <NutritionCard {...nutritionData[0]} size="h-[500px]" />
      </div>

      {/* Right Side: Two Bigger Stacked Cards */}
      <div className="md:col-span-1 flex flex-col gap-6">
        <NutritionCard {...nutritionData[1]} size="h-[240px]" />
        <NutritionCard {...nutritionData[2]} size="h-[240px]" />
      </div>

      {/* Far Right: Taller Card */}
      <div className="md:col-span-1">
        <NutritionCard {...nutritionData[3]} size="h-[500px]" />
      </div>
    </div>
  );
};

export default NutritionCardList;
