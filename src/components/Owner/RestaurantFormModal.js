import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import Modal from "react-modal";
import {
  createRestaurant,
  updateRestaurant,
  fetchRestaurantTypes,
  fetchRestaurantTiers,
  fetchRestaurantsByOwner,
} from "../../services/restaurantService";

const RestaurantFormModal = ({ isOpen, onClose, restaurant, onRefresh }) => {
  const [formData, setFormData] = useState(restaurant || {
    name: "",
    phone: "",
    description: "",
    typeId: null,
    restaurantTierId: null,
    addressDetail: "",
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [restaurantTiers, setRestaurantTiers] = useState([]);
  const [existingRestaurants, setExistingRestaurants] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);

  useEffect(() => {
    loadProvinces();
    loadRestaurantTypes();
    loadRestaurantTiers();
    loadExistingRestaurants();
  }, []);

  // Load danh sách nhà hàng của chủ sở hữu
  const loadExistingRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      // Kiểm tra dữ liệu trả về từ API
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setExistingRestaurants(res.data.data);
      } else {
        setExistingRestaurants([]);
        console.warn("Dữ liệu không đúng định dạng:", res);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách nhà hàng của chủ sở hữu:", err);
    }
  };

  // Kiểm tra trùng tên nhà hàng
  const isDuplicateRestaurantName = (name) => {
    if (!Array.isArray(existingRestaurants)) return false;
    return existingRestaurants.some((restaurant) => restaurant.name === name);
  };

  // Load danh sách loại nhà hàng
  const loadRestaurantTypes = async () => {
    try {
      const res = await fetchRestaurantTypes();
      setRestaurantTypes(res.map((type) => ({ value: type.id, label: type.name })));
    } catch (err) {
      console.error("Lỗi khi tải loại nhà hàng:", err);
    }
  };

  // Load danh sách cấp độ nhà hàng
  const loadRestaurantTiers = async () => {
    try {
      const res = await fetchRestaurantTiers();
      setRestaurantTiers(res.data.data.map((tier) => ({ value: tier.id, label: tier.name })));
    } catch (err) {
      console.error("Lỗi khi tải cấp độ nhà hàng:", err);
    }
  };

  // Load danh sách tỉnh từ API ngoài
  const loadProvinces = async () => {
    try {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await res.json();
      setProvinces(data.map((p) => ({ value: p.code, label: p.name })));
    } catch (err) {
      console.error("Lỗi khi tải danh sách tỉnh:", err);
    }
  };

  // Load danh sách quận/huyện từ API ngoài
  const loadDistricts = async (provinceCode) => {
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await res.json();
      setDistricts(data.districts.map((d) => ({ value: d.code, label: d.name })));
      setWards([]);
    } catch (err) {
      console.error("Lỗi khi tải danh sách quận/huyện:", err);
    }
  };

  // Load danh sách phường/xã từ API ngoài
  const loadWards = async (districtCode) => {
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await res.json();
      setWards(data.wards.map((w) => ({ value: w.code, label: w.name })));
    } catch (err) {
      console.error("Lỗi khi tải danh sách phường/xã:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.typeId || !formData.restaurantTierId) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (isDuplicateRestaurantName(formData.name)) {
      alert("Tên nhà hàng đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    const fullAddress = [
      formData.addressDetail,
      selectedWard?.label,
      selectedDistrict?.label,
      selectedProvince?.label,
    ].filter(Boolean).join(", ");

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("phone", formData.phone);
    payload.append("address", fullAddress);
    payload.append("description", formData.description);
    payload.append("typeId", formData.typeId);
    payload.append("restaurantTierId", formData.restaurantTierId);

    imageFiles.forEach((image) => {
      payload.append("images", image, image.name);
    });

    try {
      if (formData.id) {
        await updateRestaurant(formData.id, payload);
        alert("Cập nhật nhà hàng thành công!");
        console.log("Cập nhật thành công:", formData.id);
        console.log("Phản hồi từ API:", payload);
      } else {
        await createRestaurant(payload);
        alert("Tạo nhà hàng thành công!");
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Lỗi khi gửi form:", err.response?.data || err.message);
      alert(`Lỗi khi lưu nhà hàng: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="modal-overlay">
      <div className="modal-header">
        <h2>{restaurant ? "Sửa nhà hàng" : "Thêm nhà hàng"}</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <form onSubmit={handleSubmit} className="modal-content">
        <input name="name" placeholder="Tên nhà hàng" value={formData.name} onChange={handleChange} required />
        <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />

        <Select placeholder="Loại nhà hàng" options={restaurantTypes} onChange={(selected) => handleChange({ target: { name: "typeId", value: selected.value } })} />
        <Select placeholder="Cấp độ nhà hàng" options={restaurantTiers} onChange={(selected) => handleChange({ target: { name: "restaurantTierId", value: selected.value } })} />

        <input name="addressDetail" placeholder="Số nhà, đường" value={formData.addressDetail} onChange={handleChange} />

        <input type="file" name="images" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} />
        <CKEditor editor={ClassicEditor} data={formData.description} onChange={(event, editor) => setFormData({ ...formData, description: editor.getData() })} />

        <div className="modal-buttons">
          <button type="submit">Lưu</button>
          <button type="button" onClick={onClose}>Hủy</button>
        </div>
      </form>
    </Modal>
  );
};

export default RestaurantFormModal;
