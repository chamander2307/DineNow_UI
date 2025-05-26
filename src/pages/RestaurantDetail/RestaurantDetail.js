import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import '../../assets/styles/Restaurant/RestaurantDetail.css';
import RestaurantReviewForm from '../../components/Restaurants/RestaurantReviewForm';
import DishReviews from '../../components/Dish/DishReviews';
import { fetchRestaurantById, fetchSimpleMenuByRestaurant } from '../../services/restaurantService';
import { addFavoriteRestaurant, removeFavoriteRestaurant, getFavoriteRestaurants } from '../../services/userService';
import { createOrder } from '../../services/orderService';
import { UserContext } from '../../contexts/UserContext';

// Hàm render sao đánh giá
const renderStars = (rating) => {
  const effectiveRating = Math.min(rating || 0, 5);
  const full = Math.floor(effectiveRating);
  const half = effectiveRating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);
  const stars = [];
  for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} />);
  if (half) stars.push(<FaStarHalfAlt key="half" />);
  for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`empty-${i}`} />);
  return (
    <div className="dish-star-rating">
      {stars}
      <span className="dish-rating-number">({effectiveRating.toFixed(1)})</span>
    </div>
  );
};

// Component cho từng món ăn trong danh sách
const DishItem = ({
  dish,
  cart,
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  setSelectedDish,
}) => {
  const handleClick = useCallback(() => setSelectedDish(dish), [dish, setSelectedDish]);
  const handleAdd = useCallback((e) => {
    e.preventDefault();
    addToCart(dish.id);
  }, [dish.id, addToCart]);
  const handleIncrease = useCallback((e) => {
    e.preventDefault();
    increaseQuantity(dish.id);
  }, [dish.id, increaseQuantity]);
  const handleDecrease = useCallback((e) => {
    e.preventDefault();
    decreaseQuantity(dish.id);
  }, [dish.id, decreaseQuantity]);

  return (
    <div className="dish-item" onClick={handleClick} id={`dish-${dish.id}`}>
      <img
        src={dish.imageUrl}
        alt={dish.name}
        className="dish-image"
        onError={(e) => {
          e.target.src = '/assets/images/fallback-image.jpg';
        }}
      />
      <div className="dish-details">
        <h3>{dish.name}</h3>
        {renderStars(dish.averageRating)}
        <p className="price">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(dish.price || 0))}
        </p>
      </div>
      {cart[dish.id] ? (
        <div className="add-item-container">
          <button className="remove-btn" onClick={handleDecrease}>−</button>
          <span className="item-quantity">{cart[dish.id]}</span>
          <button className="add-btn" onClick={handleIncrease}>+</button>
        </div>
      ) : (
        <button className="add-to-cart" onClick={handleAdd}>Thêm</button>
      )}
    </div>
  );
};

// Component chi tiết món ăn
const DishDetail = ({ dish, cart, addToCart, increaseQuantity, decreaseQuantity, onBack }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleAdd = useCallback((e) => {
    e.preventDefault();
    addToCart(dish.id);
  }, [dish.id, addToCart]);
  const handleIncrease = useCallback((e) => {
    e.preventDefault();
    increaseQuantity(dish.id);
  }, [dish.id, increaseQuantity]);
  const handleDecrease = useCallback((e) => {
    e.preventDefault();
    decreaseQuantity(dish.id);
  }, [dish.id, decreaseQuantity]);
  const handleBack = useCallback((e) => {
    e.preventDefault();
    onBack();
    navigate(`/restaurant/${id}`, { state: {} }); // Xóa state
  }, [onBack, navigate, id]);

  return (
    <div className="dish-detail-section">
      <div className="dish-section">
        <div className="dish-images">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            onError={(e) => {
              e.target.src = '/assets/images/fallback-image.jpg';
            }}
          />
        </div>
        <div className="dish-details">
          <h2 className="dish-name">{dish.name}</h2>
          <p className="dish-description">
            {dish.description || "Món ăn này chưa có mô tả."}
          </p>
          <div className="dish-meta">
            <div className="dish-rating">
              {renderStars(dish.averageRating)}
              <span className="rating-number">({dish.averageRating || 0})</span>
            </div>
          </div>
          <p className="dish-price">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(dish.price || 0))}
          </p>
          <div className="dish-actions-Detail">
            {cart[dish.id] ? (
              <div className="add-item-container-Detail">
                <button className="remove-btn-Detail" onClick={handleDecrease}>−</button>
                <span className="item-quantity-Detail">{cart[dish.id]}</span>
                <button className="add-btn-Detail" onClick={handleIncrease}>+</button>
              </div>
            ) : (
              <button className="add-to-cart-Detail" onClick={handleAdd}>Thêm</button>
            )}
          </div>
        </div>
      </div>
      <div className="dish-reviews-section">
        <DishReviews menuItemId={dish.id} />
      </div>
      <button className="back-btn" onClick={handleBack}>Quay lại</button>
    </div>
  );
};

// Component chính
const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isLogin } = useContext(UserContext);
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cart, setCart] = useState(() => {
    const savedCart = JSON.parse(sessionStorage.getItem('cart')) || {};
    return savedCart[id] || {};
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Kiểm tra trạng thái yêu thích
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (isLogin) {
        try {
          const favorites = await getFavoriteRestaurants();
          const isRestaurantLiked = favorites.some(fav => fav.id === parseInt(id));
          setIsLiked(isRestaurantLiked);
        } catch (err) {
          console.error('Lỗi khi kiểm tra trạng thái yêu thích:', err);
        }
      }
    };
    fetchFavoriteStatus();
  }, [id, isLogin]);

  // Tải dữ liệu nhà hàng và menu
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [restaurantData, menuData] = await Promise.all([
          fetchRestaurantById(id),
          fetchSimpleMenuByRestaurant(id),
        ]);
        setRestaurant(restaurantData);
        // Xử lý cấu trúc API trả về
        const menuItemsArray = Array.isArray(menuData?.data?.content)
          ? menuData.data.content
          : Array.isArray(menuData?.data)
          ? menuData.data
          : [];
        setMenuItems(menuItemsArray);

        if (state?.selectedDishId) {
          // Ép kiểu selectedDishId thành số
          const dishId = parseInt(state.selectedDishId, 10);
          const selectedDish = menuItemsArray.find(
            (item) => item.id === dishId
          );
          if (selectedDish) {
            setSelectedDish(selectedDish);
          } else {
            console.warn("Không tìm thấy món ăn với ID:", dishId, "trong danh sách:", menuItemsArray);
            setError("Món ăn được chọn không tồn tại.");
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu nhà hàng:", error);
        setError("Không thể tải dữ liệu nhà hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, state]);

  // Lưu giỏ hàng vào sessionStorage
  useEffect(() => {
    try {
      const storedCart = JSON.parse(sessionStorage.getItem('cart')) || {};
      storedCart[id] = cart;
      sessionStorage.setItem('cart', JSON.stringify(storedCart));
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng:', error);
    }
  }, [cart, id]);

  // Hàm xử lý giỏ hàng
  const addToCart = useCallback(async (dishId) => {
    try {
      let newQuantity;
      setCart(prev => {
        newQuantity = (prev[dishId] || 0) + 1;
        return { ...prev, [dishId]: newQuantity };
      });
      const orderData = {
        reservationTime: new Date().toISOString(),
        numberOfPeople: 1,
        numberOfChild: 0,
        numberPhone: '0386299573',
        orderItems: [{ menuItemId: dishId, quantity: newQuantity }],
      };
      await createOrder(id, orderData);
    } catch (err) {
      setError('Lỗi khi thêm vào giỏ hàng');
      console.error('Lỗi khi thêm vào giỏ:', err);
    }
  }, [id]);

  const increaseQuantity = useCallback((dishId) => {
    setCart(prev => ({
      ...prev,
      [dishId]: prev[dishId] + 1,
    }));
  }, []);

  const decreaseQuantity = useCallback((dishId) => {
    setCart(prev => {
      const newQuantity = prev[dishId] - 1;
      if (newQuantity <= 0) {
        const { [dishId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [dishId]: newQuantity };
    });
  }, []);

  const toggleLike = useCallback(async () => {
    if (!isLogin) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích.");
      return;
    }
    try {
      const newIsLiked = !isLiked;
      setIsLiked(newIsLiked);
      if (newIsLiked) {
        await addFavoriteRestaurant(id);
      } else {
        await removeFavoriteRestaurant(id);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật danh sách yêu thích:', error);
      alert('Không thể cập nhật danh sách yêu thích. Vui lòng thử lại.');
      setIsLiked(!isLiked);
    }
  }, [isLiked, isLogin, id]);

  const handleDishClick = useCallback((dish) => {
    if (!isDragging) {
      setSelectedDish(dish);
    }
  }, [isDragging]);

  const handleBookTable = useCallback(() => {
    const selectedItems = Object.keys(cart)
      .map((dishId) => {
        const dish = menuItems.find((item) => item.id === dishId);
        if (!dish) return null;
        return {
          id: dish.id,
          name: dish.name,
          price: parseFloat(dish.price),
          quantity: cart[dishId],
        };
      })
      .filter(Boolean);

    navigate("/payment", {
      state: {
        restaurant: {
          name: restaurant?.name,
          address: restaurant?.address,
          image: restaurant?.imageUrls?.[0],
        },
        selectedItems: selectedItems.length > 0 ? selectedItems : [],
      },
    });
  }, [cart, menuItems, navigate, restaurant]);

  // Cấu hình slider
  const getRestaurantSliderSettings = (imageCount) => ({
    dots: imageCount > 1,
    arrows: false,
    infinite: imageCount > 1,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: imageCount > 1,
    autoplaySpeed: 4000,
    swipeToSlide: imageCount > 1,
    touchThreshold: 10,
  });

  const priceRanges = [
    { label: "Tất cả", value: "" },
    { label: "Dưới 50K", value: "under50" },
    { label: "50K - 100K", value: "50to100" },
    { label: "Trên 100K", value: "over100" },
  ];

  const MenuSection = useMemo(() => {
    const categories = [
      "Tất cả",
      ...new Set(
        menuItems
          .map((item) => item.typeName || "Không xác định")
          .filter(Boolean)
      ),
    ];
    const filteredMenu = menuItems.filter((item) => {
      const matchSearch = item.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "Tất cả" || item.typeName === selectedCategory;
      const price = parseFloat(item.price);
      const matchPrice =
        selectedPrice === "" ||
        (selectedPrice === "under50" && price < 50000) ||
        (selectedPrice === "50to100" && price >= 50000 && price <= 100000) ||
        (selectedPrice === "over100" && price > 100000);
      return matchSearch && matchCategory && matchPrice;
    });

    return (
      <div className="menu-section-full">
        <h2>Thực đơn</h2>
        <ul className="categories-list-horizontal">
          {categories.map((cat, i) => (
            <li
              key={i}
              className={`category-item ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </li>
          ))}
        </ul>
        <div className="price-filter">
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
          >
            {priceRanges.map((range, idx) => (
              <option key={idx} value={range.value}>
                {range.label}
              </option>
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
          {filteredMenu.map((dish) => (
            <DishItem
              key={dish.id}
              dish={dish}
              cart={cart}
              addToCart={addToCart}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              setSelectedDish={setSelectedDish}
            />
          ))}
        </div>
      </div>
    );
  }, [
    menuItems,
    searchTerm,
    selectedCategory,
    selectedPrice,
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  ]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!restaurant) return <p>Không tìm thấy nhà hàng.</p>;

  return (
    <div className="restaurant-detail">
      <div className="restaurant-slider">
        {restaurant.imageUrls?.length > 0 ? (
          <Slider {...getRestaurantSliderSettings(restaurant.imageUrls.length)}>
            {restaurant.imageUrls.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`slide-${i}`}
                className="slider-image"
                onError={(e) => {
                  e.target.src = '/assets/images/fallback-image.jpg';
                }}
              />
            ))}
          </Slider>
        ) : (
          <p>Không có hình ảnh</p>
        )}
      </div>

      <div className="restaurant-info">
        <div className="restaurant-details1">
          <h1 className="rd-name">{restaurant.name}</h1>
          <div className="rd-meta">
            <div className="rd-rating">
              {renderStars(restaurant.averageRating)}
              <span className="rd-rating-number">
                ({restaurant.averageRating || 0})
              </span>
            </div>
            <div className="rd-visits">
              {(restaurant.visits || 0).toLocaleString()} lượt xem
            </div>
          </div>
          <div className="rd-tags">
            <span className="rd-location">📍 {restaurant.address}</span>
            <span className="rd-style">
              🍽 {restaurant.type?.name || "Không xác định"}
            </span>
          </div>
          <div className="rd-description">
            <h3>Giới thiệu</h3>
            <div
              className={isExpanded ? "" : "collapsed"}
              dangerouslySetInnerHTML={{
                __html: restaurant.description || "Không có mô tả.",
              }}
            />
            {restaurant.description && restaurant.description.length > 100 && (
              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
          <div className="rd-actions">
            <button className="book-btn" onClick={handleBookTable}>
              Đặt bàn ngay
            </button>
            <button className="heart" onClick={toggleLike}>
              {isLiked ? <FaHeart color="#ff6f61" /> : <FaRegHeart color="#ccc" />}
            </button>
          </div>
        </div>
      </div>

      {selectedDish ? (
        <DishDetail
          dish={selectedDish}
          cart={cart}
          addToCart={addToCart}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          onBack={() => setSelectedDish(null)}
        />
      ) : (
        <>
          {menuItems.length > 0 && (
            <div className="highlight-slider-wrapper">
              <h2 className="highlight-title">Món ăn nổi bật</h2>
              <Swiper
                slidesPerView={3}
                spaceBetween={20}
                centeredSlides
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination, Autoplay]}
                className="highlight-slider"
                onSlideChange={() => setIsDragging(true)}
                onTransitionEnd={() => setIsDragging(false)}
                speed={1000}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  768: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                }}
              >
                {menuItems.slice(0, 5).map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="highlight-slide">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="highlight-image"
                        onError={(e) => {
                          e.target.src = '/assets/images/fallback-image.jpg';
                        }}
                      />
                      <div className="highlight-info">
                        <h3
                          onClick={() => handleDishClick(item)}
                          style={{ cursor: "pointer" }}
                        >
                          {item.name}
                        </h3>
                        <p className="price">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(Number(item.price || 0))}
                        </p>
                        <button
                          className="view-detail-btn"
                          onClick={() => handleDishClick(item)}
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          {MenuSection}
          <div className="reviews-section-full">
            <RestaurantReviewForm restaurantId={id} />
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantDetail;