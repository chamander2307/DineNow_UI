import React, { useEffect, useState } from "react";
import {
  fetchRestaurantsByOwner,
  createRestaurant,
  updateRestaurant,
  fetchRestaurantTypes,
  fetchRestaurantTiers,
} from "../../services/restaurantService";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "../../assets/styles/Restaurant/RestaurantManagement.css";

const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [types, setTypes] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    typeId: "",
    restaurantTierId: "",
    description: "",
    images: [],
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  const isEdit = !!editData;

  useEffect(() => {
    loadRestaurants();
    loadOptions();
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data.map((p) => ({ value: p.code, label: p.name })));
      })
      .catch(() => alert("Không thể tải danh sách tỉnh."));
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.value}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data.districts.map((d) => ({ value: d.code, label: d.name })));
          setSelectedDistrict(null);
          setWards([]);
          setSelectedWard(null);
        })
        .catch(() => alert("Không thể tải danh sách quận/huyện."));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.value}?depth=2`)
        .then((res) => res.json())
        .then((data) => {
          setWards(data.wards.map((w) => ({ value: w.code, label: w.name })));
          setSelectedWard(null);
        })
        .catch(() => alert("Không thể tải danh sách phường/xã."));
    }
  }, [selectedDistrict]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      setRestaurants(res?.data || []);
    } catch (err) {
      alert("Không thể tải danh sách nhà hàng.");
    }
  };

  const loadOptions = async () => {
    try {
      const [typesRes, tiersRes] = await Promise.all([
        fetchRestaurantTypes(),
        fetchRestaurantTiers(),
      ]);
      setTypes(typesRes.map((t) => ({ id: t.id, name: t.name })));
      setTiers(tiersRes.data.data.map((t) => ({ id: t.id, name: t.name })));
    } catch (err) {
      alert("Không thể tải loại nhà hàng hoặc cấp độ.");
    }
  };

  const handleOpenCreate = () => {
    setEditData(null);
    setFormData({
      name: "",
      phone: "",
      typeId: "",
      restaurantTierId: "",
      description: "",
      images: [],
    });
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setShowModal(true);
  };

  const handleOpenEdit = (restaurant) => {
    setEditData(restaurant);
    setFormData({
      name: restaurant.name || "",
      phone: restaurant.phone || "",
      typeId: restaurant.typeId?.toString() || "",
      restaurantTierId: restaurant.restaurantTierId?.toString() || "",
      description: restaurant.description || "",
      images: [],
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "images" ? files : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !selectedProvince || !formData.typeId || !formData.restaurantTierId) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (0xxxxxxxxx).");
      return;
    }

    const fullAddress = [
      selectedWard?.label,
      selectedDistrict?.label,
      selectedProvince?.label,
    ].filter(Boolean).join(", ");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("address", fullAddress);
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
        alert("Cập nhật nhà hàng thành công!");
      } else {
        await createRestaurant(payload);
        alert("Tạo nhà hàng thành công!");
      }
      setShowModal(false);
      loadRestaurants();
    } catch (err) {
      alert("Không thể lưu nhà hàng: " + (err.response?.data?.message || err.message));
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
            <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Không có nhà hàng nào.</td></tr>
          ) : (
            restaurants.map((r) => (
              <tr key={r.id}>
                <td><img src={r.thumbnailUrl} alt={r.name} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6 }} /></td>
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
          <div className="modal-box restaurant-form">
            <h2>{isEdit ? "Chỉnh sửa nhà hàng" : "Tạo nhà hàng mới"}</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Tên nhà hàng" value={formData.name} onChange={handleChange} required />
              <label>Tỉnh / Thành phố</label>
              <Select
                options={provinces}
                value={selectedProvince}
                onChange={setSelectedProvince}
                placeholder="Chọn tỉnh"
                required
              />
              <label>Quận / Huyện</label>
              <Select
                options={districts}
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                placeholder="Chọn quận"
                isDisabled={!selectedProvince}
              />
              <label>Phường / Xã</label>
              <Select
                options={wards}
                value={selectedWard}
                onChange={setSelectedWard}
                placeholder="Chọn phường"
                isDisabled={!selectedDistrict}
              />
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
              <label>Mô tả</label>
              <CKEditor
                editor={ClassicEditor}
                data={formData.description}
                onChange={(event, editor) => {
                  setFormData((prev) => ({ ...prev, description: editor.getData() }));
                }}
              />
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