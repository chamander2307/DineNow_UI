import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/RestaurantCard.css";

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);
  const stars = [];

  for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} color="#f4c150" />);
  if (half) stars.push(<FaStarHalfAlt key="half" color="#f4c150" />);
  for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`empty-${i}`} color="#ccc" />);

  return <div className="rc-stars">{stars}</div>;
};

const formatNumber = (num) => {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
  return num.toString();
};

const RestaurantCard = ({ id, image, name, rating, priceLevel, address, visits }) => {
  return (
    <div className="restaurant-card">
      <img src={image} alt={name} className="rc-image" />
      <div className="rc-content">
        <h3 className="rc-name">{name}</h3>
        <div className="rc-meta">
          {renderStars(rating)}
          <span className="rc-visits">{formatNumber(visits)} lượt đến</span>
        </div>
        <p className="rc-address">{address}</p>
        {/*<button className="rc-button">Đặt bàn giữ chỗ</button>*/}
        <Link to={`/restaurant/${id}`}>
          <button className="rc-button">Đặt bàn giữ chỗ</button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
