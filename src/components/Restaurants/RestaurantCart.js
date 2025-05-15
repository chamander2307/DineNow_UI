import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../../assets/styles/Restaurant/RestaurantCart.css';
import { createOrder } from '../../services/orderService';

const RestaurantCart = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [isOpen, setIsOpen] = useState({});

  // Lấy giỏ hàng từ localStorage khi mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const initialRestaurants = storedCart.reduce((acc, item) => {
      const restaurant = acc.find(r => r.id === item.restaurantId);
      if (restaurant) {
        restaurant.dishes.push({
          id: item.dishId,
          name: item.dishName,
          quantity: item.quantity,
          price: item.price,
        });
      } else {
        acc.push({
          id: item.restaurantId,
          name: item.restaurantName,
          image: item.restaurantImage || '/fallback.jpg',
          address: item.restaurantAddress,
          dishes: [{
            id: item.dishId,
            name: item.dishName,
            quantity: item.quantity,
            price: item.price,
          }],
        });
      }
      return acc;
    }, []);

    setRestaurants(initialRestaurants);
    setCartItems(initialRestaurants.reduce((acc, restaurant) => {
      acc[restaurant.id] = restaurant.dishes.reduce((dishAcc, dish) => {
        dishAcc[dish.id] = dish.quantity;
        return dishAcc;
      }, {});
      return acc;
    }, {}));
    setIsOpen(initialRestaurants.reduce((acc, restaurant) => {
      acc[restaurant.id] = false;
      return acc;
    }, {}));
  }, []);

  // Cập nhật localStorage khi giỏ hàng thay đổi
  useEffect(() => {
    const cart = restaurants.flatMap(restaurant =>
      restaurant.dishes.map(dish => ({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.image,
        restaurantAddress: restaurant.address,
        dishId: dish.id,
        dishName: dish.name,
        quantity: cartItems[restaurant.id]?.[dish.id] || 0,
        price: dish.price,
      }))
    );
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [restaurants, cartItems]);

  const increaseQuantity = (restaurantId, dishId) => {
    setCartItems(prev => ({
      ...prev,
      [restaurantId]: {
        ...prev[restaurantId],
        [dishId]: (prev[restaurantId][dishId] || 0) + 1,
      },
    }));
  };

  const decreaseQuantity = (restaurantId, dishId) => {
    setCartItems(prev => {
      const currentQuantity = prev[restaurantId][dishId] || 0;
      const newQuantity = currentQuantity - 1;

      if (newQuantity <= 0) {
        const confirmDelete = window.confirm('Số lượng món đã về 0. Bạn có muốn xóa món này khỏi giỏ hàng không?');
        if (confirmDelete) {
          setRestaurants(prevRestaurants =>
            prevRestaurants.map(restaurant => {
              if (restaurant.id === restaurantId) {
                return {
                  ...restaurant,
                  dishes: restaurant.dishes.filter(dish => dish.id !== dishId),
                };
              }
              return restaurant;
            }).filter(restaurant => restaurant.dishes.length > 0)
          );
          const updatedCartItems = { ...prev };
          delete updatedCartItems[restaurantId][dishId];
          if (Object.keys(updatedCartItems[restaurantId]).length === 0) {
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

  const handleCheckout = async (restaurant) => {
    const selectedItems = restaurant.dishes
      .filter(dish => cartItems[restaurant.id][dish.id] > 0)
      .map(dish => ({
        id: dish.id,
        name: dish.name,
        quantity: cartItems[restaurant.id][dish.id],
        price: dish.price,
      }));

    if (selectedItems.length === 0) {
      alert('Giỏ hàng trống! Vui lòng chọn ít nhất một món trước khi thanh toán.');
      return;
    }

    const orderData = {
      restaurantId: restaurant.id,
      items: selectedItems,
    };

    try {
      const response = await createOrder(restaurant.id, orderData);
      if (response.data) {
        // Xóa món của nhà hàng khỏi giỏ hàng
        setRestaurants(prev => prev.filter(r => r.id !== restaurant.id));
        setCartItems(prev => {
          const updated = { ...prev };
          delete updated[restaurant.id];
          return updated;
        });
        localStorage.setItem('cart', JSON.stringify([]));
        navigate('/payment', { state: { order: response.data } });
      }
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      alert('Không thể tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="restaurant-cart">
      {restaurants.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
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
                <button
                  className="checkout-btn"
                  onClick={() => handleCheckout(restaurant)}
                >
                  Thanh toán
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RestaurantCart;