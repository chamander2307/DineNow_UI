import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import '../../assets/styles/RestaurantDetail.css';

import restaurant1 from '../../assets/img/restaurant1.jpg';
import restaurant2 from '../../assets/img/restaurant2.jpg';
import restaurant3 from '../../assets/img/restaurant3.jpg';

import RestaurantReviewForm from '../../components/RestaurantReviewForm';

const RestaurantDetail = () => {
  const { id } = useParams();
  const categories = [
    { name: 'Tất cả' },
    { name: 'Cơm' },
    { name: 'Canh' },
    { name: 'Món thêm' },
    { name: 'Nước giải khát' },
  ];

 const restaurants = [
    {
      id: 1,
      name: 'Nhà hàng A',
      address: '123 Đường Ẩm Thực, TP. HCM',
      location: 'TP. HCM',
      style: 'Lẩu',
      image: restaurant1,
      menuItems: [
        { name: 'Lẩu', price: 99000, image: restaurant1, category: 'Cơm' },
        { name: 'Lẩu 2', price: 37000, image: restaurant1, category: 'Cơm' },
        { name: 'Lẩu 3', price: 52999, image: restaurant1, category: 'Cơm' },
      ],
      reviews: [
        { user: 'Nguyễn Văn A', comment: 'Đồ ăn rất ngon, không gian thoải mái!', rating: 5 },
        { user: 'Trần Thị B', comment: 'Phục vụ tốt nhưng giá hơi cao.', rating: 4 },
      ],
    },
    {
      id: 2,
      name: 'Nhà hàng B',
      address: '456 Đường Ẩm Thực, TP. HCM',
      location: 'Hà Nội',
      style: 'Buffet',
      image: restaurant2,
      menuItems: [
        { name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, image: restaurant1, category: 'Cơm' },
        { name: 'Cơm Thố Gà + Ốp La', price: 37000, image: restaurant1, category: 'Cơm' },
        { name: 'Cơm Thố Gà Nướng BBQ Hàn', price: 52999, image: restaurant1, category: 'Cơm' },
        { name: 'Coca Cola', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { name: 'Pepsi', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { name: 'Canh chua', price: 11000, image: restaurant1, category: 'Canh' },
        { name: 'Canh bí', price: 11000, image: restaurant1, category: 'Canh' },
      ],
      reviews: [
        { user: 'Lê Văn C', comment: 'Không gian sang trọng, rất thích!', rating: 5 },
        { user: 'Lê Văn A', comment: 'Không gian sang trọng, rất thích!', rating: 4 },
      ],
    },
    {
      id: 3,
      name: 'Nhà hàng C',
      address: '789 Đường Ẩm Thực, TP. HCM',
      location: 'Đà Nẵng',
      style: 'Nhật',
      image: restaurant3,
      menuItems: [
        { name: 'Cơm Heo Giòn Teriyaki', price: 99000, image: restaurant1, category: 'Cơm' },
        { name: 'Sushi', price: 37000, image: restaurant1, category: 'Cơm' },
        { name: 'Súp Misho', price: 52999, image: restaurant1, category: 'Canh' },
        { name: 'Coca Cola', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { name: 'Pepsi', price: 11000, image: restaurant1, category: 'Nước giải khát' },
      ],
      reviews: [
        { user: 'Phạm Thị D', comment: 'Ẩm thực độc đáo, đáng thử!', rating: 4 },
      ],
    },
  ];

  const restaurant = restaurants.find((r) => r.id === parseInt(id)) || {};

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || '');

  const filteredMenuItems = restaurant.menuItems
    ? restaurant.menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Tất cả' ? true : item.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
    : [];

  return (
    <div className="restaurant-detail">
      {/* Thông tin nhà hàng */}
      <div className="restaurant-info">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-image1" />
        <div className="restaurant-details1">
          <h1>{restaurant.name}</h1>
          <p className="location">Vị trí: {restaurant.location}</p>
          <p className="style">Kiểu nhà hàng: {restaurant.style}</p>
          <p className="address">Địa chỉ: {restaurant.address}</p>
          <button className="book-btn">Đặt bàn ngay</button>
        </div>
      </div>

      {/* Danh mục, Thực đơn và Đánh giá */}
      <div className="menu-and-reviews">
        {/* Danh mục món ăn */}
        <div className="categories-section">
          <h2>Thực đơn</h2>
          <ul className="categories-list">
            {categories.map((category, index) => (
              <li
                key={index}
                className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Thực đơn */}
        <div className="menu-section">
          {/* Ô tìm kiếm */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm món..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="menu-items">
            {filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item, index) => (
                <div key={index} className="menu-item">
                  <img src={item.image} alt={item.name} className="menu-item-image" />
                  <div className="menu-item-details">
                    <p className="menu-item-name">{item.name}</p>
                    <p className="menu-item-price">{item.price.toLocaleString()}đ</p>
                    {/*<button className="add-btn">+</button>*/}
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy món ăn nào.</p>
            )}
          </div>
        </div>

        {/* Đánh giá */}
        <div className="reviews-section">
          <RestaurantReviewForm restaurantId={restaurant.id} existingReviews={restaurant.reviews} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;