import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/styles/RestaurantDetail.css';
import restaurant1 from '../../assets/images/restaurant1.jpg';
import restaurant2 from '../../assets/images/restaurant2.jpg';
import restaurant3 from '../../assets/images/restaurant3.jpg';

const RestaurantDetail = () => {
  const { id } = useParams(); // Lấy id từ URL

  // Danh mục món ăn (dữ liệu giả lập)
  const categories = [
    { name: 'Tất cả' },
    { name: 'Cơm thố' },
    { name: 'Canh' },
    { name: 'Món thêm' },
    { name: 'Nước giải khát' },
  ];

  // Dữ liệu giả lập
  const restaurants = [
    {
      id: 1,
      name: 'Nhà hàng A',
      address: '123 Đường Ẩm Thực, TP. HCM',
      location: 'TP. HCM',
      style: 'Buffet',
      image: restaurant1,
      menuItems: [
        { name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, image: restaurant1, category: 'Cơm thố' },
        { name: 'Cơm Thố Gà + Ốp La', price: 37000, image: restaurant1, category: 'Cơm thố' },
        { name: 'Cơm Thố Gà Nướng BBQ Hàn', price: 52999, image: restaurant1, category: 'Cơm thố' },
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
      style: 'Lẩu',
      image: restaurant2,
      menuItems: [
        { name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, image: restaurant1, category: 'Cơm thố' },
        { name: 'Cơm Thố Gà + Ốp La', price: 37000, image: restaurant1, category: 'Cơm thố' },
        { name: 'Cơm Thố Gà Nướng BBQ Hàn', price: 52999, image: restaurant1, category: 'Cơm thố' },
        { name: 'Coca Cola', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { name: 'Pepsi', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { name: 'Canh chua', price: 11000, image: restaurant1, category: 'Canh' },
        { name: 'Canh bí', price: 11000, image: restaurant1, category: 'Canh' },
      ],
      reviews: [
        { user: 'Lê Văn C', comment: 'Không gian sang trọng, rất thích!', rating: 5 },
        { user: 'Lê Văn a', comment: 'Không gian sang trọng, rất thích!', rating: 4 },
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
        { name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, image: restaurant1, category: 'Cơm thố' },
        { name: 'Cơm Thố Gà + Ớp La', price: 37000, image: restaurant1, category: 'Cơm thố' },
        { name: 'Cơm Thố Gà Nướng BBQ Hàn', price: 52999, image: restaurant1, category: 'Cơm thố' },
        { name: 'Coca Cola', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { name: 'Pepsi', price: 11000, image: restaurant1, category: 'Nước giải khát' },
      ],
      reviews: [
        { user: 'Phạm Thị D', comment: 'Ẩm thực độc đáo, đáng thử!', rating: 4 },
      ],
    },
  ];

  // Tìm nhà hàng theo id
  const restaurant = restaurants.find((r) => r.id === parseInt(id)) || {};

  // State để quản lý ô tìm kiếm và danh mục được chọn
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || '');

  // Tạo refs cho từng danh mục
  const categoryRefs = useRef({});

  // Lọc danh sách món ăn dựa trên ô tìm kiếm (bỏ lọc theo danh mục)
  const filteredMenuItems = restaurant.menuItems
    ? restaurant.menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Nhóm món ăn theo danh mục
  const groupedMenuItems = categories
    .filter((category) => category.name !== 'Tất cả') // Bỏ qua danh mục "Tất cả" trong danh sách món
    .map((category) => ({
      category: category.name,
      items: filteredMenuItems.filter((item) => item.category === category.name),
    }))
    .filter((group) => group.items.length > 0); // Chỉ hiển thị danh mục có món ăn

  // Xử lý khi nhấp vào danh mục
  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    if (categoryName === 'Tất cả') {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang nếu chọn "Tất cả"
    } else {
      const categoryRef = categoryRefs.current[categoryName];
      if (categoryRef) {
        categoryRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="restaurant-detail">
      {/* Thông tin nhà hàng */}
      <div className="restaurant-info">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
        <div className="restaurant-details">
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
                onClick={() => handleCategoryClick(category.name)}
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
            {groupedMenuItems.length > 0 ? (
              groupedMenuItems.map((group, index) => (
                <div key={index} className="menu-category">
                  <h3
                    ref={(el) => (categoryRefs.current[group.category] = el)}
                    className="category-title"
                  >
                    {group.category}
                  </h3>
                  {group.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="menu-item">
                      <img src={item.image} alt={item.name} className="menu-item-image" />
                      <div className="menu-item-details">
                        <p className="menu-item-name">{item.name}</p>
                        <p className="menu-item-price">{item.price.toLocaleString()}đ</p>
                        <button className="add-btn">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>Không tìm thấy món ăn nào.</p>
            )}
          </div>
        </div>

        {/* Đánh giá */}
        <div className="reviews-section">
          <h2>Đánh giá</h2>
          {restaurant.reviews && restaurant.reviews.length > 0 ? (
            restaurant.reviews.map((review, index) => (
              <div key={index} className="review">
                <p className="user">{review.user}</p>
                <p className="comment">{review.comment}</p>
                <p className="rating">Đánh giá: {review.rating}/5</p>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;