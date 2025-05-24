import React, { useEffect, useState } from "react";
import {
  createRestaurantType,
  updateRestaurantType,
} from "../../services/adminService";
import "../../assets/styles/admin/RestaurantTypeFormModal.css";

const RestaurantTypeFormModal = ({ onClose, onSuccess, initialData, checkDuplicateName }) => {
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
      setPreview(file ? URL.createObjectURL(file) : initialData?.imageUrl || null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name) {
        setMessage("Vui lòng nhập tên loại nhà hàng");
        return;
      }
      if (!initialData && checkDuplicateName(formData.name)) {
        setMessage("Tên loại nhà hàng đã tồn tại");
        return;
      }
      if (!initialData && !formData.image) {
        setMessage("Vui lòng chọn ảnh đại diện");
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      if (formData.image) {
        data.append("imageUrl", formData.image);
      } else if (initialData && !formData.image) {
        data.append("imageUrl", initialData.imageUrl);
      }

      let res;
      if (initialData) {
        res = await updateRestaurantType(initialData.id, data);
        if (res?.status === 200) {
          onSuccess("Cập nhật thành công");
        } else {
          setMessage(res?.data?.message || "Cập nhật thất bại");
        }
      } else {
        res = await createRestaurantType(data);
        if (res?.status === 201) {
          onSuccess("Tạo mới thành công");
        } else {
          setMessage(res?.data?.message || "Tạo mới thất bại");
        }
      }
    } catch (err) {
      console.error("Lỗi khi gửi form:", err);
      setMessage(err.response?.data?.message || "Thao tác thất bại");
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setPreview(initialData?.imageUrl || null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{initialData ? "Chỉnh sửa loại nhà hàng" : "Tạo loại nhà hàng"}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Tên loại nhà hàng</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nhập tên loại nhà hàng"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              placeholder="Nhập mô tả"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="image">Ảnh đại diện</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!initialData}
            />
            {preview && (
              <div className="preview-container">
                <img src={preview} alt="preview" className="preview" />
                <button type="button" onClick={removeImage}>
                  Xóa ảnh
                </button>
              </div>
            )}
          </div>
          <div className="modal-actions">
            <button type="submit">{initialData ? "Cập nhật" : "Tạo mới"}</button>
            <button type="button" onClick={onClose}>
              Hủy
            </button>
          </div>
          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default RestaurantTypeFormModal;