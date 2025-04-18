import React from "react";
import "../assets/styles/FeaturedSection.css";

const DishCard = ({ dish }) => {
  return (
    <div className="dish-item">
      <img src={dish.image} alt={dish.name} className="dish-image" />
      <div className="dish-details">
        <h3>{dish.name}</h3>
        <p className="price">{dish.price.toLocaleString()}đ</p>
      </div>
    </div>
  );
};

export default DishCard;
