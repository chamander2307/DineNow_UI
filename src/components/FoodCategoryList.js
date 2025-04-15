import React from "react";
import "../assets/styles/FilterBar.css"; // dùng chung CSS
import buffet from "../assets/images/buffet.png";
import lau from "../assets/images/lau.png";
import nuong from "../assets/images/nuong.png";
import haisan from "../assets/images/haisan.png";
import quannhau from "../assets/images/quannhau.png";
import nhat from "../assets/images/nhat.png";
import viet from "../assets/images/viet.png";
import han from "../assets/images/han.png";
import chay from "../assets/images/chay.png";

const foodTypes = [
  { icon: buffet, label: "Buffet" },
  { icon: lau, label: "Lẩu" },
  { icon: nuong, label: "Nướng" },
  { icon: haisan, label: "Hải sản" },
  { icon: quannhau, label: "Quán nhậu" },
  { icon: nhat, label: "Món Nhật" },
  { icon: viet, label: "Món Việt" },
  { icon: han, label: "Món Hàn" },
  { icon: chay, label: "Món chay" },
];

const FoodCategoryList = () => {
  return (
    <div className="food-category-list">
      {foodTypes.map((type, index) => (
        <div className="food-category-item" key={index}>
          <img className="circle-img" src={type.icon} alt={type.label} />
          <span>{type.label}</span>
        </div>
      ))}
    </div>
  );
};

export default FoodCategoryList;