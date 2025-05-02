import React, { useEffect, useState } from "react";
import {
  fetchRestaurantsByOwner,
  createRestaurant,
  updateRestaurant,
} from "../../services/restaurantService";
import "../../assets/styles/Restaurant/RestaurantManagement.css";

const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [types, setTypes] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    typeId: "",
    restaurantTierId: "",
    description: "",
    images: [],
  });
  const [message, setMessage] = useState("");

  const isEdit = !!editData;

  useEffect(() => {
    loadRestaurants();
    loadOptions();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error("❌ Không thể tải danh sách nhà hàng", err);
    }
  };

  const loadOptions = () => {
    // Dùng mock thay vì gọi service
    setTypes([
      { id: 1, name: "Nhà hàng Việt" },
      { id: 2, name: "Nhà hàng chay" },
      { id: 3, name: "Buffet" },
    ]);

    setTiers([
      { id: 1, name: "Cơ bản" },
      { id: 2, name: "Tiêu chuẩn" },
      { id: 3, name: "Cao cấp" },
    ]);
  };

  const handleOpenCreate = () => {
    setEditData(null);
    setFormData({
      name: "",
      address: "",
      phone: "",
      typeId: "",
      restaurantTierId: "",
      description: "",
      images: [],
    });
    setMessage("");
    setShowModal(true);
  };

  const handleOpenEdit = (restaurant) => {
    setEditData(restaurant);
    setFormData({
      name: restaurant.name || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
      typeId: restaurant.typeId?.toString() || "",
      restaurantTierId: restaurant.restaurantTierId?.toString() || "",
      description: restaurant.description || "",
      images: [],
    });
    setMessage("");
    setShowModal(true);
  };

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

    const phonePattern = /^0\d{9}$/;
    if (!phonePattern.test(formData.phone)) {
      setMessage("Số điện thoại không hợp lệ. Phải bắt đầu bằng 0 và đủ 10 số.");
      return;
    }

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
      if (isEdit) {
        await updateRestaurant(editData.id, payload);
        setMessage("Cập nhật nhà hàng thành công!");
      } else {
        await createRestaurant(payload);
        setMessage("Tạo nhà hàng thành công!");
      }

      setTimeout(() => {
        setMessage("");
        setShowModal(false);
        loadRestaurants();
      }, 1000);
    } catch (err) {
      console.error("Thất bại:", err.response || err.message || err);
      setMessage("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStatus = async (restaurant) => {
    const newStatus = restaurant.status === "INACTIVE" ? "ACTIVE" : "INACTIVE";
    console.log(`(Giả lập) Đổi trạng thái nhà hàng ID ${restaurant.id} thành ${newStatus}`);
    alert(`(Giả lập) Đã đổi trạng thái thành ${newStatus}`);
    loadRestaurants();
  };

  return (
    <div className="restaurant-table-container">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Nhà hàng của bạn</h2>
        <button className="action-btn" onClick={handleOpenCreate}>+ Tạo nhà hàng</button>
      </div>

      <table className="restaurant-table">
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
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                Không có nhà hàng nào.
              </td>
            </tr>
          ) : (
            restaurants.map((r) => (
              <tr key={r.id}>
                <td>
                  <img
                    src={r.thumbnailUrl}
                    alt={r.name}
                    style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6 }}
                  />
                </td>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td>{r.status || "Đang hoạt động"}</td>
                <td>
                  <button className="action-btn" onClick={() => handleOpenEdit(r)}>Sửa</button>
                  <button className="action-btn" style={{ marginLeft: 8 }} onClick={() => handleToggleStatus(r)}>
                    {r.status === "INACTIVE" ? "Mở lại" : "Tạm khóa"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>{isEdit ? "Chỉnh sửa nhà hàng" : "Tạo nhà hàng mới"}</h2>
            {message && <p className="notice">{message}</p>}
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
                <button type="submit">{isEdit ? "Lưu thay đổi" : "Tạo mới"}</button>
                <button type="button" onClick={() => setShowModal(false)}>Huỷ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManager;
