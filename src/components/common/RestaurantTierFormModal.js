import React, { useEffect, useState } from "react";
import {
  createRestaurantTier,
  updateRestaurantTier,
} from "../../services/restaurantService";
import "../../assets/styles/admin/RestaurantTierFormModal.css";

const RestaurantTierFormModal = ({ onClose, onSuccess, initialData, checkDuplicateName }) => {
  const [formData, setFormData] = useState({
    name: "",
    feePerGuest: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("RestaurantTierFormModal rendered with initialData:", initialData);
    if (initialData) {
      setFormData({
        name: initialData.name,
        feePerGuest: initialData.feePerGuest,
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting form with data:", formData);
      if (!formData.name || !formData.feePerGuest || !formData.description) {
        console.log("Validation failed: Missing required fields");
        setMessage("Vui lòng điền đầy đủ thông tin");
        return;
      }
      if (!initialData && checkDuplicateName(formData.name)) {
        console.log("Validation failed: Duplicate name");
        setMessage("Tên hạng đã tồn tại");
        return;
      }

      const data = {
        name: formData.name,
        feePerGuest: formData.feePerGuest,
        description: formData.description,
      };

      let res;
      if (initialData) {
        console.log("Updating tier with ID:", initialData.id);
        res = await updateRestaurantTier(initialData.id, data);
        console.log("Update response:", res);
        if (res.status === 200) {
          console.log("Update successful, calling onSuccess");
          onSuccess("Cập nhật thành công");
        } else {
          console.log("Update failed:", res.data?.message);
          setMessage(res.data?.message || "Cập nhật thất bại");
        }
      } else {
        console.log("Creating new tier");
        res = await createRestaurantTier(data);
        console.log("Create response:", res);
        if (res.status === 201) {
          console.log("Create successful, calling onSuccess");
          onSuccess("Tạo mới thành công");
        } else {
          console.log("Create failed:", res.data?.message);
          setMessage(res.data?.message || "Tạo mới thất bại");
        }
      }
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      setMessage(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  console.log("Rendering modal with showFormModal:", true);

  return (
    <div className="modal-overlay">
      <div className="modal">
        {initialData && (
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        )}
        <h3>{initialData ? "Chỉnh sửa hạng nhà hàng" : "Tạo hạng nhà hàng"}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Tên hạng</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nhập tên hạng"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="feePerGuest">Phí mỗi khách (VNĐ)</label>
            <input
              type="number"
              id="feePerGuest"
              name="feePerGuest"
              placeholder="Nhập phí mỗi khách"
              required
              value={formData.feePerGuest}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              placeholder="Nhập mô tả"
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="modal-actions">
            <button type="submit">{initialData ? "Cập nhật" : "Tạo mới"}</button>
            <button type="button" onClick={onClose}>Hủy</button>
          </div>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default RestaurantTierFormModal;