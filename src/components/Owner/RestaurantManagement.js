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
  // ... phần còn lại không đổi, chỉ sửa phần modal

  return (
    <div className="restaurant-table-container">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Nhà hàng của bạn</h2>
        <button className="action-btn" onClick={handleOpenCreate}>+ Tạo nhà hàng</button>
      </div>

      <table className="restaurant-table">
        {/* ... không đổi ... */}
      </table>

      {showModal && (
        <div className={`modal-overlay ${showModal ? "active" : ""}`}>
          <div className="modal-box restaurant-form">
            <h2>{isEdit ? "Chỉnh sửa nhà hàng" : "Tạo nhà hàng mới"}</h2>
            <form onSubmit={handleSubmit}>
              <label>Tên nhà hàng</label>
              <input name="name" placeholder="Tên nhà hàng" value={formData.name} onChange={handleChange} required />
              <label>Tỉnh / Thành phố</label>
              <Select
                classNamePrefix="react-select"
                options={provinces}
                value={selectedProvince}
                onChange={setSelectedProvince}
                placeholder="Chọn tỉnh"
                required
              />
              <label>Quận / Huyện</label>
              <Select
                classNamePrefix="react-select"
                options={districts}
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                placeholder="Chọn quận"
                isDisabled={!selectedProvince}
              />
              <label>Phường / Xã</label>
              <Select
                classNamePrefix="react-select"
                options={wards}
                value={selectedWard}
                onChange={setSelectedWard}
                placeholder="Chọn phường"
                isDisabled={!selectedDistrict}
              />
              <label>Số điện thoại</label>
              <input name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />
              <label>Loại nhà hàng</label>
              <select name="typeId" value={formData.typeId} onChange={handleChange} required>
                <option value="">-- Chọn loại nhà hàng --</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <label>Cấp độ</label>
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
              <label>Hình ảnh</label>
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