import React, { useState } from "react";
import { createOwner } from "../../services/adminService";
import httpStatusMessages from "../../constants/httpStatusMessages";
import "../../assets/styles/admin/AdminCreateOwnerModal.css";

const AdminCreateOwnerModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const response = await createOwner(payload);
      const status = response?.data?.status;
      if (status !==200&& status !==201) {
        setMessage(httpStatusMessages[status] || "Tạo thất bại");
        setLoading(false);
        return;
      }

      setMessage(httpStatusMessages[status] || "Tạo mới thành công");
      setTimeout(() => {
        setLoading(false);
        onSuccess?.();
        console.log (response);
        onClose();
      }, 1200);
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      const status = err?.response?.status;
      setMessage(httpStatusMessages[status] || backendMessage || "Có lỗi xảy ra");
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Tạo Chủ Nhà Hàng Mới</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Họ tên"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo"}
          </button>
          <button type="button" onClick={onClose} disabled={loading}>
            Hủy
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default AdminCreateOwnerModal;
