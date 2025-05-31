// src/components/basicComponents/BookingGuide.js
import React from "react";
import "../../assets/styles/home/BookingGuide.css";
import guideImage from "../../assets/img/huong-dan-dat-ban-desktop.png";

const BookingGuide = () => {
  return (
    <section className="booking-guide">
      <h2 className="guide-title">Hướng dẫn đặt bàn nhanh</h2>
      <div className="guide-image-wrapper">
        <img src={guideImage} alt="Hướng dẫn đặt bàn" className="guide-image" />
      </div>
    </section>
  );
};

export default BookingGuide;
