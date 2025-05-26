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

        const response = await filterMenuItems(filterData, 0, 20);
        const dishesData = Array.isArray(response.data) ? response.data : [];
        console.log("Dishes data in AllDishes:", dishesData); // Debug
        setDishes(dishesData);
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
      <div className="ad-page">
        <div className="ad-section-header center"></div>
        {error && <div className="ad-error-message">{error}</div>}
        {loading ? (
          <p className="ad-loading">Đang tải...</p>
        ) : dishes.length === 0 ? (
          <p className="ad-no-results">Không tìm thấy món ăn.</p>
        ) : (
          <div className="ad-dishes-grid">
            {dishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish} // Truyền dish trực tiếp
                restaurantId={dish.restaurantId || null}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDishes;