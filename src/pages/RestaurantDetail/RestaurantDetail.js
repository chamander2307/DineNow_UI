import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../assets/styles/Restaurant/RestaurantDetail.css';
import { restaurants } from '../../data/restaurants';
import RestaurantReviewForm from '../../components/Restaurants/RestaurantReviewForm';

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

const priceRanges = [
  { label: 'Tất cả', value: '' },
  { label: 'Dưới 50K', value: 'under50' },
  { label: '50K - 100K', value: '50to100' },
  { label: 'Trên 100K', value: 'over100' },
];

const RestaurantDetail = () => {
  const { id } = useParams();
  const restaurant = restaurants.find(r => r.id === parseInt(id)) || {};
  const [isLiked, setIsLiked] = useState(() => {
    const liked = JSON.parse(localStorage.getItem('likedRestaurants')) || {};
    return liked[id] || false;
  });

  // State để quản lý giỏ hàng
  const [cart, setCart] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || {};
    return savedCart[id] || {};
  });

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedRestaurants')) || {};
    liked[id] = isLiked;
    localStorage.setItem('likedRestaurants', JSON.stringify(liked));
  }, [isLiked, id]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || {};
    savedCart[id] = cart;
    localStorage.setItem('cart', JSON.stringify(savedCart));
  }, [cart, id]);

  const toggleLike = () => setIsLiked(!isLiked);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedPrice, setSelectedPrice] = useState('');

  const categories = ['Tất cả', ...new Set(restaurant.menuItems?.map(item => item.category))];

  const filteredMenu = restaurant.menuItems?.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Tất cả' || item.category === selectedCategory;
    const matchPrice =
      selectedPrice === '' ||
      (selectedPrice === 'under50' && item.price < 50000) ||
      (selectedPrice === '50to100' && item.price >= 50000 && item.price <= 100000) ||
      (selectedPrice === 'over100' && item.price > 100000);
    return matchSearch && matchCategory && matchPrice;
  }) || [];

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

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

  // Chuyển đổi cart thành selectedItems để truyền sang PaymentPage
  const selectedItems = Object.keys(cart).map((dishId) => {
    const dish = restaurant.menuItems.find(item => item.id === dishId);
    return {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: cart[dishId],
    };
  });

  return (
    <div className="restaurant-detail">
      <div className="restaurant-slider">
        <Slider {...sliderSettings}>
          {restaurant.images?.map((img, i) => (
            <img key={i} src={img} alt={`slide-${i}`} className="slider-image" />
          ))}
        </Slider>
      </div>

      <div className="restaurant-info">
        <div className="restaurant-details1">
          <h1 className="rd-name">{restaurant.name}</h1>

          <div className="rd-meta">
            <div className="rd-rating">
              {renderStars(restaurant.rating)}
              <span className="rd-rating-number">({restaurant.rating})</span>
            </div>
            <div className="rd-visits">
              {restaurant.visits?.toLocaleString()} lượt xem
            </div>
          </div>

          <div className="rd-tags">
            <span className="rd-location">📍 {restaurant.location}</span>
            <span className="rd-style">🍽 {restaurant.style}</span>
            <span className="rd-address">🏠 {restaurant.address}</span>
          </div>

          <div className="rd-actions">
            <Link
              to={{
                pathname: '/payment',
                state: {
                  restaurant: {
                    name: restaurant.name,
                    address: restaurant.address,
                    image: restaurant.image,
                  },
                  selectedItems: selectedItems.length > 0 ? selectedItems : [],
                },
              }}
              className="book-btn"
            >
              Đặt bàn ngay
            </Link>
            <button className="heart" onClick={toggleLike}>
              {isLiked ? <FaHeart color="#e74c3c" /> : <FaRegHeart color="#ccc" />}
            </button>
          </div>
        </div>
      </div>

      {restaurant.menuItems && restaurant.menuItems.length > 0 && (
        <div className="highlight-slider-wrapper">
          <h2 className="highlight-title">Món ăn nổi bật</h2>
          <Slider {...sliderSettings}>
            {restaurant.menuItems.slice(0, 5).map((item) => (
              <div key={item.id} className="highlight-slide">
                <img src={item.image} alt={item.name} className="highlight-image" />
                <div className="highlight-info">
                  <h3>{item.name}</h3>
                  <div className="rating-display">
                    {renderStars(item.rating)} <span className="rating-number">({item.rating})</span>
                  </div>
                  <p className="price">{item.price.toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}

      <div className="menu-section-full">
        <h2>Thực đơn</h2>
        <ul className="categories-list-horizontal">
          {categories.map((cat, i) => (
            <li
              key={i}
              className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>

        <div className="price-filter">
          <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)}>
            {priceRanges.map((range, idx) => (
              <option key={idx} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm món..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="horizontal-dishes">
          {filteredMenu.map(dish => (
            <Link to={`/dish/${dish.id}`} key={dish.id} className="slider-item">
              <div className="dish-item">
                <img src={dish.image} alt={dish.name} className="dish-image" />
                <div className="dish-details">
                  <h3>{dish.name}</h3>
                  <div className="rating-display">
                    {renderStars(dish.rating)} <span className="rating-number">({dish.rating})</span>
                  </div>
                  <p className="price">{dish.price.toLocaleString()}đ</p>
                </div>
                {cart[dish.id] ? (
                  <div className="add-item-container">
                    <button className="remove-btn" onClick={(e) => { e.preventDefault(); decreaseQuantity(dish.id); }}>
                      −
                    </button>
                    <span className="item-quantity">{cart[dish.id]}</span>
                    <button className="add-btn" onClick={(e) => { e.preventDefault(); increaseQuantity(dish.id); }}>
                      +
                    </button>
                  </div>
                ) : (
                  <button className="add-to-cart" onClick={(e) => { e.preventDefault(); addToCart(dish.id); }}>
                    Thêm
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="reviews-section-full">
        <h2>Đánh giá</h2>
        <RestaurantReviewForm
          restaurantId={restaurant.id}
          existingReviews={restaurant.reviews?.slice(0, 3)}
        />
      </div>
    </div>
  );
};

export default RestaurantDetail;