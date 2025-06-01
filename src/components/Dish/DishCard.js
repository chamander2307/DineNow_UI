import { Link } from "react-router-dom";
import fallbackImage from "../../assets/img/fallback.jpg";
import "../../assets/styles/Dish/DishCard.css";

const DishCard = ({ dish, restaurantId }) => {
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(dish.price || 0));

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = rating !== undefined ? rating : 0;
    const fullStars = Math.floor(roundedRating);
    const hasHalfStar = roundedRating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="dc-star filled">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="dc-star half-filled">★</span>);
      } else {
        stars.push(<span key={i} className="dc-star">★</span>);
      }
    }
    return stars;
  };

  let imageUrl = fallbackImage;
  if (dish.imageUrl && dish.imageUrl.trim() !== "") {
    if (dish.imageUrl.startsWith("http")) {
      imageUrl = dish.imageUrl;
    } else {
      imageUrl = `${BASE_URL}/uploads/${dish.imageUrl.replace(/^\/+/, '')}`;
    }
  }
  console.log("Image URL for dish", dish.name, ":", imageUrl);
  console.log("Average rating for dish", dish.name, ":", dish.averageRating);

  return (
    <Link
      to={`/restaurant/${restaurantId}`}
      state={{ selectedDishId: dish.id }}
      className="dc-link"
    >
      <div className="dc-item">
        <div className="dc-image-container">
          <img
            src={imageUrl}
            alt={dish.name || "Món ăn"}
            className="dc-image"
            onError={(e) => {
              console.warn(`Failed to load image for dish ${dish.name}: ${imageUrl}`);
              e.target.src = fallbackImage;
            }}
          />
        </div>
        <div className="dc-details">
          <h3>{dish.name || "Chưa có tên"}</h3>
          <p className="dc-description">{dish.description || "Chưa có mô tả."}</p>
          <p className="dc-type">{dish.typeName || "Không xác định"}</p>
          <div className="dc-meta">
            <span className="dc-price">{formattedPrice}</span>
            <span className="dc-rating">
              {renderStars(dish.averageRating)}
              {dish.averageRating !== undefined ? dish.averageRating.toFixed(1) : "Chưa có"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DishCard;