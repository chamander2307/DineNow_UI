import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { filterMenuItems } from "../../services/menuItemService";
import DishCard from "../../components/Dish/DishCard";
import FilterBar from "../../components/basicComponents/FilterBar";
import "../../assets/styles/Dish/AllDishes.css";

const AllDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const loadDishes = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams(location.search);
        const filterData = {
          city: params.get("city") || "",
          district: params.get("district") || "",
          mainCategoryId: params.get("mainCategoryId") || "",
          restaurantTypeId: params.get("restaurantTypeId") || "",
          minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
          maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
        };

        const response = await filterMenuItems(filterData, 0, 20); // Match old code's API call
        setDishes(response.data || []); // Revert to old code's response handling
      } catch (error) {
        console.error("Lỗi khi tải danh sách món ăn:", error);
        setError("Không tìm thấy món ăn phù hợp.");
      } finally {
        setLoading(false);
      }
    };
    loadDishes();
  }, [location.search]);

  return (
    <div>
      <FilterBar />
      <div className="all-dishes-page full-width">
        <div className="section-header center">
          <h2 className="section-title">Tất Cả Món Ăn</h2>
          <p className="section-sub">
            Khám phá hàng loạt món ăn ngon hấp dẫn mỗi ngày
          </p>
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <p className="loading">Đang tải...</p>
        ) : dishes.length === 0 ? (
          <p className="no-results">Không tìm thấy món ăn.</p>
        ) : (
          <div className="dishes-grid">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDishes;