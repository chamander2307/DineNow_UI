import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RestaurantCard from "../../components/Restaurants/RestaurantCard";
import FilterBar from "../../components/basicComponents/FilterBar";
import LocationSearchBar from "../../components/basicComponents/LocationSearchBar";
import "../../assets/styles/Restaurant/RestaurantList.css";
import BookingGuide from "../../components/basicComponents/BookingGuide";
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
        console.log("location.state:", location.state);
        // Kiểm tra nếu có danh sách nhà hàng từ state (từ "Gần Bạn")
        if (location.state?.nearbyRestaurants) {
          console.log("Hiển thị nhà hàng gần đây:", location.state.nearbyRestaurants);
          setRestaurants(location.state.nearbyRestaurants);
        } else {
          const queryParams = new URLSearchParams(location.search);
          const province = queryParams.get("province") || "";
          const restaurantName = queryParams.get("restaurantName") || "";
          const typeId = queryParams.get("typeId") || "";

          let response;
          if (typeId) {
            console.log("Gọi API fetchRestaurantsByTypeId với typeId:", typeId);
            response = await fetchRestaurantsByTypeId(typeId, page, 20);
            setRestaurants(response.data || []);
          } else if (province || restaurantName) {
            const searchParams = { province, restaurantName };
            console.log("Gọi API searchRestaurants với params:", searchParams);
            response = await searchRestaurants(searchParams);
            setRestaurants(response.data || []);
          } else {
            console.log("Gọi API fetchAllRestaurants");
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

  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(page > 0 ? page - 1 : 0);

  return (
    <div>
      <LocationSearchBar />
      <FilterBar />
      <div className="rl-page">
        <h1 className="rl-title">
          {location.state?.nearbyRestaurants ? "Nhà Hàng Gần Bạn" : "Danh Sách Nhà Hàng"}
        </h1>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="rl-card-container">
            {restaurants.length > 0 ? (
              restaurants.map((item) => {
                console.log("Render nhà hàng:", item);
                return (
                  <div key={item.id} className="rl-card-item">
                    <RestaurantCard
                      {...item}
                      thumbnailUrl={item.thumbnailUrl || "https://via.placeholder.com/330x200"}
                      visits={item.reservationCount || 0}
                    />
                  </div>
                );
              })
            ) : (
              <p>
                {location.state?.nearbyRestaurants
                  ? "Không có nhà hàng nào gần bạn trong bán kính 10km."
                  : "Không có nhà hàng nào được tìm thấy."}
              </p>
            )}
          </div>
        )}
        <div className="rl-pagination">
          <button onClick={handlePrevPage} disabled={page === 0}>
            Trang trước
          </button>
          <span>Trang {page + 1}</span>
          <button
            onClick={handleNextPage}
            disabled={restaurants.length < 20 || location.state?.nearbyRestaurants}
          >
            Trang sau
          </button>
        </div>
      </div>
      <BookingGuide />
    </div>
  );
};

export default RestaurantList;