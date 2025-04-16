import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import restaurant1 from '../../assets/img/restaurant1.jpg';
import restaurant2 from '../../assets/img/restaurant2.jpg';
import restaurant3 from '../../assets/img/restaurant3.jpg';
import '../../assets/styles/FavoriteRestaurants.css';

const FavoriteRestaurants = () => {
  // Dữ liệu nhà hàng (phải giống với RestaurantDetail.js)
  const restaurantsData = [
    {
      id: 1,
      name: 'Nhà hàng A',
      address: '123 Đường Ẩm Thực, TP. HCM',
      location: 'TP. HCM',
      style: 'Lẩu',
      image: restaurant1,
    },
    {
      id: 2,
      name: 'Nhà hàng B',
      address: '456 Đường Ẩm Thực, TP. HCM',
      location: 'Hà Nội',
      style: 'Buffet',
      image: restaurant2,
    },
    {
      id: 3,
      name: 'Nhà hàng C',
      address: '789 Đường Ẩm Thực, TP. HCM',
      location: 'Đà Nẵng',
      style: 'Nhật',
      image: restaurant3,
    },
  ];

  // State để lưu danh sách nhà hàng yêu thích
  const [favorites, setFavorites] = useState(() => {
    const likedRestaurants = JSON.parse(localStorage.getItem('likedRestaurants')) || {};
    return restaurantsData.filter((restaurant) => likedRestaurants[restaurant.id]);
  });

  // Xử lý bỏ thích nhà hàng
  const handleUnlike = (id) => {
    const likedRestaurants = JSON.parse(localStorage.getItem('likedRestaurants')) || {};
    delete likedRestaurants[id];
    localStorage.setItem('likedRestaurants', JSON.stringify(likedRestaurants));

    const updatedFavorites = favorites.filter((restaurant) => restaurant.id !== id);
    setFavorites(updatedFavorites);
  };

  return (
    <div className="favorite-restaurants">
      <h1>Nhà hàng yêu thích</h1>
      {favorites.length > 0 ? (
        <div className="restaurant-list">
          {favorites.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
              <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
              <div className="restaurant-content">
                <div className="restaurant-header">
                  <Link to={`/restaurant/${restaurant.id}`} className="restaurant-name">
                    <h3>{restaurant.name}</h3>
                  </Link>
                  <button className="unlike-btn" onClick={() => handleUnlike(restaurant.id)}>
                    <FaHeart color="#e74c3c" /> Bỏ thích
                  </button>
                </div>
                <p className="restaurant-location">Vị trí: {restaurant.location}</p>
                <p className="restaurant-style">Kiểu nhà hàng: {restaurant.style}</p>
                <p className="restaurant-address">Địa chỉ: {restaurant.address}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-message">Bạn chưa có nhà hàng yêu thích nào. Hãy quay lại và thích một nhà hàng!</p>
      )}
    </div>
  );
};

export default FavoriteRestaurants;