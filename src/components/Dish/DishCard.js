import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/FeaturedSection.css";

const DishCard = ({ dish }) => {
  return (
    <Link to={`/dish/${dish.id}`} className="dish-link">
      <div className="dish-item">
        <img src={dish.image} alt={dish.name} className="dish-image" />
        <div className="dish-details">
          <h3 className="dish-name">{dish.name}</h3>
          <p className="price">{dish.price.toLocaleString()}đ</p>
        </div>
      </div>
    </Link>
  );
};

export default DishCard;
