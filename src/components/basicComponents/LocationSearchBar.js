// LocationSearchBar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/home/LocationSearchBar.css";

const LocationSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadProvinces = async () => {
    try {
      const res = await fetch("https://provinces.open-api.vn/api/p/");
      const data = await res.json();
      setProvinces(data.map((p) => ({ value: p.name, label: p.name })));
    } catch (err) {
      console.error("Lỗi khi tải danh sách tỉnh:", err);
      setError("Không thể tải danh sách tỉnh.");
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  const handleSearch = () => {
    if (!city && !searchTerm) {
      setError("Vui lòng chọn tỉnh/thành phố hoặc nhập tên nhà hàng.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const params = {
        restaurantName: searchTerm,
        province: city || "",
      };
      console.log("Dữ liệu tìm kiếm:", params);
      navigate(
        `/restaurant-list?province=${encodeURIComponent(
          city
        )}&restaurantName=${encodeURIComponent(searchTerm)}`
      );
    } catch (error) {
      console.error("Lỗi khi tìm kiếm:", error);
      setError("Có lỗi xảy ra khi tìm kiếm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-search-container">
      <div className="location-search-bar">
        <div className="city-select">
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((province) => (
              <option key={province.value} value={province.value}>
                {province.label}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Nhập nhà hàng bạn muốn tìm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LocationSearchBar;
