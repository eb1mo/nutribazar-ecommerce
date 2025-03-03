import React from "react";
import PropTypes from "prop-types";

const NutritionCard = ({ title, description, imageUrl, size }) => {
  return (
    <div className={`relative w-full ${size} rounded-lg overflow-hidden shadow-xl`}>
      {/* Background Image */}
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center text-center p-6">
        <h3 className="text-white text-2xl font-bold">{title}</h3>
        <p className="text-white text-lg mt-2">{description}</p>
      </div>
    </div>
  );
};

NutritionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default NutritionCard;
