import React, { useEffect, useState } from "react";
import { fetchRestaurantById, updateOwnerRestaurantStatus } from "../../services/restaurantService";
import Modal from "react-modal";

Modal.setAppElement("#root");

const RestaurantDetailModal = ({ isOpen, onClose, restaurantId }) => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && restaurantId) {
      loadRestaurantDetails();
    }
  }, [isOpen, restaurantId]);

  const loadRestaurantDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchRestaurantById(restaurantId);
      setRestaurant(data || null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.status === 403
          ? "Nhà hàng chưa được duyệt hoặc đã bị khóa."
          : "Không thể tải chi tiết nhà hàng.");
      alert(errorMessage);
      onClose(); // Đóng modal nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantStatus = async () => {
    if (!restaurant || !["APPROVED", "SUSPENDED"].includes(restaurant.status)) {
      alert("Trạng thái nhà hàng không hợp lệ để thay đổi.");
      return;
    }

    const newStatus = restaurant.status === "APPROVED" ? "SUSPENDED" : "APPROVED";
    const actionText = restaurant.status === "APPROVED" ? "khóa" : "mở khóa";

    if (!window.confirm(`Bạn có chắc muốn ${actionText} nhà hàng này?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await updateOwnerRestaurantStatus(restaurantId, newStatus);
      if (response.status === 200 && response.data === true) {
        alert(`Nhà hàng đã được ${actionText} thành công!`);
        setRestaurant({ ...restaurant, status: newStatus });
      } else {
        throw new Error("Phản hồi không hợp lệ từ server");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Lỗi không xác định";
      alert(`Lỗi khi ${actionText} nhà hàng: ${errorMessage}`);
    } finally {
      setLoading(false);
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
        <button
          className="toggle-status-btn"
          onClick={toggleRestaurantStatus}
          disabled={loading || !["APPROVED", "SUSPENDED"].includes(restaurant.status)}
        >
          {restaurant.status === "APPROVED" ? "Khóa" : restaurant.status === "SUSPENDED" ? "Mở khóa" : "N/A"}
        </button>
        <button className="cancel-btn" onClick={onClose}>Đóng</button>
      </div>
    </Modal>
  );
};

export default RestaurantDetailModal;