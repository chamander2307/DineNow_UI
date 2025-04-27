import React from "react";
import "../../assets/styles/admin/RestaurantDetailModal.css";

const RestaurantDetailModal = ({ restaurant, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box detail-modal">
        <h2>Chi tiết nhà hàng</h2>
        <p><strong>Tên:</strong> {restaurant.name}</p>
        <p><strong>Địa chỉ:</strong> {restaurant.address}</p>
        <p><strong>Số điện thoại:</strong> {restaurant.phone}</p>
        <p><strong>Loại:</strong> {restaurant.type?.name}</p>
        <p><strong>Trạng thái:</strong> {restaurant.status}</p>
        <p><strong>Mô tả:</strong> {restaurant.description || "Không có"}</p>
        <p><strong>Đánh giá trung bình:</strong> {restaurant.averageRating}</p>

        <p><strong>Ảnh:</strong></p>
        <div className="image-list">
          {restaurant.imageUrls?.map((url, idx) => (
            <img key={idx} src={url} alt={`img-${idx}`} />
          ))}
        </div>

        <div className="modal-buttons">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailModal;
