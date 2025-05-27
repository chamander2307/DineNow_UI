import React, { useState } from "react";
import "../../assets/styles/admin/UserDetailModal.css";

const UserFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (formData.password !== formData.confirmPassword) {
    setMessage("Mật khẩu xác nhận không khớp");
    return;
  }
  try {
    const payload = { ...formData };
    delete payload.confirmPassword;
    const result = await onSuccess(payload);
    if (!result.success) {
      setMessage(result.message); 
    } else {
      setMessage(""); 
    }
  } catch {
    setMessage("Tạo tài khoản thất bại");
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Tạo chủ nhà hàng</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Họ tên"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit">Tạo mới</button>
            <button type="button" onClick={onClose}>Huỷ</button>
          </div>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;