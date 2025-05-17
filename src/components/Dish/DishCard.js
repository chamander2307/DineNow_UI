import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/home/FeaturedSection.css";

const DishCard = ({ dish }) => {
  // Format price with Vietnamese currency (VNĐ)
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(dish.price)); // Convert price to number

  // Render star icons based on averageRating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <Link to={`/dish/${dish.id}`} className="dish-link">
      <div className="dish-item">
        <div className="dish-image-container">
          <img
            src={dish.imageUrl || "/fallback.jpg"} // Use imageUrl and fallback
            alt={dish.name}
            className="dish-image"
          />
          <button className="favorite-button">❤️</button>
        </div>
        <div className="dish-details">
          <h3 className="dish-name">{dish.name}</h3>
          <p className="dish-description">{dish.description}</p>
          <p className="dish-type">{dish.typeName}</p>
          <div className="dish-meta">
            <span className="price">{formattedPrice}</span>
            <span className="rating">{renderStars(dish.averageRating)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DishCard;