import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../../assets/styles/Restaurant/RestaurantCart.css';
import { fetchRestaurantById, fetchSimpleMenuByRestaurant } from '../../services/restaurantService';

const RestaurantCart = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isOpen, setIsOpen] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      setLoading(true);
      try {
        const savedCart = JSON.parse(sessionStorage.getItem('cart')) || {};
        console.log('Dữ liệu từ sessionStorage:', savedCart);
        setCartItems(savedCart);

        const restaurantIds = Object.keys(savedCart);
        if (restaurantIds.length === 0) {
          setRestaurants([]);
          setIsOpen({});
          setLoading(false);
          return;
        }

        const restaurantPromises = restaurantIds.map(async (id) => {
          try {
            const restaurantRes = await fetchRestaurantById(id);
            const menuRes = await fetchSimpleMenuByRestaurant(id);
            const restaurantData = restaurantRes || {};
            const menuData = menuRes.data || [];

            console.log(`Menu data for restaurant ${id}:`, menuData);

            const dishes = menuData
              .filter(dish => savedCart[id] && savedCart[id][String(dish.id)] > 0)
              .map(dish => ({
                id: dish.id,
                name: dish.name,
                price: parseFloat(dish.price) || 0,
                quantity: savedCart[id][String(dish.id)],
              }));

            console.log(`Filtered dishes for restaurant ${id}:`, dishes);

            return {
              id: restaurantData.id,
              name: restaurantData.name || 'Nhà hàng không xác định',
              image: restaurantData.thumbnailUrl || '',
              address: restaurantData.address || 'Chưa có địa chỉ',
              dishes,
            };
          } catch (err) {
            console.error(`Lỗi khi lấy dữ liệu cho restaurant ${id}:`, err);
            return null;
          }
        });

        const fetchedRestaurants = (await Promise.all(restaurantPromises)).filter(r => r !== null);
        const filteredRestaurants = fetchedRestaurants.filter(r => r.dishes.length > 0);

        setRestaurants(filteredRestaurants);
        setIsOpen(
          filteredRestaurants.reduce((acc, restaurant) => {
            acc[restaurant.id] = false;
            return acc;
          }, {})
        );
      } catch (err) {
        console.error('Lỗi tổng quát khi lấy dữ liệu giỏ hàng:', err);
        setError('Không thể tải dữ liệu giỏ hàng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(sessionStorage.getItem('cart')) || {};
    restaurants.forEach(restaurant => {
      const updatedItems = {};
      restaurant.dishes.forEach(dish => {
        if (cartItems[restaurant.id]?.[dish.id] > 0) {
          updatedItems[dish.id] = cartItems[restaurant.id][dish.id];
        }
      });
      if (Object.keys(updatedItems).length > 0) {
        savedCart[restaurant.id] = updatedItems;
      } else {
        delete savedCart[restaurant.id];
      }
    });
    sessionStorage.setItem('cart', JSON.stringify(savedCart));
    console.log('Dữ liệu đã lưu vào sessionStorage:', savedCart);
  }, [cartItems, restaurants]);

  const increaseQuantity = (restaurantId, dishId) => {
    setCartItems(prev => {
      const updatedCart = {
        ...prev,
        [restaurantId]: {
          ...prev[restaurantId],
          [dishId]: (prev[restaurantId]?.[dishId] || 0) + 1,
        },
      };
      return updatedCart;
    });
  };

  const decreaseQuantity = (restaurantId, dishId) => {
    setCartItems(prev => {
      const currentQuantity = prev[restaurantId]?.[dishId] || 0;
      const newQuantity = currentQuantity - 1;

      if (newQuantity <= 0) {
        const confirmDelete = window.confirm('Số lượng món đã về 0. Bạn có muốn xóa món này khỏi giỏ hàng không?');
        if (confirmDelete) {
          setRestaurants(prevRestaurants => {
            const updatedRestaurants = prevRestaurants.map(restaurant => {
              if (restaurant.id === restaurantId) {
                const updatedDishes = restaurant.dishes.filter(d => d.id !== dishId);
                return {
                  ...restaurant,
                  dishes: updatedDishes,
                };
              }
              return restaurant;
            });
            return updatedRestaurants.filter(r => r.dishes.length > 0);
          });

          const updatedCartItems = { ...prev };
          delete updatedCartItems[restaurantId]?.[dishId];
          if (Object.keys(updatedCartItems[restaurantId] || {}).length === 0) {
            delete updatedCartItems[restaurantId];
          }
          return updatedCartItems;
        } else {
          return {
            ...prev,
            [restaurantId]: {
              ...prev[restaurantId],
              [dishId]: 0,
            },
          };
        }
      }

      return {
        ...prev,
        [restaurantId]: {
          ...prev[restaurantId],
          [dishId]: newQuantity,
        },
      };
    });
  };

  const toggleDropdown = (restaurantId) => {
    setIsOpen(prev => ({
      ...prev,
      [restaurantId]: !prev[restaurantId],
    }));
  };

  const handleCheckout = (restaurant) => {
    const selectedItems = [
      {
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
        },
        dishes: restaurant.dishes
          .filter(dish => cartItems[restaurant.id]?.[dish.id] > 0)
          .map(dish => ({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            quantity: cartItems[restaurant.id][dish.id],
          })),
      },
    ].filter(item => item.dishes.length > 0);

    if (selectedItems.length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn ít nhất một món trước khi thanh toán.');
      return;
    }

    navigate('/payment', { state: { selectedItems } });
  };

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <p>{error}</p>;

  return (
    <div className="restaurant-cart">
      {restaurants.length > 0 ? (
        restaurants.map(restaurant => (
          <div key={restaurant.id} className="restaurant-section">
            <div
              className="restaurant-header"
              onClick={() => toggleDropdown(restaurant.id)}
            >
              <img src={restaurant.image} alt={restaurant.name} className="restaurant-images" />
              <div className="restaurant-infos">
                <div className="restaurant-name-wrappers">
                  <h3 className="restaurant-names">{restaurant.name}</h3>
                  {isOpen[restaurant.id] ? (
                    <FaChevronUp className="chevron-icon" />
                  ) : (
                    <FaChevronDown className="chevron-icon" />
                  )}
                </div>
                <p className="restaurant-addresss">{restaurant.address}</p>
              </div>
            </div>
            {isOpen[restaurant.id] && (
              <>
                {restaurant.dishes.length > 0 ? (
                  <ul className="dish-lists">
                    {restaurant.dishes.map(dish => (
                      <li key={dish.id} className="dish-items">
                        <span className="dish-names">{dish.name}</span>
                        <div className="dish-price-quantity">
                          <span className="dish-price">{dish.price.toLocaleString('vi-VN')} VNĐ</span>
                          <div className="quantity-controls">
                            <button
                              className="decrease-btn"
                              onClick={() => decreaseQuantity(restaurant.id, dish.id)}
                            >
                              −
                            </button>
                            <span className="quantity">{cartItems[restaurant.id]?.[dish.id] || 0}</span>
                            <button
                              className="increase-btn"
                              onClick={() => increaseQuantity(restaurant.id, dish.id)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Không có món nào trong giỏ hàng.</p>
                )}
                <button
                  className="checkout-btn"
                  onClick={() => handleCheckout(restaurant)}
                >
                  Đặt bàn ngay
                </button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>Giỏ hàng trống.</p>
      )}
    </div>
  );
};

export default RestaurantCart;