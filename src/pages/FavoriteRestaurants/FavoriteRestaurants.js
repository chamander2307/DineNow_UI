import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from 'react-icons/fa';
import '../../assets/styles/Restaurant/FavoriteRestaurants.css';
import { getFavoriteRestaurants, removeFavoriteRestaurant } from '../../services/userService';

const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);
  const stars = [];

  for (let i = 0; i < full; i++)
    stars.push(<FaStar key={`full-${i}`} color="#f4c150" />);
  if (half) stars.push(<FaStarHalfAlt key="half" color="#f4c150" />);
  for (let i = 0; i < empty; i++)
    stars.push(<FaRegStar key={`empty-${i}`} color="#ccc" />);

  return <div className="fr-star-icons">{stars}</div>;
};

const formatNumber = (num) => {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "k";
  return num.toString();
};

const FavoriteRestaurants = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleUnlike = async (restaurantId, e) => {
    e.preventDefault();
    e.stopPropagation();
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
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="fr-item"
            >
              <div className="fr-image-container">
                <img
                  src={restaurant.thumbnailUrl || '/fallback.jpg'}
                  alt={restaurant.name}
                  className="fr-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/fallback.jpg';
                  }}
                />
                <div
                  className="favorite-btn active"
                  onClick={(e) => handleUnlike(restaurant.id, e)}
                >
                  <FaHeart />
                </div>
              </div>
              <div className="fr-details">
                <h3 className="fr-name">{restaurant.name}</h3>
                <div className="fr-meta">
                  {renderStars(restaurant.averageRating || 0)}
                  <span className="fr-visit-count">{formatNumber(restaurant.visits || 0)} Lượt đặt</span>
                </div>
                {restaurant.address && (
                  <p className="fr-address">{restaurant.address}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-message">Bạn chưa có nhà hàng yêu thích nào. Hãy quay lại và thích một nhà hàng!</p>
      )}
    </div>
  );
};

export default FavoriteRestaurants;