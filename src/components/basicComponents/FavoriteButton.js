import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const FavoriteButton = ({ restaurantId, isActive, onClick }) => {
  return (
    <div className="favorite-icon" onClick={onClick}>
      {isActive ? <FaHeart /> : <FaRegHeart />}
    </div>
  );
};

export default FavoriteButton;