import React, { useEffect, useState } from "react";
import { fetchRestaurantById } from "../../services/restaurantService";
import Modal from "react-modal";

Modal.setAppElement("#root");

const RestaurantDetailModal = ({ isOpen, onClose, restaurantId }) => {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (isOpen && restaurantId) {
      loadRestaurantDetails();
    }
  }, [isOpen, restaurantId]);

  const loadRestaurantDetails = async () => {
    try {
      const data = await fetchRestaurantById(restaurantId);
      setRestaurant(data || null);
    } catch (error) {
      alert("Không thể tải chi tiết nhà hàng.");
    }
  };

  const openFullImage = (url) => {
    setFullImageUrl(url);
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
  };

  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState("");

  if (!isOpen || !restaurant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <div className="modal-header">
        <h2>Chi tiết nhà hàng: {restaurant.name || "Không xác định"}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="info-section">
        <div className="info-title">Thông tin chi tiết</div>
        <div className="info-group">
          <div className="info-item"><strong>ID:</strong> {restaurant.id || "N/A"}</div>
          <div className="info-item"><strong>Tên:</strong> {restaurant.name || "N/A"}</div>
          <div className="info-item"><strong>Loại:</strong> {restaurant.type?.name || "N/A"}</div>
          <div className="info-item"><strong>Hạng:</strong> {restaurant.restaurantTierName || "N/A"}</div>
          <div className="info-item"><strong>Địa chỉ:</strong> {restaurant.address || "N/A"}</div>
          <div className="info-item"><strong>Số điện thoại:</strong> {restaurant.phone || "N/A"}</div>
          <div className="info-item"><strong>Trạng thái:</strong> {restaurant.status || "N/A"}</div>
          <div className="info-item"><strong>Đánh giá trung bình:</strong> {restaurant.averageRating?.toFixed(1) || "0.0"}</div>
          <div className="info-item"><strong>Ngày tạo:</strong> {restaurant.createdAt ? new Date(restaurant.createdAt).toLocaleString() : "N/A"}</div>
          <div className="info-item"><strong>Ngày cập nhật:</strong> {restaurant.updatedAt ? new Date(restaurant.updatedAt).toLocaleString() : "N/A"}</div>
        </div>
      </div>

      <div className="image-preview">
        {restaurant.imageUrls && restaurant.imageUrls.length > 0 ? (
          restaurant.imageUrls.map((url, index) => (
            <div key={index} onClick={() => openFullImage(url)} className="image-wrapper">
              <img src={url} alt={`Hình ảnh nhà hàng ${index + 1}`} className="image-preview-img" />
            </div>
          ))
        ) : (
          <p>Không có hình ảnh.</p>
        )}
      </div>

      {showFullImage && (
        <div className="full-image-modal" onClick={closeFullImage}>
          <div className="full-image-wrapper">
            <button className="close-full-image-btn" onClick={closeFullImage}>×</button>
            <img src={fullImageUrl} alt="Hình ảnh đầy đủ" className="full-image" />
          </div>
        </div>
      )}

      <div className="description-section">
        <div className="description-title">Mô tả</div>
        <div className="description-text" dangerouslySetInnerHTML={{ __html: restaurant.description || "Không có" }} />
      </div>

      <div className="modal-buttons">
        <button className="cancel-btn" onClick={onClose}>Đóng</button>
      </div>
    </Modal>
  );
};

export default RestaurantDetailModal;