import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import DishReviews from '../../components/Dish/DishReviews';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import featuredDishes from '../../data/featuredDishes';
import '../../assets/styles/Dish/DishDetail.css';
import restaurant1 from '../../assets/img/restaurant1.jpg';

// Dữ liệu mẫu
const mockData = {
  restaurant: {
    id: '1',
    name: 'Nhà hàng A',
    address: '123 Đường ABC',
    rating: 3.1,
  },
  dish: {
    id: '1',
    name: 'Món A',
    description: 'Món A là một món ăn truyền thống nổi tiếng, được chế biến từ những nguyên liệu tươi ngon nhất. Thịt bò được chọn lọc kỹ càng, thái lát mỏng và hầm trong nước dùng thơm lừng suốt 12 giờ để giữ được độ mềm ngọt tự nhiên. Kết hợp với bánh phở mềm dai, rau thơm tươi mát và các loại gia vị đặc trưng, món ăn mang đến hương vị đậm đà, tinh tế, làm hài lòng mọi thực khách. Đây là lựa chọn hoàn hảo cho những ai yêu thích sự hòa quyện giữa truyền thống và hiện đại trong ẩm thực.',
    rating: 4.5,
    image: restaurant1,
    restaurantImage: restaurant1,
    reviews: [
      { author: 'Người dùng 1', date: '2025-05-01', content: 'Rất ngon!', rating: 5 },
      { author: 'Người dùng 2', date: '2025-05-02', content: 'Tạm được.', rating: 4 },
    ],
  },
};

// Hàm hiển thị sao đánh giá
const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);
  const stars = [];
  for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} />);
  if (half) stars.push(<FaStarHalfAlt key="half" />);
  for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`empty-${i}`} />);
  return <div className="star-rating">{stars}</div>;
};

const DishDetail = () => {
  const { dishId } = useParams();

  // State để quản lý giỏ hàng
  const [cart, setCart] = useState(() => {
    const savedCart = JSON.parse(sessionStorage.getItem('cart')) || {};
    return savedCart[mockData.restaurant.id] || {};
  });

  // State để quản lý trạng thái yêu thích
  const [isLiked, setIsLiked] = useState(() => {
    const liked = JSON.parse(sessionStorage.getItem('likedDishes')) || {};
    return liked[dishId] || false;
  });

  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem('cart')) || {};
    savedCart[mockData.restaurant.id] = cart;
    sessionStorage.setItem('cart', JSON.stringify(savedCart));
  }, [cart]);

  useEffect(() => {
    const liked = JSON.parse(sessionStorage.getItem('likedDishes')) || {};
    liked[dishId] = isLiked;
    sessionStorage.setItem('likedDishes', JSON.stringify(liked));
  }, [isLiked, dishId]);

  // Lấy dữ liệu từ mockData
  const { dish, restaurant } = mockData;

  // Kiểm tra món ăn
  if (dish.id !== dishId) {
    return <div>Món ăn không tồn tại.</div>;
  }

  // Hàm thêm món vào giỏ hàng
  const addToCart = (dishId) => {
    setCart(prevCart => ({
      ...prevCart,
      [dishId]: (prevCart[dishId] || 0) + 1,
    }));
  };

  // Hàm tăng số lượng món
  const increaseQuantity = (dishId) => {
    setCart(prevCart => ({
      ...prevCart,
      [dishId]: prevCart[dishId] + 1,
    }));
  };

  // Hàm giảm số lượng món
  const decreaseQuantity = (dishId) => {
    setCart(prevCart => {
      const newQuantity = prevCart[dishId] - 1;
      if (newQuantity <= 0) {
        const { [dishId]: _, ...rest } = prevCart;
        return rest;
      }
      return {
        ...prevCart,
        [dishId]: newQuantity,
      };
    });
  };

  // Hàm xử lý yêu thích
  const toggleLike = () => setIsLiked(!isLiked);

  // Cấu hình slider
  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="dish-detail">
      {/* Phần đầu trang: ảnh nhà hàng và thông tin */}
      <div className="restaurant-header1">
        <div className="restaurant-image1">
          <img src={dish.restaurantImage} alt="Nhà hàng" />
        </div>
        <div className="restaurant-info">
          <h1 className="restaurant-name">{restaurant.name}</h1>
          <p className="restaurant-address">{restaurant.address}</p>
          <div className="restaurant-meta">
            <div className="restaurant-rating">
              {renderStars(restaurant.rating)}
              <span className="rating-number">({restaurant.rating})</span>
            </div>
            <button className="favorite-btn" onClick={toggleLike}>
              {isLiked ? <FaHeart color="#e74c3c" /> : <FaRegHeart color="#ccc" />}
            </button>
          </div>
        </div>
      </div>

      {/* Món ăn: ảnh + thông tin */}
      <div className="dish-section">
        <div className="dish-image1">
          <img src={dish.image} alt="Món ăn" />
        </div>
        <div className="dish-details">
          <h2 className="dish-name">{dish.name}</h2>
          <p className="dish-description">{dish.description}</p>
          <div className="dish-meta">
            <div className="dish-rating">
              {renderStars(dish.rating)}
              <span className="rating-number">({dish.rating})</span>
            </div>
          </div>
          <p className="dish-price">{dish.price?.toLocaleString() || '50,000'}đ</p>
          <div className="dish-actions">
            {cart[dish.id] ? (
              <div className="quantity-controls">
                <button className="decrease-btn" onClick={() => decreaseQuantity(dish.id)}>
                  −
                </button>
                <span className="quantity">{cart[dish.id]}</span>
                <button className="increase-btn" onClick={() => increaseQuantity(dish.id)}>
                  +
                </button>
              </div>
            ) : (
              <button className="add-to-cart1" onClick={() => addToCart(dish.id)}>
                Thêm món
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Đánh giá món ăn */}
      <div className="reviews-section">
        <DishReviews reviews={dish.reviews} />
      </div>

      {/* Gợi ý món ăn (Slider) */}
      <div className="highlight-slider-wrapper">
        <h2 className="highlight-title">Gợi ý món ăn</h2>
        <Slider {...sliderSettings}>
          {featuredDishes.map((dish) => (
            <div key={dish.id} className="highlight-slide">
              <Link to={`/dish/${dish.id}`} className="slider-item">
                <img src={dish.image} alt={dish.name} className="highlight-image" />
                <div className="highlight-info">
                  <h3>{dish.name}</h3>
                  <div className="rating-display">
                    {renderStars(dish.rating || 0)}
                    <span className="rating-number">({dish.rating || 0})</span>
                  </div>
                  <p className="price">{dish.price.toLocaleString()}đ</p>
                </div>
                {cart[dish.id] ? (
                  <div className="add-item-container">
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        decreaseQuantity(dish.id);
                      }}
                    >
                      −
                    </button>
                    <span className="item-quantity">{cart[dish.id]}</span>
                    <button
                      className="add-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        increaseQuantity(dish.id);
                      }}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="add-to-cart"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(dish.id);
                    }}
                  >
                    Thêm
                  </button>
                )}
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default DishDetail;