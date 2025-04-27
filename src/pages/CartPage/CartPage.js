import React from 'react';
import RestaurantCart from '../../components/Restaurants/RestaurantCart';
import '../../assets/styles/Restaurant/CartPage.css';

import Restaurant1 from '../../assets/img/restaurant1.jpg';
const mockRestaurants = [
  {
    id: 'A',
    name: 'Nhà hàng A',
    image: Restaurant1, // Ảnh mẫu
    address: '123 Đường Láng, Hà Nội',
    dishes: [
      { id: '1', name: 'Món A', quantity: 2 ,price: 45000},
      { id: '2', name: 'Món B', quantity: 1 ,price: 45000},
      { id: '3', name: 'Món E', quantity: 1 ,price: 45000},
    ],
  },
  {
    id: 'B',
    name: 'Nhà hàng B',
    image: Restaurant1, // Ảnh mẫu
    address: '456 Nguyễn Trãi, TP.HCM',
    dishes: [
      { id: '3', name: 'Món C', quantity: 10 ,price: 45000 },
      { id: '4', name: 'Món D', quantity: 8 ,price: 45000},
    ],
  },
];

const CartPage = () => {
  return (
    <div className="cart-page">
      <h1>Giỏ hàng của bạn</h1>
      <RestaurantCart restaurants={[]} />
    </div>
  );
};

export default CartPage;