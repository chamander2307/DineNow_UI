import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import DishReviews from '../../components/Dish/DishReviews';
import '../../assets/styles/DishDetail.css';
import { restaurants } from '../../data/restaurants';

// Hàm hiển thị sao dựa trên rating
const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);
  const stars = [];
  for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} />);
  if (half) stars.push(<FaStarHalfAlt key="half" />);
  for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`empty-${i}`} />);
  return <div className="star-rating">{stars}</div>;
};

const DishDetail = () => {
  const { id } = useParams();
  const [dish, setDish] = useState(null);

  useEffect(() => {
    // Tìm món ăn từ danh sách nhà hàng
    let foundDish = null;
    restaurants.forEach((restaurant) => {
      const menuItem = restaurant.menuItems.find((item) => item.id === id);
      if (menuItem) {
        foundDish = {
          ...menuItem,
          reviews: menuItem.reviews || [],
        };
      }
    });

    setDish(foundDish);
  }, [id]);

  if (!dish) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="dish-detail">
      <h1 className="dish-title">{dish.name}</h1>
      <div className="dish-content">
        <img src={dish.image} alt={dish.name} className="dish-images" />
        <div className="dish-info">
          <p className="dish-description">{dish.description || 'Món ăn thơm ngon, đáng thử!'}</p>
          <p className="dish-price">Giá: {dish.price.toLocaleString('vi-VN')} VNĐ</p>
          <div className="dish-rating">
            <span>Đánh giá: </span>
            {renderStars(dish.rating)}
            <span className="rating-number">({dish.rating})</span>
          </div>
        </div>
      </div>
      <DishReviews reviews={dish.reviews} />
    </div>
  );
};

export default DishDetail;