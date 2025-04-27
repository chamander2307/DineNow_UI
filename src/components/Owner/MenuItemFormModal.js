
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
    categoryId: "",
    available: true,
    image: null,
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        categoryId: initialData.category?.id || "",
        available: initialData.available,
        image: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("categoryId", formData.categoryId);
    payload.append("available", formData.available);
    if (formData.image) {
      payload.append("image", formData.image);
    }

    try {
      if (isEdit) {
        await updateMenuItem(initialData.id, payload);
        alert("✅ Cập nhật thành công!");
      } else {
        await createMenuItem(restaurantId, payload);
        alert("✅ Tạo món ăn thành công!");
      }
      onSuccess?.();
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
          <input name="categoryId" placeholder="Loại món (Category ID)" value={formData.categoryId} onChange={handleChange} />
          <input type="file" name="image" onChange={handleChange} />
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
