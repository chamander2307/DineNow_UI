import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import '../../assets/styles/Restaurant/RestaurantCart.css';
import Restaurant1 from "../../assets/img/restaurant1.jpg"; // Đường dẫn hình ảnh mẫu

const RestaurantCart = () => {
  const navigate = useNavigate();

  // 🌟 Dữ liệu mẫu
  const sampleRestaurants = [
    {
      id: 'A',
      name: 'Nhà hàng A',
      image: Restaurant1,
      address: '123 Đường Láng, Hà Nội',
      dishes: [
        { id: '1', name: 'Món A', quantity: 2, price: 45000 },
        { id: '2', name: 'Món B', quantity: 1, price: 45000 },
        { id: '3', name: 'Món E', quantity: 1, price: 45000 },
      ],
    },
    {
      id: 'B',
      name: 'Nhà hàng B',
      image: Restaurant1,
      address: '456 Nguyễn Trãi, TP.HCM',
      dishes: [
        { id: '3', name: 'Món C', quantity: 10, price: 45000 },
        { id: '4', name: 'Món D', quantity: 8, price: 45000 },
      ],
    },
  ];

  // State để quản lý danh sách nhà hàng và món ăn (động)
  const [restaurants, setRestaurants] = useState(sampleRestaurants);

  // State để quản lý số lượng món ăn cho từng nhà hàng
  const [cartItems, setCartItems] = useState(() =>
    sampleRestaurants.reduce((acc, restaurant) => {
      acc[restaurant.id] = restaurant.dishes.reduce((dishAcc, dish) => {
        dishAcc[dish.id] = dish.quantity || 0;
        return dishAcc;
      }, {});
      return acc;
    }, {})
  );

  // State để quản lý trạng thái mở/đóng của combobox cho từng nhà hàng
  const [isOpen, setIsOpen] = useState(() =>
    sampleRestaurants.reduce((acc, restaurant) => {
      acc[restaurant.id] = false; // Mặc định đóng
      return acc;
    }, {})
  );

  // Hàm tăng số lượng món ăn
  const increaseQuantity = (restaurantId, dishId) => {
    setCartItems(prev => ({
      ...prev,
      [restaurantId]: {
        ...prev[restaurantId],
        [dishId]: (prev[restaurantId][dishId] || 0) + 1,
      },
    }));
  };

  // Hàm giảm số lượng món ăn và xử lý xóa
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
            })
          );
          const updatedCartItems = { ...prev };
          delete updatedCartItems[restaurantId][dishId];
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

  // Hàm bật/tắt combobox
  const toggleDropdown = (restaurantId) => {
    setIsOpen(prev => ({
      ...prev,
      [restaurantId]: !prev[restaurantId],
    }));
  };

  // Hàm xử lý thanh toán
  const handleCheckout = (restaurant) => {
    const selectedItems = [
      {
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
        },
        dishes: restaurant.dishes
          .filter(dish => cartItems[restaurant.id][dish.id] > 0)
          .map(dish => ({
            id: dish.id,
            name: dish.name,
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

  return (
    <div className="restaurant-cart">
      {restaurants.map(restaurant => (
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
                        <span className="quantity">{cartItems[restaurant.id][dish.id]}</span>
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
      ))}
    </div>
  );
};

export default RestaurantCart;
