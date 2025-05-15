import React, { useState, useEffect } from "react";
import { searchRestaurants } from "../../services/restaurantService";
import { fetchMainCategories } from "../../services/menuItemService";
import "../../assets/styles/home/FilterBar.css";

const FilterBar = () => {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadProvinces = async () => {
    try {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await res.json();
      setProvinces(data.map((p) => ({ value: p.code, label: p.name })));
    } catch (err) {
      console.error("Lỗi khi tải danh sách tỉnh:", err);
    }
  };

  const loadDistricts = async (provinceCode) => {
    try {
      const res = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await res.json();
      setDistricts(
        data.districts.map((d) => ({ value: d.code, label: d.name }))
      );
      setDistrict(""); // Reset district khi tỉnh thay đổi
    } catch (err) {
      console.error("Lỗi khi tải danh sách huyện:", err);
    }
  };

  const loadMainCategories = async () => {
    try {
      const data = await fetchMainCategories();
      setCategories(
        data.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      );
    } catch (error) {
      console.error("Lỗi khi tải danh mục món ăn:", error);
    }
  };

  useEffect(() => {
    loadProvinces();
    loadMainCategories();
  }, []);

  useEffect(() => {
    if (city) {
      loadDistricts(city);
    } else {
      setDistricts([]);
      setDistrict("");
    }
  }, [city]);

  const handleFilter = async () => {
    try {
      const response = await searchRestaurants({ province: city, district });
      console.log("Kết quả lọc:", response);
    } catch (error) {
      console.error("Lỗi khi lọc:", error);
    }
  };

  return (
    <div className="filter-bar">
      <select
        className="filter-select"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option value="">Chọn Tỉnh/Thành phố</option>
        {provinces.map((province) => (
          <option key={province.value} value={province.value}>
            {province.label}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        disabled={!city}
      >
        <option value="">Chọn Quận/Huyện</option>
        {districts.map((district) => (
          <option key={district.value} value={district.value}>
            {district.label}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Loại món ăn</option>
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      >
        <option value="">Giá trung bình</option>
        <option value="100">Dưới 100k</option>
        <option value="100-200">100k - 200k</option>
        <option value="200">Trên 200k</option>
      </select>

      <button className="filter-button" onClick={handleFilter}>
        Lọc
      </button>
    </div>
  );
};

export default FilterBar;
