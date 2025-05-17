import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RestaurantCard from "../../components/Restaurants/RestaurantCard";
import FilterBar from "../../components/basicComponents/FilterBar";
import LocationSearchBar from "../../components/basicComponents/LocationSearchBar";
import "../../assets/styles/Restaurant/RestaurantList.css";
import {
  fetchAllRestaurants,
  searchRestaurants,
  fetchRestaurantsByTypeId,
} from "../../services/restaurantService";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const province = queryParams.get("province") || "";
        const restaurantName = queryParams.get("restaurantName") || "";
        const typeId = queryParams.get("typeId") || "";

        let response;
        if (typeId) {
          console.log("Gọi API fetchRestaurantsByTypeId với typeId:", typeId);
          response = await fetchRestaurantsByTypeId(typeId, 0, 10);
          setRestaurants(response.data || []);
        } else if (province || restaurantName) {
          const searchParams = { province, restaurantName };
          console.log("Gọi API searchRestaurants với params:", searchParams);
          response = await searchRestaurants(searchParams);
          setRestaurants(response.data || []);
        } else {
          console.log("Gọi API fetchAllRestaurants");
          response = await fetchAllRestaurants(0, 10);
          setRestaurants(response.data.content || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà hàng:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, [location.search]);

  return (
    <div>
      <LocationSearchBar />
      <FilterBar />
      <div className="restaurant-page">
        <h1 className="restaurant-title">Danh Sách Nhà Hàng</h1>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="restaurant-list">
            {restaurants.length > 0 ? (
              restaurants.map((item) => (
                <RestaurantCard key={item.id} {...item} />
              ))
            ) : (
              <p>Không có nhà hàng nào.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;