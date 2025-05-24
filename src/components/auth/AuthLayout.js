// src/components/AuthLayout.js
import React from "react";
import "../../assets/styles/home/Login.css"; // Dùng chung CSS login layout
import Logo from "../basicComponents/Logo"; // Import Logo component

const AuthLayout = ({ children, title, image }) => {
  return (
    <div className="auth auth--split">
      <div className="auth__left">
        <div
          className="auth__bg"
          style={{
            backgroundImage: `url(${
              image ||
              "https://ymyceramic.com.vn/wp-content/uploads/2023/09/N85026RC_PC.jpg"
            })`,
          }}
        ></div>
      </div>
      <div className="auth__right">
        <div className="auth__form-box">
          <div className="auth__logo-wrapper">
            <Logo />
          </div>
          {title && <h2 className="auth__title">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
