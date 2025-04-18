import React, { useState } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "../../assets/styles/LocationSearchBar.css";

const LocationSearchBar = () => {
  const [city, setCity] = useState("Hồ Chí Minh");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    console.log("Tìm kiếm:", city, searchTerm);
    // Bạn có thể gọi API hoặc điều hướng tại đây
  };

  return (
    <div className="location-search-bar">
      <div className="city-select">
        <FaMapMarkerAlt className="icon" />
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Nhập nhà hàng bạn muốn đến..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>
        <FaSearch className="icon" />
        <span>Tìm kiếm</span>
      </button>
    </div>
  );
};

export default LocationSearchBar;
