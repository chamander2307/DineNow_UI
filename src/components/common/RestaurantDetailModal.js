import React from "react";
import "../../assets/styles/admin/RestaurantDetailModal.css";

const RestaurantDetailModal = ({ restaurant, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box detail-modal">
        <h2>Chi tiết nhà hàng</h2>
        <p><strong>ID:</strong> {restaurant.id}</p>
        <p><strong>Tên:</strong> {restaurant.name}</p>
        <p><strong>Địa chỉ:</strong> {restaurant.address}</p>
        <p><strong>Số điện thoại:</strong> {restaurant.phone}</p>
        <p><strong>Loại:</strong> {restaurant.typeName}</p>
        <p><strong>Cấp độ:</strong> {restaurant.restaurantTierName}</p>
        <p><strong>Trạng thái:</strong> {restaurant.status}</p>
        <p><strong>Đánh giá trung bình:</strong> {restaurant.averageRating}</p>
        <p><strong>Ngày tạo:</strong> {new Date(restaurant.createdAt).toLocaleString()}</p>
        <p><strong>Ngày cập nhật:</strong> {new Date(restaurant.updatedAt).toLocaleString()}</p>
        <p><strong>Mô tả:</strong></p>
        <div className="description-box">
          {restaurant.description || "Không có mô tả"}
        </div>

        <p><strong>Ảnh đại diện:</strong></p>
        <img
          src={restaurant.thumbnailUrl || "/fallback.jpg"}
          alt="thumbnail"
          className="detail-thumbnail"
        />

        <div className="modal-buttons">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailModal;
