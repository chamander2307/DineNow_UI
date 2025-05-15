import React, { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const MenuItemDetailModal = ({ isOpen, onClose, item }) => {
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState("");

  const openFullImage = (url) => {
    setFullImageUrl(url);
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
  };

  if (!isOpen || !item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <div className="modal-header">
        <h2>Chi tiết món ăn: {item.name || "Không xác định"}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="info-section">
        <div className="info-title">Thông tin chi tiết</div>
        <div className="info-group">
          <div className="info-item"><strong>ID:</strong> {item.id || "N/A"}</div>
          <div className="info-item"><strong>Tên:</strong> {item.name || "N/A"}</div>
          <div className="info-item"><strong>Giá:</strong> {item.price ? Number(item.price).toLocaleString() + "đ" : "N/A"}</div>
          <div className="info-item"><strong>Trạng thái:</strong> {item.available ? "Còn phục vụ" : "Tạm ngưng"}</div>
          <div className="info-item"><strong>Đánh giá trung bình:</strong> {item.averageRating ? item.averageRating.toFixed(1) : "0.0"}</div>
          <div className="info-item"><strong>Danh mục:</strong> {item.category?.name || "Không có"} (ID: {item.category?.id || "N/A"})</div>
          <div className="info-item"><strong>Ngày tạo:</strong> {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}</div>
          <div className="info-item"><strong>Ngày cập nhật:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "N/A"}</div>
        </div>
      </div>

      <div className="image-preview">
        {item.imageUrl ? (
          <div onClick={() => openFullImage(item.imageUrl)} className="image-wrapper">
            <img src={item.imageUrl} alt={item.name || "Món ăn"} className="image-preview-img" />
          </div>
        ) : (
          <p>Không có hình ảnh.</p>
        )}
      </div>

      {showFullImage && (
        <div className="full-image-modal" onClick={closeFullImage}>
          <div className="full-image-wrapper">
            <button className="close-full-image-btn" onClick={closeFullImage}>×</button>
            <img src={fullImageUrl} alt="Full Size" className="full-image" />
          </div>
        </div>
      )}

      <div className="description-section">
        <div className="description-title">Mô tả món ăn</div>
        <div className="description-text">{item.description || "Không có"}</div>
      </div>

      <div className="description-section">
        <div className="description-title">Mô tả danh mục</div>
        <div className="description-text">{item.category?.description || "Không có"}</div>
      </div>

      <div className="modal-buttons">
        <button className="cancel-btn" onClick={onClose}>Đóng</button>
      </div>
    </Modal>
  );
};

export default MenuItemDetailModal; 