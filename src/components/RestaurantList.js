import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/RestaurantList.css';
import restaurant1 from '../images/restaurant1.jpg';
import restaurant2 from '../images/restaurant2.jpg';
import restaurant3 from '../images/restaurant3.jpg';

const RestaurantList = () => {
  const restaurants = [
    { id: 1, name: 'Nhà hàng A', description: 'Món ăn ngon, giá cả hợp lý', image: restaurant1 },
    { id: 2, name: 'Nhà hàng B', description: 'Không gian sang trọng', image: restaurant2 },
    { id: 3, name: 'Nhà hàng C', description: 'Ẩm thực độc đáo', image: restaurant3 },
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