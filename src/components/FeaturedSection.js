import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/styles/FeaturedSection.css";

import restaurant1 from "../assets/img/restaurant1.jpg";
import restaurant2 from "../assets/img/restaurant2.jpg";
import restaurant3 from "../assets/img/restaurant3.jpg";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const FeaturedSection = () => {
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 700,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
  const formatNumber = (num) => {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'k';
    return num.toString();
  };
  
  // ⭐ Render icon sao như PasGo
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} color="#f4c150" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#f4c150" />);
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} color="#ccc" />);
    }

    return <div className="star-icons">{stars}</div>;
  };

  const highlightImages = [
    {
      id: 1,
      image: require("../assets/img/haisan.png"),
      alt: "Hải sản tươi ngon",
    },
    { id: 2, image: require("../assets/img/lau.png"), alt: "Lẩu thơm nức mũi" },
    {
      id: 3,
      image: require("../assets/img/buffet.png"),
      alt: "Buffet đa dạng",
    },
    { id: 4, image: require("../assets/img/han.png"), alt: "Ẩm thực Hàn Quốc" },
    {
      id: 5,
      image: require("../assets/img/nhat.png"),
      alt: "Sushi chuẩn Nhật",
    },
  ];

  const featuredDishes = [
    {
      id: 1,
      name: "Cơm Thố Heo Giòn Teriyaki",
      price: 99000,
      image: restaurant1,
    },
    {
      id: 2,
      name: "Cơm Thố Gà Nướng BBQ Hàn",
      price: 52999,
      image: restaurant2,
    },
    {
      id: 3,
      name: "Cơm Thố Gà Nướng + Ớp La",
      price: 60999,
      image: restaurant3,
    },
    {
      id: 4,
      name: "Bún Bò Huế Cay Đặc Biệt",
      price: 69999,
      image: restaurant1,
    },
    { id: 5, name: "Hủ Tiếu Nam Vang", price: 45999, image: restaurant2 },
    { id: 6, name: "Phở Gà Tái Trứng", price: 49999, image: restaurant3 },
  ];

  const featuredRestaurants = [
    {
      id: 1,
      name: "Lẩu Nướng Hàn Quốc",
      rating: 4.5,
      visits: 1250,
      image: restaurant1,
    },
    {
      id: 2,
      name: "Nhà hàng Việt hiện đại",
      rating: 4.0,
      visits: 17455,
      image: restaurant2,
    },
    {
      id: 3,
      name: "Ẩm thực chay An Lạc",
      rating: 2.0,
      visits: 8909,
      image: restaurant3,
    },
    {
      id: 4,
      name: "Pizza & Pasta Ý",
      rating: 3.5,
      visits: 1120,
      image: restaurant2,
    },
    {
      id: 5,
      name: "Nhà hàng Nhật Sushi Go",
      rating: 3.0,
      visits: 146,
      image: restaurant1,
    },
    {
      id: 6,
      name: "Món Hoa Đại Phát",
      rating: 5.0,
      visits: 300,
      image: restaurant3,
    },
  ];

  return (
    <div className="featured-section-pg">
      {/* Slider món ăn nổi bật */}
      <div className="section-header highlight-header">
        <h2 className="section-title">Món Ăn Nổi Bật</h2>
      </div>
      <div className="highlight-slider-wrapper">
        <Slider
          dots={true}
          infinite={true}
          speed={700}
          slidesToShow={1}
          slidesToScroll={1}
          arrows={true}
          autoplay={true}
          autoplaySpeed={4000}
          className="highlight-slider"
        >
          {highlightImages.map((item) => (
            <div key={item.id} className="highlight-slide">
              <img
                src={item.image}
                alt={item.alt}
                className="highlight-image"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Món ăn */}
      <div className="section-header">
        <h2 className="section-title">Món Ăn Hot</h2>
        <p className="section-sub">
          Khám phá những món ăn đang được yêu thích nhất
        </p>
      </div>
      <Slider {...sliderSettings} className="horizontal-slider">
        {featuredDishes.map((dish) => (
          <div key={dish.id} className="slider-item">
            <div className="dish-item">
              <img src={dish.image} alt={dish.name} className="dish-image" />
              <div className="dish-details">
                <h3>{dish.name}</h3>
                <p className="price">{dish.price.toLocaleString()}đ</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Nhà hàng */}
      <div className="section-header">
        <h2 className="section-title">Top Nhà Hàng Hot</h2>
        <p className="section-sub">
          Khám phá những Nhà hàng đang có ưu đãi hấp dẫn ngay
        </p>
      </div>
      <Slider {...sliderSettings} className="horizontal-slider">
        {featuredRestaurants.map((res) => (
          <div key={res.id} className="slider-item">
            <div className="restaurant-item">
              <img
                src={res.image}
                alt={res.name}
                className="restaurant-image"
              />
              <div className="restaurant-details">
                <h3>{res.name}</h3>
                <div className="restaurant-meta">
                  {renderStars(res.rating)}
                  <span className="visit-count">{formatNumber(res.visits)} lượt đến</span>

                </div>
              </div>
            </div>
            
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FeaturedSection;
