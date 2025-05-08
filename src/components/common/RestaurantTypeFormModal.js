import React, { useEffect, useState } from "react";
import {
  createRestaurantType,
  updateRestaurantType,
} from "../../services/adminService";
import "../../assets/styles/admin/RestaurantTypeFormModal.css";

const RestaurantTypeFormModal = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        image: null,
      });
      setPreview(initialData.imageUrl || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      if (formData.image) {
        data.append("image", formData.image);
      }

      if (initialData) {
        await updateRestaurantType(initialData.id, data);
        setMessage("Cập nhật thành công");
      } else {
        await createRestaurantType(data);
        setMessage("Tạo mới thành công");
      }

      onSuccess();
    } catch {
      setMessage("Thao tác thất bại");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{initialData ? "Chỉnh sửa loại nhà hàng" : "Tạo loại nhà hàng"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Tên loại"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleChange}
          />
          <input type="file" name="image" accept="image/*" onChange={handleChange} />
          {preview && <img src={preview} alt="preview" className="preview" />}
          <div className="modal-actions">
            <button type="submit">{initialData ? "Cập nhật" : "Tạo mới"}</button>
            <button type="button" onClick={onClose}>Huỷ</button>
          </div>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default RestaurantTypeFormModal;
