import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/FeaturedSection.css';
import restaurant1 from '../assets/images/restaurant1.jpg';
import restaurant2 from '../assets/images/restaurant2.jpg';
import restaurant3 from '../assets/images/restaurant3.jpg';

const FeaturedSection = () => {
  // Dữ liệu giả lập cho món ăn đặc sắc
  const featuredDishes = [
    {
      id: 1,
      name: 'Cơm Thố Heo Giòn Teriyaki',
      price: 99000,
      image: restaurant1,
      restaurantId: 1,
    },
    {
      id: 2,
      name: 'Cơm Thố Gà Nướng BBQ Hàn',
      price: 52999,
      image: restaurant2,
      restaurantId: 2,
    },
    {
      id: 3,
      name: 'Cơm Thố Gà Nướng + Ớp La',
      price: 60999,
      image: restaurant3,
      restaurantId: 3,
    },
  ];

  // Dữ liệu giả lập cho nhà hàng đặc sắc
  const featuredRestaurants = [
    {
      id: 1,
      name: 'Nhà hàng A',
      location: 'TP. HCM',
      rating: 4.8,
      image: restaurant1,
    },
    {
      id: 2,
      name: 'Nhà hàng B',
      location: 'Hà Nội',
      rating: 4.7,
      image: restaurant2,
    },
    {
      id: 3,
      name: 'Nhà hàng C',
      location: 'Đà Nẵng',
      rating: 4.6,
      image: restaurant3,
    },
  ];

  return (
    <div className="featured-section">
      {/* Món ăn đặc sắc */}
      <div className="featured-dishes">
        <h2>Món ăn đặc sắc</h2>
        <div className="dishes-list">
          {featuredDishes.map((dish) => (
            <div key={dish.id} className="dish-item">
              <img src={dish.image} alt={dish.name} className="dish-image" />
              <div className="dish-details">
                <h3 className="dish-name">{dish.name}</h3>
                <p className="dish-price">{dish.price.toLocaleString()}đ</p>
                <Link to={`/restaurant/${dish.restaurantId}`} className="view-btn">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nhà hàng đặc sắc */}
      <div className="featured-restaurants">
        <h2>Nhà hàng được đánh giá cao</h2>
        <div className="restaurants-list">
          {featuredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-item">
              <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
              <div className="restaurant-details">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                <p className="restaurant-location">{restaurant.location}</p>
                <p className="restaurant-rating">Đánh giá: {restaurant.rating}/5</p>
                <Link to={`/restaurant/${restaurant.id}`} className="view-btn">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedSection;