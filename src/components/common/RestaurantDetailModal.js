import React, { useState } from "react";
import Modal from "react-modal";
import "../../assets/styles/admin/RestaurantDetailModal.css";

Modal.setAppElement("#root");

const RestaurantDetailModal = ({ restaurant, onClose, onApprove }) => {
  const {
    id,
    name,
    address,
    phone,
    restaurantTierName,
    description,
    type,
    averageRating,
    status,
    createdAt,
    updatedAt,
    imageUrls,
  } = restaurant || {};

  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState("");

  const openFullImage = (url) => {
    setFullImageUrl(url);
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
  };

  const handleStatusUpdate = (newStatus) => onApprove(id, newStatus);

  const renderActions = () => {
    switch (status) {
      case "PENDING":
        return (
          <div className="modal-buttons">
            <button className="submit-btn" onClick={() => handleStatusUpdate("APPROVED")}>
              Duyệt
            </button>
            <button className="cancel-btn" onClick={() => handleStatusUpdate("REJECTED")}>
              Từ chối
            </button>
          </div>
        );
      case "APPROVED":
        return (
          <div className="modal-buttons">
            <button className="block-btn" onClick={() => handleStatusUpdate("BLOCKED")}>
              Chặn
            </button>
          </div>
        );
      case "BLOCKED":
        return (
          <div className="modal-buttons">
            <button className="submit-btn" onClick={() => handleStatusUpdate("APPROVED")}>
              Mở lại
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!restaurant) return null;

  return (
    <Modal
      isOpen={!!restaurant}
      onRequestClose={onClose}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
      shouldCloseOnOverlayClick={true}
    >
      <div className="modal-header">
        <h2>Chi tiết nhà hàng: {name || "Không xác định"}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="info-section">
        <div className="info-title">Thông tin chi tiết</div>
        <div className="info-group">
          <div className="info-item"><strong>ID:</strong> {id || "N/A"}</div>
          <div className="info-item"><strong>Tên:</strong> {name || "N/A"}</div>
          <div className="info-item"><strong>Loại:</strong> {type?.name || "N/A"}</div>
          <div className="info-item"><strong>Hạng:</strong> {restaurantTierName || "N/A"}</div>
          <div className="info-item"><strong>Trạng thái:</strong> {status || "N/A"}</div>
          <div className="info-item"><strong>Số điện thoại:</strong> {phone || "N/A"}</div>
          <div className="info-item"><strong>Địa chỉ:</strong> {address || "N/A"}</div>
          <div className="info-item"><strong>Đánh giá trung bình:</strong> {averageRating?.toFixed(1) || "0.0"}</div>
          <div className="info-item"><strong>Ngày tạo:</strong> {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}</div>
          <div className="info-item"><strong>Ngày cập nhật:</strong> {updatedAt ? new Date(updatedAt).toLocaleString() : "N/A"}</div>
        </div>
      </div>

      <div className="image-preview">
        {imageUrls?.length > 0 ? (
          imageUrls.map((url, index) => (
            <div key={index} className="image-wrapper" onClick={() => openFullImage(url)}>
              <img
                className="image-preview-img"
                src={url}
                alt={`Hình ảnh nhà hàng ${index + 1}`}
                onError={(e) => (e.target.src = "/fallback.jpg")}
              />
            </div>
          ))
        ) : (
          <p>Không có hình ảnh.</p>
        )}
      </div>

      <div className="description-section">
        <div className="description-title">Mô tả</div>
        <div
          className="description-text"
          dangerouslySetInnerHTML={{ __html: description || "Không có" }}
        />
      </div>

      {renderActions()}

      {showFullImage && (
        <div className="full-image-modal" onClick={closeFullImage}>
          <div className="full-image-wrapper">
            <button className="close-full-image-btn" onClick={closeFullImage}>×</button>
            <img src={fullImageUrl} alt="Hình ảnh đầy đủ" className="full-image" />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default RestaurantDetailModal;