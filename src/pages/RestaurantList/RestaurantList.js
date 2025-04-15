// src/pages/RestaurantList.js
import React from "react";
import RestaurantCard from "../../components/RestaurantCard";
import FilterBar from "../../components/FilterBar";
import LocationSearchBar from "../../components/LocationSearchBar";
import "../../assets/styles/RestaurantList.css";
import restaurant1 from "../../assets/img/restaurant1.jpg";
import restaurant2 from "../../assets/img/restaurant2.jpg";
import restaurant3 from "../../assets/img/restaurant3.jpg";

const restaurants = [
  {
    id: 1,
    name: "Lẩu Nướng Hàn Quốc",
    image: restaurant1,
    rating: 4.5,
    priceLevel: 3,
    address: "Vincom Center Landmark 81, Q. Bình Thạnh",
    visits: 25879,
  },
  {
    id: 2,
    name: "King BBQ Buffet – Lê Văn Sỹ",
    image: restaurant2,
    rating: 4.0,
    priceLevel: 2,
    address: "347 Lê Văn Sỹ, P.1, Q. Tân Bình",
    visits: 17240,
  },
  {
    id: 3,
    name: "Moo Beef Steak - Ngô Đức Kế",
    image: restaurant3,
    rating: 4.5,
    priceLevel: 4,
    address: "35-37 Ngô Đức Kế, Q.1",
    visits: 31870,
  },
  {
    id: 4,
    name: "Cơm Niêu Sài Gòn – Tú Xương",
    image: restaurant1,
    rating: 3.5,
    priceLevel: 2,
    address: "27 Tú Xương, P.7, Q.3",
    visits: 15499,
  },
];

const RestaurantList = () => {
  return (
    <div>
      <FilterBar />
      <LocationSearchBar />
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
