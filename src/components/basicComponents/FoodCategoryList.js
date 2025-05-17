import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/home/FilterBar.css";
import { fetchRestaurantTypes } from "../../services/restaurantService";

const FoodCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Load restaurant types
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchRestaurantTypes();
        setCategories(data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục nhà hàng:", error);
      }
    };
    loadCategories();
  }, []);

  // Handle category click to navigate to RestaurantList
  const handleCategoryClick = (categoryId) => {
    navigate(`/restaurant-list?typeId=${categoryId}`); // Fixed route to match AppRoutes
  };

  return (
    <div className="food-category-list">
      {categories.map((category) => (
        <div
          className="food-category-item"
          key={category.id}
          onClick={() => handleCategoryClick(category.id)}
        >
          <img
            className="circle-img"
            src={
              category.imageUrl && category.imageUrl !== "http://localhost:8080/uploads/null"
                ? category.imageUrl
                : "/fallback.jpg"
            }
            alt={category.name}
          />
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FoodCategoryList;