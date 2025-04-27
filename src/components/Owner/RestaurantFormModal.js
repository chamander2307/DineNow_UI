import React, { useEffect, useState } from "react";
import { createRestaurant, updateRestaurant } from "../../services/restaurantService";
import "../../assets/styles/RestaurantFormModal.css";

const RestaurantFormModal = ({ initialData, onClose }) => {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    typeId: "",
    images: [],
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: initialData.name || "",
        address: initialData.address || "",
        phone: initialData.phone || "",
        typeId: initialData.type?.id || "",
        images: [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("address", formData.address);
    payload.append("phone", formData.phone);
    payload.append("typeId", formData.typeId);
    for (let i = 0; i < formData.images.length; i++) {
      payload.append("images", formData.images[i]);
    }

    try {
      if (isEdit) {
        await updateRestaurant(initialData.id, payload);
        alert("✅ Cập nhật thành công!");
      } else {
        await createRestaurant(payload);
        alert("✅ Tạo mới thành công!");
      }
      onClose();
    } catch (err) {
      alert("❌ Thao tác thất bại!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{isEdit ? "Chỉnh sửa nhà hàng" : "Tạo nhà hàng mới"}</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Tên nhà hàng" value={formData.name} onChange={handleChange} required />
          <input name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} required />
          <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />
          <input name="typeId" placeholder="Loại nhà hàng (ID)" value={formData.typeId} onChange={handleChange} required />
          <input type="file" name="images" multiple onChange={handleChange} />

          <div className="modal-buttons">
            <button type="submit">{isEdit ? "Lưu thay đổi" : "Tạo mới"}</button>
            <button type="button" onClick={onClose}>Huỷ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantFormModal;
