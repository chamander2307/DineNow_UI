import React, { useEffect, useState } from "react";
import {
  createMenuItem,
  updateMenuItem,
} from "../../services/menuItemService";
import "../../assets/styles/MenuItemFormModal.css";

const MenuItemFormModal = ({ initialData, restaurantId, onClose, onSuccess }) => {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    imageUrl: "",
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        category: initialData.category?.name || "",
        available: initialData.available,
        imageUrl: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val !== "") payload.append(key, val);
    });

    try {
      if (isEdit) {
        await updateMenuItem(initialData.id, payload);
        alert("✅ Cập nhật thành công!");
      } else {
        await createMenuItem(restaurantId, payload);
        alert("✅ Tạo món ăn thành công!");
      }
      onSuccess?.(); // gọi lại load danh sách
      onClose();
    } catch (err) {
      console.error(err);
      alert("❌ Thao tác thất bại!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{isEdit ? "Chỉnh sửa món ăn" : "Tạo món ăn mới"}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Tên món" value={formData.name} onChange={handleChange} required />
          <input name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
          <input name="price" type="number" placeholder="Giá" value={formData.price} onChange={handleChange} required />
          <input name="category" placeholder="Loại món (Tên)" value={formData.category} onChange={handleChange} />
          <input name="imageUrl" placeholder="URL ảnh" value={formData.imageUrl} onChange={handleChange} />
          <label>
            <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
            Đang phục vụ
          </label>

          <div className="modal-buttons">
            <button type="submit">{isEdit ? "Lưu thay đổi" : "Tạo mới"}</button>
            <button type="button" onClick={onClose}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemFormModal;
