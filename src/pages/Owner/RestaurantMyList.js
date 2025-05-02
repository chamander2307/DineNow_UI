import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import {
  fetchRestaurantsByOwner,
  createRestaurant,
  updateRestaurant,
} from "../../services/restaurantService";
import "../../assets/styles/owner/OwnerRestaurant.css";

const RestaurantMyList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [types, setTypes] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    typeId: "",
    restaurantTierId: "",
    description: "",
    images: [],
  });
  const [editingRestaurantId, setEditingRestaurantId] = useState(null);

  useEffect(() => {
    loadRestaurants();
    loadOptions();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      const data = res.data.data;
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi tải danh sách nhà hàng", err);
    }
  };

  const loadOptions = () => {
    setTypes([
      { id: 1, name: "Nhà hàng Việt" },
      { id: 2, name: "Chay" },
      { id: 3, name: "Buffet" },
    ]);
    setTiers([
      { id: 1, name: "Cơ bản" },
      { id: 2, name: "Tiêu chuẩn" },
      { id: 3, name: "Cao cấp" },
    ]);
  };

  const openCreateModal = () => {
    setEditingRestaurantId(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      typeId: "",
      restaurantTierId: "",
      description: "",
      images: [],
    });
    setShowFormModal(true);
  };

  const openEditModal = (id) => {
    const restaurant = restaurants.find((r) => r.id === id);
    if (!restaurant) {
      console.error("Không tìm thấy nhà hàng cần sửa");
      return;
    }
    setEditingRestaurantId(id);
    setFormData({
      name: restaurant.name || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      typeId: restaurant.typeId?.toString() || "",
      restaurantTierId: restaurant.restaurantTierId?.toString() || "",
      description: restaurant.description || "",
      images: [],
    });
    setShowFormModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("address", formData.address);
    payload.append("phone", formData.phone);
    payload.append("typeId", formData.typeId);
    payload.append("restaurantTierId", formData.restaurantTierId);
    payload.append("description", formData.description);
    for (let i = 0; i < formData.images.length; i++) {
      payload.append("images", formData.images[i]);
    }

    try {
      if (editingRestaurantId) {
        await updateRestaurant(editingRestaurantId, payload);
        alert("Cập nhật thành công");
      } else {
        await createRestaurant(payload);
        alert("Tạo mới thành công");
      }
      setShowFormModal(false);
      loadRestaurants();
    } catch (err) {
      console.error("Lỗi khi lưu nhà hàng", err);
      alert("Thao tác thất bại");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Quản lý nhà hàng</h2>
        <button className="btn-create" onClick={openCreateModal}>
          Tạo mới nhà hàng
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>ID</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length === 0 ? (
            <tr>
              <td colSpan="6">Chưa có nhà hàng nào.</td>
            </tr>
          ) : (
            restaurants.map((r) => (
              <tr key={r.id}>
                <td>
                  <img
                    src={r.thumbnailUrl || "/fallback.jpg"}
                    alt={r.name}
                    width={80}
                    height={60}
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                  />
                </td>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td>{r.status || "Đang hoạt động"}</td>
                <td>
                  <button onClick={() => openEditModal(r.id)}>Sửa</button>
                  <button style={{ marginLeft: 8 }}>
                    {r.status === "INACTIVE" ? "Mở lại" : "Tạm khóa"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{editingRestaurantId ? "Sửa nhà hàng" : "Tạo nhà hàng mới"}</h2>

            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Tên nhà hàng" value={formData.name} onChange={handleChange} required />
              <input name="address" placeholder="Địa chỉ" value={formData.address} onChange={handleChange} required />
              <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />

              <select name="typeId" value={formData.typeId} onChange={handleChange} required>
                <option value="">-- Chọn loại nhà hàng --</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>

              <select name="restaurantTierId" value={formData.restaurantTierId} onChange={handleChange} required>
                <option value="">-- Chọn cấp độ --</option>
                {tiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>{tier.name}</option>
                ))}
              </select>

              <textarea name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} required />
              <input type="file" name="images" multiple onChange={handleChange} />
              <div className="modal-buttons">
                <button type="submit">{editingRestaurantId ? "Lưu thay đổi" : "Tạo mới"}</button>
                <button type="button" onClick={() => setShowFormModal(false)}>Huỷ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
};

export default RestaurantMyList;
