import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import "../../assets/styles/Restaurant/RestaurantCard.css";
import { addFavoriteRestaurant, removeFavoriteRestaurant, getFavoriteRestaurants } from "../../services/userService";
import { UserContext } from "../../contexts/UserContext";

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);
  const stars = [];

  for (let i = 0; i < full; i++)
    stars.push(<FaStar key={`full-${i}`} color="#f4c150" />);
  if (half) stars.push(<FaStarHalfAlt key="half" color="#f4c150" />);
  for (let i = 0; i < empty; i++)
    stars.push(<FaRegStar key={`empty-${i}`} color="#ccc" />);

  return <div className="rc-star-icons">{stars}</div>;
};

const formatNumber = (num) => {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
  return num.toString();
};

const RestaurantCard = ({ id, thumbnailUrl, name, averageRating, address, visits }) => {
  const { isLogin = false } = useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (isLogin) {
        try {
          const favorites = await getFavoriteRestaurants();
          setIsFavorite(favorites.some(fav => fav.id === parseInt(id)));
        } catch (err) {
          console.error("Lỗi khi kiểm tra trạng thái yêu thích:", err);
        }
      }
    };
    fetchFavoriteStatus();
  }, [id, isLogin]);

  const handleFavoriteClick = async () => {
    if (!isLogin) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
      return;
    }

    try {
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);

      if (newIsFavorite) {
        await addFavoriteRestaurant(id);
      } else {
        await removeFavoriteRestaurant(id);
      }
    } catch (err) {
      console.error("Lỗi khi thay đổi yêu thích:", err);
      setIsFavorite(!isFavorite);
      alert("Không thể cập nhật danh sách yêu thích. Vui lòng thử lại.");
    }
  };

  return (
    <div className="rc-item">
      <div className={`rc-favorite-icon ${isFavorite ? 'active' : ''}`} onClick={handleFavoriteClick}>
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </div>
      <div className="rc-image-container">
        <img
          src={thumbnailUrl || "/fallback.jpg"}
          alt={name}
          className="rc-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback.jpg";
          }}
        />
      </div>
      <div className="rc-details">
        <h3 className="rc-name">{name}</h3>
        <div className="rc-meta">
          {renderStars(averageRating)}
          <span className="rc-visit-count">{formatNumber(visits || 0)} Lượt đặt</span>
        </div>
        {address && <p className="rc-address">{address}</p>}
        <Link to={`/restaurant/${id}`}>
          <button className="rc-button">Đặt bàn giữ chỗ</button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;