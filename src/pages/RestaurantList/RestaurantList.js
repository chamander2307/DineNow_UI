// src/pages/RestaurantList.js
import React from "react";
import RestaurantCard from "../../components/Restaurants/RestaurantCard";
import FilterBar from "../../components/basicComponents/FilterBar";
import LocationSearchBar from "../../components/basicComponents/LocationSearchBar";
import "../../assets/styles/RestaurantList.css";
import { restaurants } from "../../data/restaurants";

const RestaurantList = () => {
  return (
    <div>
      <LocationSearchBar />
      <FilterBar />
      <div className="restaurant-page">
        <h1 className="restaurant-title">Danh Sách Nhà Hàng</h1>

        <div className="restaurant-list">
          {restaurants.map((item) => (
            <RestaurantCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;
