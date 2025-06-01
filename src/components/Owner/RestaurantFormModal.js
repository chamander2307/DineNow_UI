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
  fetchRestaurantById,
} from "../../services/restaurantService";
import "../../assets/styles/owner/ModalForm.css";
Modal.setAppElement("#root");

const RestaurantFormModal = ({ isOpen, onClose, restaurantId, onRefresh, restaurants }) => {
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
  const [changedFields, setChangedFields] = useState(new Set());

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
    if (isOpen && restaurantId) {
      console.log("Tải thông tin nhà hàng với ID:", restaurantId);
      const loadRestaurantDetails = async () => {
        try {
          const restaurant = await fetchRestaurantById(restaurantId);
          console.log("Dữ liệu nhà hàng từ API:", restaurant);

          const initialFormData = {
            name: restaurant.name || "",
            phone: restaurant.phone || "",
            description: restaurant.description || "",
            typeId: null,
            restaurantTierId: null,
            addressDetail: "",
            images: Array.isArray(restaurant.imageUrls) ? restaurant.imageUrls : [],
          };
          setFormData(initialFormData);
          setImageFiles([]);
          setChangedFields(new Set());
          setSelectedProvince(null);
          setSelectedDistrict(null);
          setSelectedWard(null);
          setDistricts([]);
          setWards([]);
        } catch (err) {
          toast.error(`Không thể tải chi tiết nhà hàng: ${err.message || "Lỗi không xác định"}`);
        }
      };
      loadRestaurantDetails();
    } else if (isOpen && !restaurantId) {
      console.log("Reset form cho nhà hàng mới");
      resetForm();
    }
  }, [isOpen, restaurantId]);

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
    setChangedFields(new Set());
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
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
    setChangedFields((prev) => new Set(prev).add(name));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Images changed:", files.map(f => f.name));
    setImageFiles(files);
    setChangedFields((prev) => new Set(prev).add("images"));
  };

  const handleSelectChange = (selected, fieldName) => {
    console.log(`Select changed: ${fieldName} = ${selected?.value}`);
    setFormData((prev) => ({ ...prev, [fieldName]: selected ? selected.value : null }));
    setChangedFields((prev) => new Set(prev).add(fieldName));
  };

  const handleProvinceChange = (selected) => {
    console.log("Province changed:", selected?.label);
    setSelectedProvince(selected);
    setSelectedDistrict(null);
    setSelectedWard(null);
    loadDistricts(selected.value);
    setChangedFields((prev) => new Set(prev).add("address"));
  };

  const handleDistrictChange = (selected) => {
    console.log("District changed:", selected?.label);
    setSelectedDistrict(selected);
    setSelectedWard(null);
    loadWards(selected.value);
    setChangedFields((prev) => new Set(prev).add("address"));
  };

  const handleWardChange = (selected) => {
    console.log("Ward changed:", selected?.label);
    setSelectedWard(selected);
    setChangedFields((prev) => new Set(prev).add("address"));
  };

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    console.log("Description changed:", data);
    setFormData((prev) => ({ ...prev, description: data }));
    setChangedFields((prev) => new Set(prev).add("description"));
  };

  const isNonEmpty = (value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submit, ngăn GET mặc định");
    console.log("Changed fields:", [...changedFields]);
    console.log("FormData:", formData);
    console.log("ImageFiles:", imageFiles.map(f => f.name));
    console.log("Address components:", {
      addressDetail: formData.addressDetail,
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard
    });

    if (!restaurantId) {
      const missingFields = [];
      if (!formData.name) missingFields.push("Tên nhà hàng");
      if (!formData.phone) missingFields.push("Số điện thoại");
      if (!formData.typeId) missingFields.push("Loại nhà hàng");
      if (!formData.restaurantTierId) missingFields.push("Cấp độ nhà hàng");
      if (!selectedProvince) missingFields.push("Tỉnh");
      if (!formData.description) missingFields.push("Mô tả nhà hàng");
      if (imageFiles.length === 0 && formData.images.length === 0) missingFields.push("Ảnh nhà hàng");

      if (missingFields.length > 0) {
        console.log("Thiếu thông tin:", missingFields.join(", "));
        toast.error(`Vui lòng điền đầy đủ: ${missingFields.join(", ")}.`);
        return;
      }
    }

    if (changedFields.has("phone") && isNonEmpty(formData.phone)) {
      const phoneRegex = /^0[0-9]{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        console.log("Số điện thoại không hợp lệ:", formData.phone);
        toast.error("Số điện thoại không hợp lệ (0xxxxxxxxx).");
        return;
      }
    }

    if (changedFields.has("name") && isNonEmpty(formData.name)) {
      console.log("Kiểm tra tên nhà hàng trùng:", formData.name);
      const normalizedInputName = formData.name.trim().replace(/\s+/g, " ").toLowerCase();
      const isDuplicate = restaurants.some((r) => {
        const normalizedExistingName = r.name?.trim().replace(/\s+/g, " ").toLowerCase();
        return normalizedExistingName === normalizedInputName && r.id !== restaurantId;
      });

      if (isDuplicate) {
        console.log("Tên nhà hàng trùng:", formData.name);
        alert("Tên nhà hàng đã tồn tại. Vui lòng chọn tên khác.");
        return;
      }
    }

    let fullAddress = null;
    if (
      changedFields.has("address") &&
      (isNonEmpty(formData.addressDetail) || selectedWard || selectedDistrict || selectedProvince)
    ) {
      fullAddress = [
        formData.addressDetail,
        selectedWard?.label,
        selectedDistrict?.label,
        selectedProvince?.label,
      ]
        .filter(Boolean)
        .join(", ");
    }
    console.log("FullAddress:", fullAddress);

    const payload = new FormData();

    if (restaurantId) {
      if (changedFields.has("name") && isNonEmpty(formData.name)) {
        payload.append("name", formData.name);
      }
      if (changedFields.has("phone") && isNonEmpty(formData.phone)) {
        payload.append("phone", formData.phone);
      }
      if (changedFields.has("address") && isNonEmpty(fullAddress)) {
        payload.append("address", fullAddress);
      }
      if (changedFields.has("description") && isNonEmpty(formData.description)) {
        payload.append("description", formData.description);
      }
      if (changedFields.has("typeId") && isNonEmpty(formData.typeId)) {
        payload.append("typeId", formData.typeId.toString());
      }
      if (changedFields.has("restaurantTierId") && isNonEmpty(formData.restaurantTierId)) {
        payload.append("restaurantTierId", formData.restaurantTierId.toString());
      }
      if (changedFields.has("images") && imageFiles.length > 0) {
        imageFiles.forEach((image, index) => {
          if (image instanceof File) {
            payload.append("images", image);
            console.log(`Thêm ảnh ${index + 1}: ${image.name}`);
          }
        });
      }
    } else {
      payload.append("name", formData.name);
      payload.append("phone", formData.phone);
      payload.append("address", fullAddress);
      payload.append("description", formData.description);
      payload.append("typeId", formData.typeId.toString());
      payload.append("restaurantTierId", formData.restaurantTierId.toString());
      imageFiles.forEach((image, index) => {
        if (image instanceof File) {
          payload.append("images", image);
          console.log(`Thêm ảnh ${index + 1}: ${image.name}`);
        }
      });
    }

    if (restaurantId && payload.entries().next().done) {
      console.log("Không có trường nào được cập nhật");
      toast.warn("Vui lòng cập nhật ít nhất một trường.");
      return;
    }

    console.log("Payload:", [...payload.entries()]);

    try {
      setLoading(true);
      if (restaurantId) {
        console.log(`Gửi PUT /api/owner/restaurants/${restaurantId}`);
        await updateRestaurant(restaurantId, payload);
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
        <h2>{restaurantId ? "Sửa nhà hàng" : "Thêm nhà hàng"}</h2>
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
            required={!restaurantId}
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
            required={!restaurantId}
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
            required={!restaurantId}
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
            required={!restaurantId}
            isDisabled={restaurantId}
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
              onChange={handleProvinceChange}
              required={!restaurantId}
            />
            <Select
              className="select-input"
              placeholder="Chọn huyện"
              value={selectedDistrict}
              options={districts}
              onChange={handleDistrictChange}
              isDisabled={!selectedProvince}
            />
            <Select
              className="select-input"
              placeholder="Chọn xã"
              value={selectedWard}
              options={wards}
              onChange={handleWardChange}
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
            {formData.images && formData.images.length > 0 ? (
              formData.images.map((url, index) => (
                <div key={index} className="image-wrapper">
                  <img
                    src={url}
                    alt={`Hình ảnh ${index + 1}`}
                    className="image-preview-img"
                    onError={(e) => { e.target.src = "/fallback.jpg"; }}
                  />
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
            required={!restaurantId && formData.images.length === 0}
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
            onChange={handleDescriptionChange}
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