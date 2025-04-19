import React from "react";
import Slider from "react-slick";
import "../../assets/styles/Home.css";
import LocationSearchBar from "../../components/basicComponents/LocationSearchBar";
import FilterBar from "../../components/basicComponents/FilterBar";
import FoodCategoryList from "../../components/basicComponents/FoodCategoryList";
import HighlightSlider from "../../components/basicComponents/HighlightSlider";
import DishCard from "../../components/Dish/DishCard";
import featuredDishes from "../../data/featuredDishes";
import RestaurantCard from "../../components/Restaurants/RestaurantCard";
import featuredRestaurants from "../../data/featuredRestaurants";
import RelatedArticles from "../../components/RelatedArticles";

const Home = () => {
  // 👉 Đây là settings dùng width cố định 300px / card
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 700,
    arrows: true,
    slidesToScroll: 1,
    variableWidth: true, // 🔥 BẮT BUỘC khi dùng thẻ 300px
  };

  return (
    <div className="home-page">
      {/* Tìm kiếm và bộ lọc */}
      <LocationSearchBar />
      <FilterBar />
      <FoodCategoryList />

      {/* Slider đầu trang */}
      <HighlightSlider />

      {/* Món ăn nổi bật */}
      <section className="section">
        <div className="section-header center">
          <h2 className="section-title">Món Ăn Nổi Bật</h2>
          <p className="section-sub">
            Khám phá hàng loạt món ăn ngon hấp dẫn mỗi ngày
          </p>
        </div>
        <Slider {...sliderSettings} className="horizontal-slider">
          {featuredDishes.map((dish) => (
            <div key={dish.id} className="slider-card-item">
              <DishCard dish={dish} />
            </div>
          ))}
        </Slider>
      </section>

      {/* Nhà hàng nổi bật */}
      <section className="section">
        <div className="section-header center">
          <h2 className="section-title">Nhà Hàng Nổi Bật</h2>
          <p className="section-sub">Khám phá những nhà hàng nổi bật nhất</p>
        </div>
        <Slider {...sliderSettings} className="horizontal-slider">
          {featuredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="slider-card-item">
              <RestaurantCard {...restaurant} />
            </div>
          ))}
        </Slider>
      </section>

      {/* Bài viết */}
      <section className="section">
        <RelatedArticles />
      </section>
    </div>
  );
};

export default Home;
