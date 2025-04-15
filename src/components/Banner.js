import React from 'react';
import '../assets/styles/Banner.css';
import bannerImage from '../assets/img/banner.jpg';

const Banner = () => {
  return (
    <section className="banner">
      <img src={bannerImage} alt="Banner" />
      <div className="banner-text">
        <h2>Khám phá những nhà hàng tốt nhất!</h2>
        <p>Trải nghiệm ẩm thực tuyệt vời cùng gia đình và bạn bè.</p>
      </div>
    </section>
  );
};

export default Banner;