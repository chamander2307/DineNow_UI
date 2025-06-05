import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { filterMenuItems, fetchMainCategories } from "../../services/menuItemService";
import { fetchRestaurantTypes } from "../../services/restaurantService";
import "../../assets/styles/home/FilterBar.css";

const FilterBar = () => {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [restaurantTypeList, setRestaurantTypeList] = useState([]);
  const [selectedRestaurantType, setSelectedRestaurantType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadProvinces = async () => {
    try {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await res.json();
      const provinces = data.map((p) => ({
        value: p.name,
        label: p.name,
        code: p.code,
      }));
      setProvinces(provinces);
    } catch (err) {
      console.error("Lỗi khi tải danh sách tỉnh:", err);
      setError("Không thể tải danh sách tỉnh.");
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
      setError("Không thể tải danh mục món ăn.");
    }
  };

  const loadRestaurantTypes = async () => {
    try {
      const data = await fetchRestaurantTypes();
      setRestaurantTypeList(
        data.map((type) => ({
          value: type.id,
          label: type.name,
        }))
      );
    } catch (error) {
      console.error("Lỗi khi tải loại nhà hàng:", error);
      setError("Không thể tải loại nhà hàng.");
    }
  };

  useEffect(() => {
    loadProvinces();
    loadMainCategories();
    loadRestaurantTypes();
  }, []);

  const handleFilter = async () => {
    setLoading(true);
    setError("");
    try {
      const filterData = {};
      if (city) filterData.city = city;
      if (category) filterData.mainCategoryId = category;
      if (selectedRestaurantType) filterData.restaurantTypeId = selectedRestaurantType;
      if (price) {
        const [minPrice, maxPrice] = price.split("-").map(Number);
        filterData.minPrice = minPrice || 0;
        filterData.maxPrice = maxPrice || undefined;
      }

      const queryParams = new URLSearchParams();
      if (city) queryParams.append("city", city);
      if (category) queryParams.append("mainCategoryId", category);
      if (selectedRestaurantType) queryParams.append("restaurantTypeId", selectedRestaurantType);
      if (price) {
        const [minPrice, maxPrice] = price.split("-").map(Number);
        queryParams.append("minPrice", minPrice || 0);
        if (maxPrice) queryParams.append("maxPrice", maxPrice);
      }

      console.log("Dữ liệu lọc:", filterData);
      await filterMenuItems(filterData, 0, 20);

      navigate(`/all-dishes?${queryParams.toString()}`);
    } catch (error) {
      console.error("Lỗi khi lọc:", error);
      setError("Không tìm thấy kết quả phù hợp.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="filter-bar">
      {error && <div className="error-message">{error}</div>}
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
        value={selectedRestaurantType}
        onChange={(e) => setSelectedRestaurantType(e.target.value)}
      >
        <option value="">Loại nhà hàng</option>
        {restaurantTypeList.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
      <select
        className="filter-select"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      >
        <option value="">Giá trung bình</option>
        <option value="0-100000">Dưới 100k</option>
        <option value="100000-200000">100k - 200k</option>
        <option value="200000-500000">200k - 500k</option>
        <option value="500000-">Trên 500k</option>
      </select>
      <button
        className="filter-button"
        onClick={handleFilter}
        disabled={loading}
      >
        {loading ? "Đang tìm..." : "Lọc"}
      </button>
    </div>
  );
};

export default FilterBar;