import React, { useEffect, useState } from "react";
import {
  fetchRestaurantsByOwner,
  createRestaurant,
  updateRestaurant
} from "../../services/restaurantService";
import "../../assets/styles/Restaurant/RestaurantManagement.css";

const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
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

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      setRestaurants(res.data.data || []);
    } catch (err) {
      console.error("❌ Không thể tải danh sách nhà hàng", err);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

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
    payload.append("name", formData.name.toString());
    payload.append("address", formData.address.toString());
    payload.append("phone", formData.phone.toString());
    payload.append("typeId", formData.typeId.toString());
    payload.append("restaurantTierId", formData.restaurantTierId.toString());
    payload.append("description", formData.description.toString());
    for (let i = 0; i < formData.images.length; i++) {
      payload.append("images", formData.images[i]);
    }

    try {
      if (isEdit) {
        await updateRestaurant(editData.id, payload);
        setMessage("✅ Cập nhật nhà hàng thành công!");
      } else {
        await createRestaurant(payload);
        setMessage("✅ Tạo nhà hàng thành công!");
      }

      setTimeout(() => {
        setMessage("");
        setShowModal(false);
        loadRestaurants();
      }, 1000);
    } catch (err) {
      console.error("❌ Thất bại:", err.response || err.message || err);
      setMessage("❌ Lỗi: " + (err.response?.data?.message || err.message));
    }
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
              <input name="typeId" placeholder="ID loại nhà hàng" value={formData.typeId} onChange={handleChange} required />
              <input name="restaurantTierId" placeholder="ID cấp độ nhà hàng" value={formData.restaurantTierId} onChange={handleChange} required />
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
