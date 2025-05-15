import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "../../assets/styles/home/Home.css";
import LocationSearchBar from "../../components/basicComponents/LocationSearchBar";
import FilterBar from "../../components/basicComponents/FilterBar";
import FoodCategoryList from "../../components/basicComponents/FoodCategoryList";
import HighlightSlider from "../../components/basicComponents/HighlightSlider";
import DishCard from "../../components/Dish/DishCard";
import featuredDishes from "../../data/featuredDishes"; // Tạm giữ tĩnh
import RestaurantCard from "../../components/Restaurants/RestaurantCard";
import RelatedArticles from "../../components/RelatedArticles";
import { fetchListOfFeaturedRestaurants } from "../../services/restaurantService";

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách nhà hàng nổi bật từ API
  useEffect(() => {
    const loadFeaturedRestaurants = async () => {
      try {
        const response = await fetchListOfFeaturedRestaurants();
        setFeaturedRestaurants(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy nhà hàng nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedRestaurants();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 700,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="home-page">
      <LocationSearchBar />
      <FilterBar />
      <FoodCategoryList />
      <HighlightSlider />

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

      <section className="section">
        <div className="section-header center">
          <h2 className="section-title">Nhà Hàng Nổi Bật</h2>
          <p className="section-sub">Khám phá những nhà hàng nổi bật nhất</p>
        </div>
        {loading ? (
          <p>Đang tải nhà hàng nổi bật...</p>
        ) : (
          <Slider {...sliderSettings} className="horizontal-slider">
            {featuredRestaurants.map((restaurant) => (
              <div key={restaurant.id} className="slider-card-item">
                <RestaurantCard
                  id={restaurant.id}
                  thumbnailUrl={restaurant.thumbnailUrl}
                  name={restaurant.name}
                  averageRating={restaurant.averageRating}
                  address={restaurant.address}
                  visits={restaurant.visits || 0}
                />
              </div>
            ))}
          </Slider>
        )}
      </section>

      <section className="section">
        <RelatedArticles />
      </section>
    </div>
  );
};

export default Home;