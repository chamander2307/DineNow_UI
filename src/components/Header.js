import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/Navbar.css";
import LogoIcon from "../assets/img/DineNow_2.svg";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef();
  const userRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("userName");
    if (token && name) {
      setIsLogin(true);
      setUserName(name);
    }
  }, []);

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    setIsLogin(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-inner">
        <div className="container header-left">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src={LogoIcon} alt="Logo" className="logo-img" />
            <span className="logo-text">DineNow</span>
          </Link>

          {/* Menu */}
          <nav className="nav-combined" ref={dropdownRef}>
            <Link to="/nearby" className="nav-item">
              Gần Bạn
            </Link>
            <span
              className="nav-item dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Ăn Uống ▾
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/category/nha-hang">Nhà hàng</Link>
                <Link to="/category/cafe">Café</Link>
                <Link to="/category/quan-an">Quán ăn</Link>
                <Link to="/category/buffet">Buffet</Link>
              </div>
            )}
          </nav>
        </div>

        {/* Khu vực bên phải - Đăng nhập/đăng ký hoặc Tài khoản */}
        <div className="account-area" ref={userRef}>
          {isLogin ? (
            <div className="user-menu">
              <div
                className="user-info"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <img
                  src="https://i.pravatar.cc/150?img=13"
                  alt="avatar"
                  className="avatar"
                />
                <span className="username">{userName}</span>
              </div>
              {showUserDropdown && (
                <div className="dropdown-menu right">
                  <Link to="/profile">Tài Khoản</Link>
                  <Link to="/orders">Đơn Đặt</Link>
                  <button onClick={handleLogout}>Đăng Xuất</button>
                </div>
              )}
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
