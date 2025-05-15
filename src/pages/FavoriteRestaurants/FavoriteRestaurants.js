import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import '../../assets/styles/Restaurant/FavoriteRestaurants.css';
import { getFavoriteRestaurants, removeFavoriteRestaurant } from '../../services/userService';

const FavoriteRestaurants = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lấy danh sách nhà hàng yêu thích từ API
  const loadFavorites = async () => {
    setLoading(true);
    try {
      const data = await getFavoriteRestaurants();
      console.log('Danh sách yêu thích từ server:', data);
      setFavorites(data || []);
    } catch (err) {
      setError('Không thể tải danh sách yêu thích');
      console.error('Lỗi khi lấy danh sách yêu thích:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Xử lý bỏ thích nhà hàng
  const handleUnlike = async (restaurantId) => {
    try {
      await removeFavoriteRestaurant(restaurantId);
      setFavorites(favorites.filter(fav => fav.id !== restaurantId));
      setError('');
    } catch (err) {
      setError('Không thể xóa nhà hàng khỏi danh sách yêu thích');
      console.error('Lỗi khi xóa yêu thích:', err);
    }
  };

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="favorite-restaurants">
      <h1>Nhà hàng yêu thích</h1>
      {favorites.length > 0 ? (
        <div className="restaurant-list">
          {favorites.map((restaurant) => (
            <div key={restaurant.id} className="restaurant-card">
              <img src={restaurant.thumbnailUrl || '/fallback.jpg'} alt={restaurant.name} className="restaurant-image" />
              <div className="restaurant-content">
                <div className="restaurant-header">
                  <Link to={`/restaurant/${restaurant.id}`} className="restaurant-name">
                    <h3>{restaurant.name}</h3>
                  </Link>
                  <button className="unlike-btn" onClick={() => handleUnlike(restaurant.id)}>
                    <FaHeart color="#e74c3c" /> Bỏ thích
                  </button>
                </div>
                <p className="restaurant-location">Vị trí: {restaurant.address.split(', ')[1] || 'Chưa có'}</p>
                <p className="restaurant-style">Kiểu nhà hàng: {restaurant.type?.name || 'Chưa có'}</p>
                <p className="restaurant-address">Địa chỉ: {restaurant.address || 'Chưa có'}</p>
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