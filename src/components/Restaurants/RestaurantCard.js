import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "../../assets/styles/FeaturedSection.css";
import { addFavoriteRestaurant } from "../../services/userService";
import { UserContext } from "../../contexts/UserContext";
import FavoriteButton from "../basicComponents/FavoriteButton";

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);
  const stars = [];

  for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} color="#f4c150" />);
  if (half) stars.push(<FaStarHalfAlt key="half" color="#f4c150" />);
  for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`empty-${i}`} color="#ccc" />);

  return <div className="star-icons">{stars}</div>;
};

const formatNumber = (num) => {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
  return num.toString();
};

const RestaurantCard = ({ id, image, name, rating, address, visits }) => {
  const { isLogin } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    if (!isLogin) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
      return;
    }
    setIsFavorite(!isFavorite);
    addFavoriteRestaurant(id);
  };

  return (
    <div className="restaurant-item">
      <FavoriteButton
        isActive={isFavorite}
        onClick={handleFavoriteClick}
        restaurantId={id}
      />
      <img src={image} alt={name} className="restaurant-image" />
      <div className="restaurant-details">
        <h3>{name}</h3>
        <div className="restaurant-meta">
          {renderStars(rating)}
          <span className="visit-count">{formatNumber(visits)} lượt đến</span>
        </div>
        {address && <p className="restaurant-address">{address}</p>}
        <Link to={`/restaurant/${id}`}>
          <button className="rc-button">Đặt bàn giữ chỗ</button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
