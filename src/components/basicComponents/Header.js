import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../../assets/img/DineNow_2.svg";
import { UserContext } from "../../contexts/UserContext";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import "../../assets/styles/Navbar.css";

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

  if (loading) return null;

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
                <Link to="/all-dishes">Tất cả món ăn</Link>
                <Link to="/food/pho">Phở</Link>
                <Link to="/food/bun-bo-hue">Bún bò Huế</Link>
                <Link to="/food/hu-tieu">Hủ tiếu</Link>
                <Link to="/food/com-tam">Cơm tấm</Link>
                <Link to="/food/lau">Lẩu</Link>
                <Link to="/food/ga-ran">Gà rán</Link>
                <Link to="/food/pizza">Pizza</Link>
                <Link to="/food/banh-canh">Bánh canh</Link>
                <Link to="/food/mi-quang">Mì Quảng</Link>
                <Link to="/food/sushi">Sushi</Link>
                <Link to="/food/banh-xeo">Bánh xèo</Link>
                <Link to="/food/goi-cuon">Gỏi cuốn</Link>
                <Link to="/food/tra-sua">Trà sữa</Link>
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

          {isLogin ? (
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
