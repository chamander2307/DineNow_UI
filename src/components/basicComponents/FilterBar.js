import React from "react";
import "../../assets/styles/home/FilterBar.css";

const FilterBar = () => {
  return (
    <div className="filter-bar">
      <select>
        <option value="">Chọn khu vực</option>
        <option value="quan1">Quận 1</option>
        <option value="quan3">Quận 3</option>
        <option value="binhthanh">Bình Thạnh</option>
      </select>
      <select>
        <option value="">Chọn nhà hàng</option>
        <option value="nha-hang-a">Nhà Hàng A</option>
        <option value="nha-hang-b">Nhà Hàng B</option>
      </select>
      <select>
        <option value="">Giá trung bình</option>
        <option value="duoi-100">Dưới 100k</option>
        <option value="100-200">100k - 200k</option>
        <option value="tren-200">Trên 200k</option>
      </select>
      <select>
        <option value="">Loại món ăn</option>
        <option value="lau">Lẩu</option>
        <option value="nuong">Nướng</option>
      </select>
      <button className="filter-button">Lọc</button>
    </div>
  );
};

export default FilterBar;
