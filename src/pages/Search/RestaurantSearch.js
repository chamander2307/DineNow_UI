import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../../assets/styles/RestaurantSearch.css';

import restaurant1 from '../../assets/images/restaurant1.jpg';
import restaurant2 from '../../assets/images/restaurant2.jpg';
import restaurant3 from '../../assets/images/restaurant3.jpg';

const RestaurantSearch = () => {
  const initialRestaurants = [
    { id: 1, name: 'Nhà hàng A', description: 'Món ăn ngon, giá cả hợp lý', image: restaurant1, location: 'TP. HCM', style: 'Lẩu' },
    { id: 2, name: 'Nhà hàng B', description: 'Không gian sang trọng', image: restaurant2, location: 'Hà Nội', style: 'Buffet' },
    { id: 3, name: 'Nhà hàng C', description: 'Ẩm thực độc đáo', image: restaurant3, location: 'Đà Nẵng', style: 'Nhật' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [styleFilter, setStyleFilter] = useState('');

  const filteredRestaurants = initialRestaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter ? restaurant.location === locationFilter : true;
    const matchesStyle = styleFilter ? restaurant.style === styleFilter : true;
    return matchesSearch && matchesLocation && matchesStyle;
  });

  return (
    <div className="restaurant-search">
      <h2>Tìm kiếm nhà hàng</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm nhà hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="location">Vị trí</label>
          <select
            id="location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="TP. HCM">TP. HCM</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="style">Kiểu nhà hàng</label>
          <select
            id="style"
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="Buffet">Buffet</option>
            <option value="Lẩu">Lẩu</option>
            <option value="Nhật">Nhật</option>
            <option value="Hàn">Hàn</option>
            <option value="Âu">Âu</option>
          </select>
        </div>
      </div>
      <div className="restaurant-list">
        {filteredRestaurants.length > 0 ? (
          <div className="restaurant-cards">
            {filteredRestaurants.map((restaurant) => (
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
        ) : (
          <p>Không tìm thấy nhà hàng nào.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantSearch;