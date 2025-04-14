import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/RestaurantList.css';
import restaurant1 from '../assets/images/restaurant1.jpg';
import restaurant2 from '../assets/images/restaurant2.jpg';
import restaurant3 from '../assets/images/restaurant3.jpg';

const RestaurantList = () => {
  const restaurants = [
    { id: 1, name: 'Nhà hàng A', description: 'Món ăn ngon, giá cả hợp lý', image: restaurant1, location: 'TP. HCM', style: 'Buffet' },
    { id: 2, name: 'Nhà hàng B', description: 'Không gian sang trọng', image: restaurant2, location: 'Hà Nội', style: 'Lẩu' },
    { id: 3, name: 'Nhà hàng C', description: 'Ẩm thực độc đáo', image: restaurant3, location: 'Đà Nẵng', style: 'Nhật' },
  ];

  return (
    <section className="restaurant-list">
      <h2>Danh sách nhà hàng</h2>
      <div className="restaurant-cards">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <img src={restaurant.image} alt={restaurant.name} />
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <p className="location">Vị trí: {restaurant.location}</p>
            <p className="style">Kiểu nhà hàng: {restaurant.style}</p>
            <Link to={`/restaurant/${restaurant.id}`}>
              <button className="view-btn">Xem chi tiết</button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RestaurantList;