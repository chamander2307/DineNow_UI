import React, { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import Modal from "react-modal";
import { toast } from "react-toastify";
import {
  createRestaurant,
  updateRestaurant,
  fetchRestaurantTypes,
  fetchRestaurantTiers,
} from "../../services/restaurantService";
import "../../assets/styles/owner/MenuItem.css"; 

Modal.setAppElement("#root");

const RestaurantFormModal = ({ isOpen, onClose, restaurant, onRefresh, restaurants }) => {
  const [formData, setFormData] = useState({
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
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Tải dữ liệu ban đầu...");
        await Promise.all([
          loadRestaurantTypes(),
          loadRestaurantTiers(),
          loadProvinces(),
        ]);
      } catch (err) {
        toast.error(`Không thể tải dữ liệu: ${err.message || "Lỗi không xác định"}`);
      }
    };
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (restaurant) {
      console.log("Cập nhật form cho nhà hàng:", restaurant.id);
      const addressParts = restaurant.address?.split(", ") || [];
      setFormData({
        name: restaurant.name || "",
        phone: restaurant.phone || "",
        description: restaurant.description || "",
        typeId: restaurant.type?.id || null,
        restaurantTierId: restaurant.restaurantTierId || null,
        addressDetail: addressParts[0] || "",
        images: restaurant.imageUrls || [],
      });

      const autoFillAddress = async () => {
        try {
          const provinceName = addressParts[addressParts.length - 1] || "";
          const districtName = addressParts[addressParts.length - 2] || "";
          const wardName = addressParts[addressParts.length - 3] || "";

          const provinceRes = await fetch("https://provinces.open-api.vn/api/p/");
          const provincesData = await provinceRes.json();
          const matchedProvince = provincesData.find((p) => p.name === provinceName);
          if (matchedProvince) {
            setSelectedProvince({ value: matchedProvince.code, label: matchedProvince.name });

            const districtRes = await fetch(`https://provinces.open-api.vn/api/p/${matchedProvince.code}?depth=2`);
            const districtData = await districtRes.json();
            const matchedDistrict = districtData.districts.find((d) => d.name === districtName);
            if (matchedDistrict) {
              setSelectedDistrict({ value: matchedDistrict.code, label: matchedDistrict.name });

              const wardRes = await fetch(`https://provinces.open-api.vn/api/d/${matchedDistrict.code}?depth=2`);
              const wardData = await wardRes.json();
              const matchedWard = wardData.wards.find((w) => w.name === wardName);
              if (matchedWard) {
                setSelectedWard({ value: matchedWard.code, label: matchedWard.name });
              }
              setWards(wardData.wards.map((w) => ({ value: w.code, label: w.name })));
            }
            setDistricts(districtData.districts.map((d) => ({ value: d.code, label: d.name })));
          }
        } catch (err) {
          toast.error(`Không thể điền địa chỉ: ${err.message || "Lỗi không xác định"}`);
        }
      };
      autoFillAddress();
    } else {
      console.log("Reset form cho nhà hàng mới");
      resetForm();
    }
  }, [restaurant]);

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      description: "",
      typeId: null,
      restaurantTierId: null,
      addressDetail: "",
      images: [],
    });
    setImageFiles([]);
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const loadRestaurantTypes = async () => {
    try {
      const res = await fetchRestaurantTypes();
      setRestaurantTypes(res.map((type) => ({ value: type.id, label: type.name })));
    } catch (err) {
      toast.error(`Không thể tải loại nhà hàng: ${err.message || "Lỗi không xác định"}`);
    }
  };

  const loadRestaurantTiers = async () => {
    try {
      const res = await fetchRestaurantTiers();
      if (!res || res.length === 0) {
        toast.warn("Không có cấp độ nhà hàng.");
        setRestaurantTiers([]);
        return;
      }
      setRestaurantTiers(res.map((tier) => ({ value: tier.id, label: tier.name })));
    } catch (err) {
      toast.error(`Không thể tải cấp độ nhà hàng: ${err.message || "Lỗi không xác định"}`);
    }
  };

  const loadProvinces = async () => {
    try {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await res.json();
      setProvinces(data.map((p) => ({ value: p.code, label: p.name })));
    } catch (err) {
      toast.error(`Không thể tải tỉnh: ${err.message || "Lỗi không xác định"}`);
    }
  };

  const loadDistricts = async (provinceCode) => {
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
      const data = await res.json();
      setDistricts(data.districts.map((d) => ({ value: d.code, label: d.name })));
      setWards([]);
    } catch (err) {
      toast.error(`Không thể tải huyện: ${err.message || "Lỗi không xác định"}`);
    }
  };

  const loadWards = async (districtCode) => {
    try {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      const data = await res.json();
      setWards(data.wards.map((w) => ({ value: w.code, label: w.name })));
    } catch (err) {
      toast.error(`Không thể tải xã: ${err.message || "Lỗi không xác định"}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    console.log("Ảnh đã chọn:", files.map((f) => f.name));
  };

  const handleSelectChange = (selected, fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: selected ? selected.value : null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submit, ngăn GET mặc định");

    const missingFields = [];
    if (!formData.name) missingFields.push("Tên nhà hàng");
    if (!formData.phone) missingFields.push("Số điện thoại");
    if (!formData.typeId) missingFields.push("Loại nhà hàng");
    if (!formData.restaurantTierId && !restaurant?.id) missingFields.push("Cấp độ nhà hàng");
    if (!selectedProvince) missingFields.push("Tỉnh");
    if (!formData.description) missingFields.push("Mô tả nhà hàng");
    if (imageFiles.length === 0 && !restaurant?.id) missingFields.push("Ảnh nhà hàng");

    if (missingFields.length > 0) {
      console.log("Thiếu thông tin:", missingFields.join(", "));
      toast.error(`Vui lòng điền đầy đủ: ${missingFields.join(", ")}.`);
      return;
    }

    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      console.log("Số điện thoại không hợp lệ:", formData.phone);
      toast.error("Số điện thoại không hợp lệ (0xxxxxxxxx).");
      return;
    }

    // Normalize and check for duplicate names
    console.log("Kiểm tra tên nhà hàng trùng:", formData.name);
    console.log("Danh sách nhà hàng:", restaurants);
    const normalizedInputName = formData.name.trim().replace(/\s+/g, ' ').toLowerCase();
    const isDuplicate = restaurants.some((r) => {
      const normalizedExistingName = r.name?.trim().replace(/\s+/g, ' ').toLowerCase();
      return normalizedExistingName === normalizedInputName && r.id !== restaurant?.id;
    });

    if (isDuplicate) {
      console.log("Tên nhà hàng trùng:", formData.name);
      alert("Tên nhà hàng đã tồn tại. Vui lòng chọn tên khác.");
      return;
    }

    const fullAddress = [
      formData.addressDetail,
      selectedWard?.label,
      selectedDistrict?.label,
      selectedProvince?.label,
    ].filter(Boolean).join(", ");

    if (!fullAddress) {
      console.log("Thiếu thông tin địa chỉ đầy đủ");
      toast.error("Vui lòng nhập địa chỉ đầy đủ.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("phone", formData.phone);
    payload.append("address", fullAddress);
    payload.append("description", formData.description);
    payload.append("typeId", formData.typeId.toString());
    if (!restaurant?.id) {
      payload.append("restaurantTierId", formData.restaurantTierId.toString());
    }
    imageFiles.forEach((image, index) => {
      if (image instanceof File) {
        payload.append("images", image);
        console.log(`Thêm ảnh ${index + 1}: ${image.name}`);
      }
    });

    console.log("Payload:", [...payload.entries()]);

    try {
      setLoading(true);
      if (restaurant?.id) {
        console.log(`Gửi PUT /api/owner/restaurants/${restaurant.id}`);
        await updateRestaurant(restaurant.id, payload);
        toast.success("Cập nhật nhà hàng thành công!");
      } else {
        console.log("Gửi POST /api/owner/restaurants");
        await createRestaurant(payload);
        toast.success("Tạo nhà hàng thành công!");
      }
      onRefresh();
      handleClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Lỗi không xác định";
      console.error("Lỗi API:", err.response?.data || err);
      if (errorMessage.includes("name") && errorMessage.includes("already exists")) {
        alert("Tên nhà hàng đã tồn tại. Vui lòng chọn tên khác.");
      } else {
        toast.error(`Lỗi khi lưu nhà hàng: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <div className="modal-header">
        <h2>{restaurant ? "Sửa nhà hàng" : "Thêm nhà hàng"}</h2>
        <button className="close-btn" onClick={handleClose}>×</button>
      </div>
      <form onSubmit={handleSubmit} method="POST" className="modal-content">
        <div className="form-group full-width">
          <label>Tên nhà hàng</label>
          <input
            className="form-input"
            name="name"
            placeholder="Nhập tên nhà hàng"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Số điện thoại</label>
          <input
            className="form-input"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Loại nhà hàng</label>
          <Select
            className="select-input"
            placeholder="Chọn loại nhà hàng"
            value={restaurantTypes.find((type) => type.value === formData.typeId) || null}
            options={restaurantTypes}
            onChange={(selected) => handleSelectChange(selected, "typeId")}
            required
          />
        </div>

        <div className="form-group full-width">
          <label>Cấp độ</label>
          <Select
            className="select-input"
            placeholder="Chọn cấp độ"
            value={restaurantTiers.find((tier) => tier.value === formData.restaurantTierId) || null}
            options={restaurantTiers}
            onChange={(selected) => handleSelectChange(selected, "restaurantTierId")}
            required={!restaurant?.id}
            isDisabled={restaurant?.id}
          />
        </div>

        <div className="form-group full-width">
          <label>Địa chỉ</label>
          <div className="address-group">
            <Select
              className="select-input"
              placeholder="Chọn tỉnh"
              value={selectedProvince}
              options={provinces}
              onChange={(selected) => {
                setSelectedProvince(selected);
                setSelectedDistrict(null);
                setSelectedWard(null);
                loadDistricts(selected.value);
              }}
              required
            />
            <Select
              className="select-input"
              placeholder="Chọn huyện"
              value={selectedDistrict}
              options={districts}
              onChange={(selected) => {
                setSelectedDistrict(selected);
                setSelectedWard(null);
                loadWards(selected.value);
              }}
              isDisabled={!selectedProvince}
            />
            <Select
              className="select-input"
              placeholder="Chọn xã"
              value={selectedWard}
              options={wards}
              onChange={(selected) => setSelectedWard(selected)}
              isDisabled={!selectedDistrict}
            />
            <input
              className="form-input"
              name="addressDetail"
              placeholder="Số nhà, đường"
              value={formData.addressDetail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Hình ảnh hiện tại</label>
          <div className="image-preview">
            {formData.images.length > 0 ? (
              formData.images.map((url, index) => (
                <div key={index} className="image-wrapper">
                  <img src={url} alt={`Hình ảnh ${index + 1}`} className="image-preview-img" />
                </div>
              ))
            ) : (
              <p>Không có hình ảnh.</p>
            )}
          </div>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleImageChange}
            className="file-input"
            required={!restaurant?.id && imageFiles.length === 0}
          />
        </div>

        <div className="form-group full-width">
          <label>Mô tả</label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.description || ""}
            config={{
              toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "undo", "redo"],
            }}
            onChange={(event, editor) => setFormData({ ...formData, description: editor.getData() })}
          />
        </div>

        <div className="modal-buttons">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Đang xử lý..." : "Lưu"}
          </button>
          <button type="button" className="cancel-btn" onClick={handleClose}>Hủy</button>
        </div>
      </form>
    </Modal>
  );
};

export default RestaurantFormModal;