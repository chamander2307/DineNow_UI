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
  const [page, setPage] = useState(0);
  const location = useLocation();

  // Fetch data
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
          response = await fetchRestaurantsByTypeId(typeId, page, 10);
          setRestaurants(response.data || []);
        } else if (province || restaurantName) {
          const searchParams = { province, restaurantName };
          console.log("Gọi API searchRestaurants với params:", searchParams);
          response = await searchRestaurants(searchParams);
          setRestaurants(response.data || []);
        } else {
          console.log("Gọi API fetchAllRestaurants");
          response = await fetchAllRestaurants(page, 10);
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
  }, [location.search, page]);

  // Phân trang
  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(page > 0 ? page - 1 : 0);

  return (
    <div>
      <LocationSearchBar />
      <FilterBar />
      <div className="rl-page">
        <h1 className="rl-title">Danh Sách Nhà Hàng</h1>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="rl-card-container">
            {restaurants.length > 0 ? (
              restaurants.map((item) => (
                <div key={item.id} className="rl-card-item">
                  <RestaurantCard
                    {...item}
                    thumbnailUrl={item.thumbnailUrl || "https://via.placeholder.com/330x200"} // Fallback image
                  />
                </div>
              ))
            ) : (
              <p>Không có nhà hàng nào.</p>
            )}
          </div>
        )}
        <div className="rl-pagination">
          <button onClick={handlePrevPage} disabled={page === 0}>
            Trang trước
          </button>
          <span>Trang {page + 1}</span>
          <button onClick={handleNextPage} disabled={restaurants.length < 10}>
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantList;