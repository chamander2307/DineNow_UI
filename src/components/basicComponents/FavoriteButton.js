import React, { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavoriteRestaurant, removeFavoriteRestaurant } from "../../services/userService";

const FavoriteButton = ({ restaurantId, isActive }) => {
  const [favorite, setFavorite] = useState(isActive);

  const toggleFavorite = async () => {
    try {
      if (favorite) {
        await removeFavoriteRestaurant(restaurantId);
      } else {
        await addFavoriteRestaurant(restaurantId);
      }
      setFavorite(!favorite);
    } catch (error) {
      console.error("Lỗi khi thay đổi yêu thích:", error);
    }
  };

  return (
    <div className="favorite-icon" onClick={toggleFavorite}>
      {favorite ? <FaHeart /> : <FaRegHeart />}
    </div>
  );
};

export default FavoriteButton;
