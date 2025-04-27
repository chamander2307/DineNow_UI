import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../../assets/img/DineNow_2.svg";
import { UserContext } from "../../contexts/UserContext";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import "../../assets/styles/home/Navbar.css";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef();
  const userRef = useRef();
  const navigate = useNavigate();

  const { isLogin, user, logout, loading } = useContext(UserContext);
  const userName = user?.fullName || user?.email || "Người dùng";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="container header-left">
          <Link to="/" className="logo">
            <img src={LogoIcon} alt="Logo" className="logo-img" />
            <span className="logo-text">DineNow</span>
          </Link>

          <nav className="nav-combined" ref={dropdownRef}>
            <Link to="/nearby" className="nav-item">Gần Bạn</Link>
            <Link to="/restaurant-list" className="nav-item">Các Nhà Hàng</Link>
            <span
              className="nav-item dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Ăn Uống ▾
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/food-category/mon-nuoc">Món Nước</Link>
                <Link to="/food-category/mon-kho">Món Khô</Link>
                <Link to="/food-category/mon-hap-luoc">Món Hấp - Luộc</Link>
                <Link to="/food-category/mon-chien-nuong">Món Chiên - Nướng</Link>
                <Link to="/food-category/mon-kho-to">Món Kho</Link>
                <Link to="/food-category/mon-goi-nom">Món Gỏi - Nộm</Link>
                <Link to="/food-category/mon-chay">Món Chay</Link>
                <Link to="/food-category/mon-trang-mieng">Món Tráng Miệng</Link>
              </div>
            )}
            {isLogin && (
              <Link to="/favorite-restaurants" className="nav-item">
                <FaHeart style={{ marginRight: 6 }} />
                Yêu Thích
              </Link>
            )}
          </nav>
        </div>

        <div className="account-area">
          <Link to="/reservation-history" className="cart-link">
            <FaShoppingBag style={{ fontSize: "18px", color: "white" }} />
          </Link>

          {loading ? (
            <span style={{ color: "white", marginLeft: 12 }}>Đang tải...</span>
          ) : isLogin ? (
            <div className="user-menu">
              <div
                className="user-info username-hover"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                ref={userRef}
              >
                <span className="username">{userName}</span>
                {showUserDropdown && (
                  <div className="dropdown-menu user-dropdown">
                    <Link to="/profile">Tài Khoản</Link>
                    <Link to="/reservation-history">Đơn Đặt</Link>
                    {user?.role === "ADMIN" && (
                      <Link to="/admin/restaurants">Quản lý Admin</Link>
                    )}
                    {user?.role === "OWNER" && (
                      <Link to="/owner/restaurants">Nhà hàng của tôi</Link>
                    )}
                    <button onClick={handleLogout}>Đăng Xuất</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login">Đăng Nhập</Link>
              <Link to="/register">Đăng Ký</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
