import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; // Import CSS của slick
import 'slick-carousel/slick/slick-theme.css'; // Import theme CSS của slick
import '../assets/styles/RelatedArticles.css'; // Import CSS tùy chỉnh

import default1 from '../assets/images/default.jpg';
const RelatedArticles = () => {
  // Dữ liệu giả lập cho các bài viết liên quan
  const articles = [
    {
      id: 1,
      title: 'Top 5 nhà hàng lẩu ngon nhất TP. HCM',
      description: 'Khám phá những nhà hàng lẩu nổi tiếng với hương vị đậm đà, không gian ấm cúng tại TP. HCM.',
      image: default1,
    },
    {
      id: 2,
      title: 'Buffet hải sản – Trải nghiệm ẩm thực đẳng cấp',
      description: 'Thưởng thức hải sản tươi sống với giá cả hợp lý tại các nhà hàng buffet hàng đầu.',
      image: default1,
    },
    {
      id: 3,
      title: 'Ẩm thực Nhật Bản – Sushi và hơn thế nữa',
      description: 'Đến với thế giới ẩm thực Nhật Bản qua những món sushi tươi ngon và sashimi chuẩn vị.',
      image: default1,
    },
    {
      id: 4,
      title: 'Nhà hàng gia đình – Không gian ấm cúng',
      description: 'Lựa chọn hoàn hảo cho bữa ăn gia đình với thực đơn đa dạng và không gian thân thiện.',
      image: default1,
    },
  ];

  // Cấu hình cho slider
  const settings = {
    dots: true, // Hiển thị các chấm điều hướng
    infinite: true, // Vòng lặp vô hạn
    speed: 500, // Tốc độ chuyển slide (ms)
    slidesToShow: 3, // Số bài viết hiển thị cùng lúc
    slidesToScroll: 1, // Số bài viết cuộn mỗi lần
    autoplay: true, // Tự động chạy
    autoplaySpeed: 3000, // Thời gian giữa các lần chạy (ms)
    arrows: true, // Bật nút điều hướng (mũi tên trái/phải)
    responsive: [
      {
        breakpoint: 1024, // Dưới 1024px
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // Dưới 600px
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="related-articles">
      <h2>Bài viết liên quan</h2>
      <Slider {...settings}>
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <img src={article.image} alt={article.title} className="article-image" />
            <div className="article-content">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href="#" className="read-more">
                Đọc thêm
              </a>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RelatedArticles;