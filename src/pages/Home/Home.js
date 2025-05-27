import React, { useState, useEffect, useRef } from "react";
import "../../assets/styles/home/Home.css";
import LocationSearchBar from "../../components/basicComponents/LocationSearchBar";
import FilterBar from "../../components/basicComponents/FilterBar";
import FoodCategoryList from "../../components/basicComponents/FoodCategoryList";
import HighlightSlider from "../../components/basicComponents/HighlightSlider";
import DishCard from "../../components/Dish/DishCard";
import RestaurantCard from "../../components/Restaurants/RestaurantCard";
import RelatedArticles from "../../components/RelatedArticles";
import { fetchListOfFeaturedRestaurants } from "../../services/restaurantService";
import { fetchFeaturedMenuItems } from "../../services/menuItemService";

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const dishContainerRef = useRef(null);
  const restaurantContainerRef = useRef(null);

  useEffect(() => {
    const loadFeaturedRestaurants = async () => {
      try {
        const response = await fetchListOfFeaturedRestaurants();
        setFeaturedRestaurants(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy nhà hàng nổi bật:", error);
      }
    };

    const loadFeaturedDishes = async () => {
      try {
        const response = await fetchFeaturedMenuItems();
        setFeaturedDishes(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy món ăn nổi bật:", error);
      }
    };

    const loadData = async () => {
      await Promise.all([loadFeaturedRestaurants(), loadFeaturedDishes()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const scrollDishNext = () => {
    if (dishContainerRef.current) {
      dishContainerRef.current.scrollBy({ left: 330 + 16, behavior: "smooth" });
    }
  };

  const scrollDishPrev = () => {
    if (dishContainerRef.current) {
      dishContainerRef.current.scrollBy({ left: -(330 + 16), behavior: "smooth" });
    }
  };

  const scrollRestaurantNext = () => {
    if (restaurantContainerRef.current) {
      restaurantContainerRef.current.scrollBy({ left: 330 + 16, behavior: "smooth" });
    }
  };

  const scrollRestaurantPrev = () => {
    if (restaurantContainerRef.current) {
      restaurantContainerRef.current.scrollBy({ left: -(330 + 16), behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      <LocationSearchBar />
      <FilterBar />
      <FoodCategoryList />
      <HighlightSlider />

      <section className="home-section">
        <div className="home-section-header center">
          <h2 className="home-section-title">Món Ăn Nổi Bật</h2>
          <p className="home-section-sub">
            Khám phá hàng loạt món ăn ngon hấp dẫn mỗi ngày
          </p>
        </div>
        {loading ? (
          <p>Đang tải món ăn nổi bật...</p>
        ) : (
          <div className="home-card-section">
            <button className="home-scroll-button prev" onClick={scrollDishPrev}>
              ❮
            </button>
            <div className="home-card-container" ref={dishContainerRef}>
              {featuredDishes.slice(0, 15).map((dish) => (
                dish.restaurantId ? (
                  <div key={dish.id} className="home-card-item">
                    <DishCard dish={dish} restaurantId={dish.restaurantId} />
                  </div>
                ) : null
              ))}
            </div>
            <button className="home-scroll-button next" onClick={scrollDishNext}>
              ❯
            </button>
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="home-section-header center">
          <h2 className="home-section-title">Nhà Hàng Nổi Bật</h2>
          <p className="home-section-sub">Khám phá những nhà hàng nổi bật nhất</p>
        </div>
        {loading ? (
          <p>Đang tải nhà hàng nổi bật...</p>
        ) : (
          <div className="home-card-section">
            <button className="home-scroll-button prev" onClick={scrollRestaurantPrev}>
              ❮
            </button>
            <div className="home-card-container" ref={restaurantContainerRef}>
              {featuredRestaurants.slice(0, 15).map((restaurant) => (
                <div key={restaurant.id} className="home-card-item">
                  <RestaurantCard
                    id={restaurant.id}
                    thumbnailUrl={restaurant.thumbnailUrl || "https://via.placeholder.com/330x200"}
                    name={restaurant.name}
                    averageRating={restaurant.averageRating}
                    address={restaurant.address}
                    reservationCount={restaurant.reservationCount || 0}
                  />
                </div>
              ))}
            </div>
            <button className="home-scroll-button next" onClick={scrollRestaurantNext}>
              ❯
            </button>
          </div>
        )}
      </section>

      <section className="home-section">
        <RelatedArticles />
      </section>
    </div>
  );
};

export default Home;