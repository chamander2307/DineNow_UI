import React, { useState, useEffect } from "react";
import "../../assets/styles/Dish/AllDishes.css";
import DishCard from "../../components/Dish/DishCard";
import { fetchMenuItems } from "../../services/menuItemService";

const AllDishes = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const response = await fetchMenuItems(0, 20);
        setDishes(response.content || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách món ăn:", error);
      }
    };
    loadDishes();
  }, []);

  return (
    <div className="all-dishes-page full-width">
      <div className="section-header center">
        <h2 className="section-title">Tất Cả Món Ăn</h2>
        <p className="section-sub">
          Khám phá hàng loạt món ăn ngon hấp dẫn mỗi ngày
        </p>
      </div>
      <div className="dishes-grid">
        {dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default AllDishes;