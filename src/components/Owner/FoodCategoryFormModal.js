import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Select from "react-select";
import { createFoodCategory, updateFoodCategory } from "../../services/foodCategoryService";
import httpStatusMessages from "../../constants/httpStatusMessages";
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

    // Tạo payload chỉ chứa các trường có giá trị
    const payload = {};
    if (formData.name.trim()) {
      payload.name = formData.name.trim();
    }
    if (formData.description) {
      payload.description = formData.description;
    }
    if (formData.mainCategoryId) {
      payload.mainCategoryId = formData.mainCategoryId.toString();
    }

    // Kiểm tra nếu không có trường nào được điền
    if (Object.keys(payload).length === 0) {
      toast.error("Vui lòng điền ít nhất một trường để lưu danh mục.");
      return;
    }

    try {
      setLoading(true);
      if (initialData) {
        await updateFoodCategory(initialData.id, payload);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        // Khi tạo mới, yêu cầu ít nhất name và mainCategoryId theo API
        if (!payload.name || !payload.mainCategoryId) {
          toast.error("Tạo danh mục mới yêu cầu tên và danh mục chính.");
          return;
        }
        await createFoodCategory(restaurantId, payload);
        toast.success("Tạo danh mục thành công!");
      }
      onSuccess();
    } catch (err) {
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || httpStatusMessages[statusCode] || "Lỗi không xác định từ server";
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
          />
        </div>

        <div className="form-group full-width">
          <label>Mô tả</label>
          <textarea
            className="form-input"
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