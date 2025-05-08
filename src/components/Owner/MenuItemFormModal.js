import React, { useEffect, useState } from "react";
import {
  createMenuItem,
  updateMenuItem,
  fetchMainCategories,
} from "../../services/menuItemService";
import "../../assets/styles/owner/MenuItemFormModal.css";

const MenuItemFormModal = ({ restaurantId, initialData, onClose, onSuccess }) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: null,
    available: true,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        categoryId: initialData.category?.id?.toString() || "",
        image: null,
        available: initialData.available ?? true,
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchMainCategories().then((data) => setCategories(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("category", formData.categoryId);
    payload.append("available", formData.available);
    if (formData.image) payload.append("imageUrl", formData.image);

    try {
      if (isEdit) {
        await updateMenuItem(initialData.id, payload);
        alert("Cập nhật món ăn thành công");
      } else {
        await createMenuItem(restaurantId, payload);
        alert("Tạo món ăn mới thành công");
      }
      onSuccess?.();
    } catch (err) {
      alert("Thao tác thất bại");
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{isEdit ? "Chỉnh sửa món ăn" : "Thêm món ăn mới"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Tên món"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            name="price"
            placeholder="Giá (VND)"
            value={formData.price}
            onChange={handleChange}
            type="number"
            required
          />
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input type="file" name="image" onChange={handleChange} />
          <label>
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Còn phục vụ
          </label>
          <div className="modal-buttons">
            <button type="submit">{isEdit ? "Lưu thay đổi" : "Tạo mới"}</button>
            <button type="button" onClick={onClose}>
              Huỷ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemFormModal;
