import React from "react";
import { Link } from "react-router-dom";
import fallbackImage from "../../assets/img/fallback.jpg"; // Import ảnh dự phòng
import "../../assets/styles/home/FeaturedSection.css";

const DishCard = ({ dish }) => {
  // Base URL cho ảnh từ server
  const BASE_URL = "http://localhost:8080";

  // Format price with Vietnamese currency (VNĐ)
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(dish.price || 0)); // Đảm bảo price không undefined

  // Render star icons based on averageRating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0); // Đảm bảo rating không undefined
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? "star filled" : "star"}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Xác định URL ảnh
  let imageUrl = fallbackImage;
  if (dish.imageUrl && dish.imageUrl.trim() !== "") {

    if (dish.imageUrl.startsWith("http")) {
      imageUrl = dish.imageUrl;
    } else {
      imageUrl = `${BASE_URL}/uploads/${dish.imageUrl}`;
    }
  }

  return (
    <Link to={`/dish/${dish.id}`} className="dish-link">
      <div className="dish-item">
        <div className="dish-image-container">
          <img
            src={imageUrl}
            alt={dish.name || "Món ăn"}
            className="dish-image"
            onError={(e) => {
              e.target.src = fallbackImage; // Chuyển sang ảnh dự phòng nếu lỗi
            }}
          />
          <button className="favorite-button">❤️</button>
        </div>
        <div className="dish-details">
          <h3 className="dish-name">{dish.name || "Chưa có tên"}</h3>
          <p className="dish-description">{dish.description || "Chưa có mô tả."}</p>
          <p className="dish-type">{dish.typeName || "Không xác định"}</p>
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