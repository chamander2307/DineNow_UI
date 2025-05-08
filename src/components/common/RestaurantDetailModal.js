import React from "react";
import "../../assets/styles/admin/RestaurantDetailModal.css";

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
    imageUrls,
  } = restaurant;

  const handleApprove = () => onApprove(id, "APPROVED");
  const handleReject = () => onApprove(id, "REJECTED");

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Chi tiết nhà hàng</h2>
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="modal-content">
          <p><strong>Tên:</strong> {name}</p>
          <p><strong>Loại:</strong> {type?.name || "—"}</p>
          <p><strong>Hạng:</strong> {restaurantTierName || "—"}</p>
          <p><strong>Trạng thái:</strong> {status}</p>
          <p><strong>Số điện thoại:</strong> {phone}</p>
          <p><strong>Địa chỉ:</strong> {address}</p>
          <p><strong>Rating:</strong> {averageRating}</p>
          <p><strong>Ngày tạo:</strong> {new Date(createdAt).toLocaleString()}</p>

          <div>
            <strong>Mô tả:</strong>
            <div
              className="description-html"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {imageUrls?.length > 0 && (
            <div className="image-grid">
              {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`ảnh-${index}`} />
              ))}
            </div>
          )}

          {status === "PENDING" && (
            <div className="modal-actions">
              <button className="approve-btn" onClick={handleApprove}>Duyệt</button>
              <button className="reject-btn" onClick={handleReject}>Từ chối</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailModal;
