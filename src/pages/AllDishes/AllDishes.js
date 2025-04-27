import React from "react";
import "../../assets/styles/Dish/AllDishes.css";
import featuredDishes from "../../data/featuredDishes";
import DishCard from "../../components/Dish/DishCard";

const AllDishes = () => {
  return (
    <div className="all-dishes-page full-width">
      <div className="section-header center">
        <h2 className="section-title">Tất Cả Món Ăn</h2>
        <p className="section-sub">
          Khám phá hàng loạt món ăn ngon hấp dẫn mỗi ngày
        </p>
      </div>

      <div className="dishes-grid">
        {featuredDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default AllDishes;
