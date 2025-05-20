import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../../assets/img/DineNow_2.svg";
import { UserContext } from "../../contexts/UserContext";
import { FaHeart, FaShoppingBag } from "react-icons/fa";
import "../../assets/styles/home/Navbar.css";
import RestaurantCart from "../Restaurants/RestaurantCart";
import { fetchMainCategories } from "../../services/menuItemService";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const cartRef = useRef();
  const dropdownRef = useRef();
  const userRef = useRef();
  const navigate = useNavigate();

  const { isLogin, user, logout, loading } = useContext(UserContext);
  const userName = user?.fullName || user?.email || "Người dùng";

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchMainCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh mục món ăn:", error);
      }
    };
    loadCategories();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (cartRef.current && !cartRef.current.contains(e.target)) {
        setShowCartDropdown(false);
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
            <Link to="/nearby" className="nav-item">
              Gần Bạn
            </Link>
            <Link to="/restaurant-list" className="nav-item">
              Các Nhà Hàng
            </Link>
            <span
              className="nav-item dropdown-toggle"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Ăn Uống ▾
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/all-dishes">Tất cả món ăn</Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/all-dishes?mainCategoryId=${category.id}`}
                  >
                    {category.name}
                  </Link>
                ))}
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
          <div className="cart-container" ref={cartRef}>
            <div
              className="cart-link"
              onClick={() => setShowCartDropdown(!showCartDropdown)}
            >
              <FaShoppingBag style={{ fontSize: "18px", color: "white" }} />
            </div>

            {showCartDropdown && (
              <div className="cart-dropdown">
                <RestaurantCart restaurants={[]} />
              </div>
            )}
          </div>

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
                    {user?.role === "CUSTOMER" && (
                      <Link to="/reservation-history">Lịch Sử Đặt Bàn</Link>
                    )}
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