import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../assets/styles/home/FeaturedSection.css";

import haisan from "../../assets/img/cac-mon-nuong-1649930235.jpg";
import lau from "../../assets/img/lau-hai-san-da-nang-a9a.jpg";
import buffet from "../../assets/img/studio-chup-anh-thuc-an-dep.jpg";
import han from "../../assets/img/4_Find_Home_Away.jpg";
import nhat from "../../assets/img/hinh-anh-cac-mon-an-ngon-nhan-lam-theo-yeu-cau-rieng.jpg";

const highlightImages = [
  { id: 1, image: haisan, alt: "Hải sản tươi ngon" },
  { id: 2, image: lau, alt: "Lẩu thơm nức mũi" },
  { id: 3, image: buffet, alt: "Buffet đa dạng" },
  { id: 4, image: han, alt: "Ẩm thực Hàn Quốc" },
  { id: 5, image: nhat, alt: "Sushi chuẩn Nhật" },
];

const HighlightSlider = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <div className="highlight-slider-wrapper">
      <Slider {...sliderSettings} className="highlight-slider">
        {highlightImages.map((item) => (
          <div key={item.id} className="highlight-slide">
            <img src={item.image} alt={item.alt} className="highlight-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HighlightSlider;
