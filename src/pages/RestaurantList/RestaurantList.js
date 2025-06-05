import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RestaurantCard from "../../components/Restaurants/RestaurantCard";
import FilterBar from "../../components/basicComponents/FilterBar";
import LocationSearchBar from "../../components/basicComponents/LocationSearchBar";
import "../../assets/styles/Restaurant/RestaurantList.css";
import BookingGuide from "../../components/basicComponents/BookingGuide";
import FoodCategoryList from "../../components/basicComponents/FoodCategoryList";
import {
  fetchAllRestaurants,
  searchRestaurants,
  fetchRestaurantsByTypeId,
} from "../../services/restaurantService";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      try {
        let response;
        if (location.state?.nearbyRestaurants) {
          setRestaurants(location.state.nearbyRestaurants);
        } else {
          const queryParams = new URLSearchParams(location.search);
          const province = queryParams.get("province") || "";
          const restaurantName = queryParams.get("restaurantName") || "";
          const typeId = queryParams.get("typeId") || "";

          if (typeId) {
            response = await fetchRestaurantsByTypeId(typeId, page, 20);
            setRestaurants(response.data || []);
          } else if (province || restaurantName) {
            response = await searchRestaurants({ province, restaurantName });
            setRestaurants(response.data || []);
          } else {
            response = await fetchAllRestaurants(page, 20);
            setRestaurants(response.data.content || []);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà hàng:", error);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };
    loadRestaurants();
  }, [location.search, page, location.state]);

  return (
    <div>
      <LocationSearchBar />
      <FilterBar />
      <FoodCategoryList />
      <div className="rl-page">
        <h1 className="rl-title">
          {location.state?.nearbyRestaurants ? "Nhà Hàng Gần Bạn" : "Danh Sách Nhà Hàng"}
        </h1>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="rl-card-container">
            {restaurants.length > 0 ? (
              restaurants.map((item) => (
                <div key={item.id} className="rl-card-item">
                  <RestaurantCard
                    {...item}
                    thumbnailUrl={item.thumbnailUrl || "https://via.placeholder.com/330x200"}
                    visits={item.reservationCount || 0}
                  />
                </div>
              ))
            ) : (
              <p>
                {location.state?.nearbyRestaurants
                  ? "Không có nhà hàng nào gần bạn trong bán kính 10km."
                  : "Không có nhà hàng nào được tìm thấy."}
              </p>
            )}
          </div>
        )}
        {!location.state?.nearbyRestaurants && (
          <div className="rl-pagination">
            <button
              className="prev"
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
            ></button>
            <span>Trang {page + 1}</span>
            <button
              className="next"
              onClick={() => setPage(page + 1)}
              disabled={restaurants.length < 20}
            ></button>
          </div>
        )}
      </div>
      <BookingGuide />
    </div>
  );
};

export default RestaurantList;
