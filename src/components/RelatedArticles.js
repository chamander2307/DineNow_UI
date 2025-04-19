import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../assets/styles/RelatedArticles.css";

import article1 from "../assets/img/lau.png";
import article2 from "../assets/img/nhat.png";
import article3 from "../assets/img/chay.png";

const RelatedArticles = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    centerMode: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const articles = [
    {
      id: 1,
      title: "Top nhà hàng Nhật Bản chính gốc",
      description:
        "Khám phá hương vị Nhật truyền thống tại các nhà hàng được đánh giá cao nhất.",
      image: article1,
      link: "/article/1",
    },
    {
      id: 2,
      title: "Buffet cuối tuần giá tốt",
      description:
        "Tổng hợp các địa điểm buffet sang chảnh mà giá vẫn hợp túi tiền.",
      image: article2,
      link: "/article/2",
    },
    {
      id: 3,
      title: "Lẩu nướng phong cách Hàn",
      description:
        "Địa điểm lý tưởng để thưởng thức lẩu nướng chuẩn vị Hàn Quốc tại TP.HCM.",
      image: article3,
      link: "/article/3",
    },
  ];

  return (
    <div className="related-articles">
      <h2 className="section-title">Tin Tức Mới Nhất</h2>
      <p className="section-sub">Cập nhật thông tin mới nhất về ẩm thực</p>
      <Slider {...settings}>
        {articles.map((article) => (
          <div className="slider-item" key={article.id}>
            <div className="article-card">
              <img
                src={article.image}
                alt={article.title}
                className="article-image"
              />
              <div className="article-content">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <a href={article.link} className="read-more">
                  Xem thêm →
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedArticles;
