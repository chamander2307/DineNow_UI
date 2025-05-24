// FoodCategoryFormModal.js
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Select from "react-select";
import { createFoodCategory, updateFoodCategory } from "../../services/foodCategoryService";
import "../../assets/styles/owner/ModalForm.css";
Modal.setAppElement("#root");

const FoodCategoryFormModal = ({ isOpen, onClose, restaurantId, initialData, mainCategories, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mainCategoryId: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        mainCategoryId: initialData.mainCategoryId || null,
      });
    } else {
      setFormData({ name: "", description: "", mainCategoryId: null });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selected) => {
    setFormData((prev) => ({ ...prev, mainCategoryId: selected ? selected.value : null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }
    if (!formData.mainCategoryId) {
      toast.error("Vui lòng chọn danh mục chính.");
      return;
    }

    const payload = {
      name: formData.name,
      description: formData.description || "",
      mainCategoryId: formData.mainCategoryId.toString(),
    };

    try {
      setLoading(true);
      if (initialData) {
        await updateFoodCategory(initialData.id, payload);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await createFoodCategory(restaurantId, payload);
        toast.success("Tạo danh mục thành công!");
      }
      onSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Lỗi không xác định";
      toast.error(`Lỗi khi lưu danh mục: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <div className="modal-header">
        <h2>{initialData ? "Sửa danh mục" : "Thêm danh mục"}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="modal-content">
        <div className="form-group full-width">
          <label>Tên danh mục</label>
          <input
            className="form-input"
            name="name"
            placeholder="Nhập tên danh mục"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Danh mục chính</label>
          <Select
            className="select-input"
            placeholder="Chọn danh mục chính"
            value={mainCategories.find((cat) => cat.value === formData.mainCategoryId) || null}
            options={mainCategories}
            onChange={handleSelectChange}
            required
          />
        </div>

        <div className="form-group full-width ">
          <label>Mô tả</label>
          <textarea
            className="form-input "
            name="description"
            placeholder="Nhập mô tả"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="modal-buttons">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Đang xử lý..." : "Lưu"}
          </button>
          <button type="button" className="cancel-btn" onClick={onClose}>Hủy</button>
        </div>
      </form>
    </Modal>
  );
};

export default FoodCategoryFormModal;