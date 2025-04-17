import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import '../../assets/styles/RestaurantDetail.css';

import restaurant1 from '../../assets/img/restaurant1.jpg';
import restaurant2 from '../../assets/img/restaurant2.jpg';
import restaurant3 from '../../assets/img/restaurant3.jpg';

import RestaurantReviewForm from '../../components/RestaurantReviewForm';

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Khởi tạo isLiked từ localStorage
  const [isLiked, setIsLiked] = useState(() => {
    const likedRestaurants = JSON.parse(localStorage.getItem('likedRestaurants')) || {};
    return likedRestaurants[id] || false;
  });

  // State để quản lý danh sách món ăn đã chọn
  const [selectedItems, setSelectedItems] = useState([]);

  // Cập nhật localStorage khi isLiked thay đổi
  useEffect(() => {
    const likedRestaurants = JSON.parse(localStorage.getItem('likedRestaurants')) || {};
    likedRestaurants[id] = isLiked;
    localStorage.setItem('likedRestaurants', JSON.stringify(likedRestaurants));
  }, [isLiked, id]);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

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
        { id: '1', name: 'Lẩu', price: 99000, image: restaurant1, category: 'Cơm' },
        { id: '2', name: 'Lẩu 2', price: 37000, image: restaurant1, category: 'Cơm' },
        { id: '3', name: 'Lẩu 3', price: 52999, image: restaurant1, category: 'Cơm' },
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
        { id: '4', name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, image: restaurant1, category: 'Cơm' },
        { id: '5', name: 'Cơm Thố Gà + Ốp La', price: 37000, image: restaurant1, category: 'Cơm' },
        { id: '6', name: 'Cơm Thố Gà Nướng BBQ Hàn', price: 52999, image: restaurant1, category: 'Cơm' },
        { id: '7', name: 'Coca Cola', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { id: '8', name: 'Pepsi', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { id: '9', name: 'Canh chua', price: 11000, image: restaurant1, category: 'Canh' },
        { id: '10', name: 'Canh bí', price: 11000, image: restaurant1, category: 'Canh' },
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
        { id: '11', name: 'Cơm Heo Giòn Teriyaki', price: 99000, image: restaurant1, category: 'Cơm' },
        { id: '12', name: 'Sushi', price: 37000, image: restaurant1, category: 'Cơm' },
        { id: '13', name: 'Súp Misho', price: 52999, image: restaurant1, category: 'Canh' },
        { id: '14', name: 'Coca Cola', price: 11000, image: restaurant1, category: 'Nước giải khát' },
        { id: '15', name: 'Pepsi', price: 11000, image: restaurant1, category: 'Nước giải khát' },
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

  // Hàm xử lý khi nhấn nút dấu cộng
  const handleAddItem = (item) => {
    const existingItem = selectedItems.find((selected) => selected.id === item.id);
    if (existingItem) {
      // Nếu món đã có, tăng số lượng
      setSelectedItems(
        selectedItems.map((selected) =>
          selected.id === item.id ? { ...selected, quantity: selected.quantity + 1 } : selected
        )
      );
    } else {
      // Nếu món chưa có, thêm mới với số lượng 1
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  // Hàm xử lý khi nhấn nút dấu trừ (xóa hoặc giảm số lượng)
  const handleRemoveItem = (item) => {
    const existingItem = selectedItems.find((selected) => selected.id === item.id);
    if (existingItem.quantity > 1) {
      // Nếu số lượng > 1, giảm số lượng
      setSelectedItems(
        selectedItems.map((selected) =>
          selected.id === item.id ? { ...selected, quantity: selected.quantity - 1 } : selected
        )
      );
    } else {
      // Nếu số lượng = 1, xóa món khỏi danh sách
      setSelectedItems(selectedItems.filter((selected) => selected.id !== item.id));
    }
  };

  // Hàm xử lý khi nhấn "Đặt bàn ngay"
  const handleBookNow = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một món ăn trước khi đặt bàn!');
      return;
    }
    navigate('/payment', { state: { restaurant, selectedItems } });
  };
    
  return (
    <div className="restaurant-detail">
      {/* Thông tin nhà hàng */}
      <div className="restaurant-info">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-image1" />
        <div className="restaurant-details1">
          <div className="restaurant-header">
            <h1>{restaurant.name}</h1>
          </div>
          <p className="location">Vị trí: {restaurant.location}</p>
          <p className="style">Kiểu nhà hàng: {restaurant.style}</p>
          <p className="address">Địa chỉ: {restaurant.address}</p>
          <button className="book-btn" onClick={handleBookNow}>Đặt bàn ngay</button>
          <button className="heart" onClick={toggleLike}>
            {isLiked ? <FaHeart color="#e74c3c" /> : <FaRegHeart color="#ccc" />}
          </button>
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
              filteredMenuItems.map((item, index) => {
                const itemQuantity = selectedItems.find((selected) => selected.id === item.id)?.quantity || 0;
                return (
                  <div key={index} className="menu-item">
                    <Link to={`/dish/${item.id}`} className="menu-item-link">
                      <img src={item.image} alt={item.name} className="menu-item-image" />
                      <div className="menu-item-details">
                        <p className="menu-item-name">{item.name}</p>
                        <p className="menu-item-price">{item.price.toLocaleString()}đ</p>
                      </div>
                    </Link>
                    <div className="add-item-container">
                      {itemQuantity > 0 && (
                        <>
                          <button className="remove-btn" onClick={() => handleRemoveItem(item)}>-</button>
                          <span className="item-quantity">{itemQuantity}</span>
                        </>
                      )}
                      <button className="add-btn" onClick={() => handleAddItem(item)}>+</button>
                    </div>
                  </div>
                );
              })
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