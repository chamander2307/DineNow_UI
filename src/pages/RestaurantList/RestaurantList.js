import React, { useState, useEffect } from "react";
import RestaurantCard from "../../components/Restaurants/RestaurantCard";
import FilterBar from "../../components/basicComponents/FilterBar";
import LocationSearchBar from "../../components/basicComponents/LocationSearchBar";
import "../../assets/styles/Restaurant/RestaurantList.css";
import { fetchAllRestaurants } from "../../services/restaurantService";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const response = await fetchAllRestaurants(0, 10);
        setRestaurants(response.data.content || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà hàng:", error);
        setRestaurants([]);
      }
    };
    loadRestaurants();
  }, []);

  return (
    <div>
      <LocationSearchBar />
      <FilterBar />
      <div className="restaurant-page">
        <h1 className="restaurant-title">Danh Sách Nhà Hàng</h1>
        <div className="restaurant-list">
          {restaurants.length > 0 ? (
            restaurants.map((item) => (
              <RestaurantCard key={item.id} {...item} />
            ))
          ) : (
            <p>Không có nhà hàng nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;