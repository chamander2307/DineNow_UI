import React from "react";

const RestaurantDetailModal = ({ isOpen, onClose, restaurant }) => {
  if (!isOpen || !restaurant) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Chi tiết nhà hàng: {restaurant.name}</h2>
        <p>Số điện thoại: {restaurant.phone}</p>
        <p>Địa chỉ: {restaurant.address}</p>
        <p>Loại: {restaurant.typeName}</p>
        <p>Hạng: {restaurant.restaurantTierName}</p>
        <button onClick={onClose}>Đóng</button>
      </div>
    </div>
  );
};

export default RestaurantDetailModal;
