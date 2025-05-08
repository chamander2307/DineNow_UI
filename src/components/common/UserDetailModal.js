import React from "react";
import "../../assets/styles/admin/UserDetailModal.css";

const UserDetailModal = ({ user, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Thông tin người dùng</h3>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Họ tên:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số điện thoại:</strong> {user.phone || "—"}</p>
        <p><strong>Vai trò:</strong> {user.role}</p>
        <p><strong>Đã xác minh:</strong> {user.verified ? "✔" : "✘"}</p>
        <p><strong>Được phép hoạt động:</strong> {user.enabled ? "✔" : "✘"}</p>
        <div className="modal-actions">
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
