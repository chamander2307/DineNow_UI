import { Link } from "react-router-dom";
import fallbackImage from "../../assets/img/fallback.jpg"; 
import "../../assets/styles/Dish/DishCard.css";

const DishCard = ({ dish, restaurantId }) => {
  // Sử dụng biến môi trường hoặc mặc định
  const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

  // Format price with Vietnamese currency (VNĐ)
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(dish.price || 0));

  // Render star icons based on averageRating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < fullStars ? "dc-star filled" : "dc-star"}>
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
      // Xóa các dấu / thừa ở đầu
      imageUrl = `${BASE_URL}/uploads/${dish.imageUrl.replace(/^\/+/, '')}`;
    }
  }
  console.log("Image URL for dish", dish.name, ":", imageUrl); // Debug

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
            <span className="dc-rating">{renderStars(dish.averageRating)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DishCard;