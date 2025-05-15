import React, { useState } from "react";
import { searchRestaurants } from "../../services/restaurantService";
import "../../assets/styles/home/LocationSearchBar.css";

const LocationSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await searchRestaurants({ restaurantName: searchTerm });
      setSearchResults(response.data?.content || []);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
      setSearchResults([]);
    }
  };

  return (
    <div className="location-search-bar">
      <input
        type="text"
        placeholder="Nhập nhà hàng bạn muốn tìm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Tìm kiếm</button>
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Kết quả tìm kiếm:</h4>
          <ul>
            {searchResults.map((restaurant) => (
              <li key={restaurant.id}>
                <a href={`/restaurant/${restaurant.id}`}>{restaurant.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearchBar;