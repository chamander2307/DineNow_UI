import React from "react";
import "../../assets/styles/FeaturedSection.css";
import featuredDishes from "../../data/featuredDishes";
import DishCard from "../../components/DishCard"; // ✅ import component

const AllDishes = () => {
  return (
    <div className="featured-section-pg">
      <div className="section-header">
        <h2 className="section-title">Tất Cả Món Ăn</h2>
        <p className="section-sub">Khám phá hàng loạt món ăn ngon hấp dẫn</p>
      </div>
      <div className="dish-grid">
        {featuredDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};

export default AllDishes;
