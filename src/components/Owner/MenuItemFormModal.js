import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Select from "react-select";
import { NumericFormat } from "react-number-format";
import {
  createMenuItem,
  updateMenuItem,
} from "../../services/menuItemService";
import { getFoodCategoriesByRestaurant } from "../../services/foodCategoryService";
import "../../assets/styles/owner/ModalForm.css";

// Cấu hình Modal
Modal.setAppElement("#root");

const MenuItemFormModal = ({ isOpen, onClose, restaurantId, initialData, menuItems, onSuccess }) => {
  console.log("MenuItemFormModal rendered, isOpen:", isOpen, "restaurantId:", restaurantId);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: null,
    image: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tải danh mục của nhà hàng
  useEffect(() => {
    const loadCategories = async () => {
      try {
        console.log(`Fetching food categories for restaurant ID: ${restaurantId}...`);
        const res = await getFoodCategoriesByRestaurant(restaurantId);
        console.log("Food categories response:", res);
        if (!res || res.length === 0) {
          console.warn("No food categories found for this restaurant.");
          toast.warn("Không có danh mục nào để chọn. Vui lòng tạo danh mục cho nhà hàng trước.");
        }
        setCategories(res.map((cat) => ({ value: cat.id, label: cat.name })));
      } catch (err) {
        console.error("Error loading food categories:", err);
        console.error("Error response:", err.response?.data);
        toast.error(`Không thể tải danh mục: ${err.message || "Lỗi không xác định"}`);
      }
    };
    if (isOpen && restaurantId) {
      console.log("Modal is open, loading food categories");
      loadCategories();
    }
  }, [isOpen, restaurantId]);

  // Cập nhật form khi chỉnh sửa
  useEffect(() => {
    if (initialData) {
      console.log("Populating form with initialData:", initialData);
      setFormData({
        name: initialData.name || "",
        price: initialData.price ? String(initialData.price) : "",
        description: initialData.description || "",
        categoryId: initialData.category?.id || null,
        image: null,
      });
      setImageFile(null);
    } else {
      console.log("Resetting form for new menu item");
      setFormData({
        name: "",
        price: "",
        description: "",
        categoryId: null,
        image: null,
      });
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Image selected:", file?.name, "Size:", file?.size, "Type:", file?.type);
    setImageFile(file);
  };

  const handleSelectChange = (selected) => {
    console.log("Category selected:", selected);
    setFormData((prev) => ({ ...prev, categoryId: selected ? selected.value : null }));
  };

  const handlePriceChange = (values) => {
    const { value } = values;
    console.log("Price changed:", value);
    setFormData((prev) => ({ ...prev, price: value || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted, validating...");

    // Kiểm tra tên món ăn trùng lặp
    const normalizedInputName = formData.name.trim().replace(/\s+/g, " ").toLowerCase();
    const isDuplicate = menuItems.some((item) => {
      const normalizedExistingName = item.name?.trim().replace(/\s+/g, " ").toLowerCase();
      return normalizedExistingName === normalizedInputName && item.id !== initialData?.id;
    });

    if (isDuplicate) {
      console.log("Tên món ăn đã tồn tại:", formData.name);
      alert("Tên món ăn đã tồn tại.");
      return;
    }

    if (!formData.name) {
      console.log("Validation failed: Missing name");
      toast.error("Vui lòng nhập tên món ăn.");
      return;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      console.log("Validation failed: Invalid price", formData.price);
      toast.error("Vui lòng nhập giá hợp lệ.");
      return;
    }
    if (!formData.categoryId) {
      console.log("Validation failed: Missing categoryId");
      toast.error("Vui lòng chọn danh mục.");
      return;
    }
    if (!imageFile && !initialData?.imageUrl) {
      console.log("Validation failed: Missing image");
      toast.error("Vui lòng chọn ảnh cho món ăn.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("price", formData.price);
    payload.append("description", formData.description || "");
    payload.append("category", formData.categoryId.toString());
    if (imageFile) {
      payload.append("imageUrl", imageFile);
    }

    console.log("Payload prepared:", [...payload.entries()]);

    try {
      setLoading(true);
      if (initialData) {
        console.log(`Updating menu item ID: ${initialData.id}`);
        const response = await updateMenuItem(initialData.id, payload);
        console.log("Update response:", response);
        toast.success("Cập nhật món ăn thành công!");
      } else {
        console.log(`Creating new menu item for restaurant ID: ${restaurantId}`);
        const response = await createMenuItem(restaurantId, payload);
        console.log("Create response:", response);
        toast.success("Tạo món ăn thành công!");
      }
      onSuccess();
    } catch (err) {
      console.error("Error submitting form:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      const errorMessage = err.response?.data?.message || err.message || "Lỗi không xác định";
      toast.error(`Lỗi khi lưu món ăn: ${errorMessage}`);
    } finally {
      console.log("Submission finished, setting loading to false");
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
        <h2>{initialData ? "Sửa món ăn" : "Thêm món ăn"}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="modal-content">
        <div className="form-group full-width">
          <label>Tên món ăn</label>
          <input
            className="form-input"
            name="name"
            placeholder="Nhập tên món ăn"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Giá (VNĐ)</label>
          <NumericFormat
            className="form-input number-format"
            thousandSeparator={true}
            suffix=" VNĐ"
            placeholder="Nhập giá (VD: 50,000 VNĐ)"
            value={formData.price}
            onValueChange={handlePriceChange}
            allowNegative={false}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Danh mục</label>
          <Select
            className="select-input"
            placeholder="Chọn danh mục"
            value={categories.find((cat) => cat.value === formData.categoryId) || null}
            options={categories}
            onChange={handleSelectChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Mô tả</label>
          <textarea
            className="form-input form-input--textarea"
            name="description"
            placeholder="Nhập mô tả"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="form-group full-width">
          <label>Ảnh món ăn</label>
          {initialData?.imageUrl && (
            <div className="image-preview">
              <div className="image-wrapper">
                <img
                  src={initialData.imageUrl}
                  alt="Ảnh hiện tại"
                  className="image-preview-img"
                />
              </div>
            </div>
          )}
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="file-input"
            accept="image/*"
            required={!initialData?.imageUrl}
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

export default MenuItemFormModal;