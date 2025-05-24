import React, { useEffect, useState } from "react";
import "../../assets/styles/admin/MainCategoryFormModal.css";

const MainCategoryFormModal = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(formData, initialData?.id || null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{initialData ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Tên danh mục"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
          <textarea
            placeholder="Mô tả danh mục"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
          <div className="modal-actions">
            <button type="submit">{initialData ? "Cập nhật" : "Tạo mới"}</button>
            <button type="button" onClick={onClose}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MainCategoryFormModal;
