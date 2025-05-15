import React, { useState, useEffect } from "react";
import "../../assets/styles/home/FilterBar.css";
import { fetchRestaurantTypes } from "../../services/restaurantService";

const FoodCategoryList = () => {
  const [categories, setCategories] = useState([]);

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

  return (
    <div className="food-category-list">
      {categories.map((category) => (
        <div className="food-category-item" key={category.id}>
          <img
            className="circle-img"
            src={category.imageUrl && category.imageUrl !== "http://localhost:8080/uploads/null" ? category.imageUrl : "/fallback.jpg"}
            alt={category.name}
          />
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default FoodCategoryList;