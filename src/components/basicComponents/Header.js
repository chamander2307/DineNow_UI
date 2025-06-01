import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "../../assets/img/DineNow_2.svg";
import { UserContext } from "../../contexts/UserContext";
import { FaHeart, FaShoppingBag, FaTimes } from "react-icons/fa";
import "../../assets/styles/home/Navbar.css";
import RestaurantCart from "../Restaurants/RestaurantCart";
import { fetchMainCategories } from "../../services/menuItemService";
import axios from "axios";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef();
  const userRef = useRef();
  const dialogRef = useRef();
  const navigate = useNavigate();

  const { isLogin, user, logout, loading } = useContext(UserContext);
  const userName = user?.fullName || user?.email || "Người dùng";

  // Kiểm tra xem người dùng có phải là ADMIN hoặc OWNER hay không
  const isAdminOrOwner = isLogin && (user?.role === "ADMIN" || user?.role === "OWNER");

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
      if (isCartDialogOpen && dialogRef.current && !dialogRef.current.contains(e.target)) {
        setIsCartDialogOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartDialogOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCheckoutClose = () => {
    setIsCartDialogOpen(false);
  };

  const handleNearbyClick = async (e) => {
    e.preventDefault();
    console.log("Bắt đầu lấy vị trí người dùng...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Vị trí: lat=${latitude}, lng=${longitude}`);
          try {
            const response = await axios.get(
              `http://localhost:8080/api/restaurants/nearby?lng=${longitude}&lat=${latitude}&radius=10&page=0&size=20`
            );
            console.log("Phản hồi API:", response.data);
            const restaurants = response.data.data || [];
            if (restaurants.length === 0) {
              console.warn("Không tìm thấy nhà hàng gần đây.");
              alert("Không tìm thấy nhà hàng trong khu vực này.");
            }
            navigate("/restaurant-list", { state: { nearbyRestaurants: restaurants } });
          } catch (error) {
            console.error("Lỗi khi gọi API nearby:", error);
            alert("Không thể tải danh sách nhà hàng. Vui lòng thử lại.");
            navigate("/restaurant-list");
          }
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error.message);
          let errorMessage = "Không thể lấy vị trí. Vui lòng cho phép truy cập vị trí.";
          if (error.code === error.PERMISSION_DENIED) {
            errorMessage = "Bạn đã từ chối cấp quyền vị trí. Vui lòng bật vị trí trong cài đặt trình duyệt.";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errorMessage = "Thông tin vị trí không khả dụng.";
          }
          alert(errorMessage);
          navigate("/restaurant-list");
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else {
      console.error("Trình duyệt không hỗ trợ geolocation.");
      alert("Trình duyệt không hỗ trợ định vị. Vui lòng thử trình duyệt khác.");
      navigate("/restaurant-list");
    }
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
            <Link to="/nearby" className="nav-item" onClick={handleNearbyClick}>
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
            {/* Chỉ hiển thị "Nhà hàng yêu thích" nếu không phải ADMIN hoặc OWNER */}
            {!isAdminOrOwner && isLogin && (
              <Link to="/favorite-restaurants" className="nav-item">
                <FaHeart style={{ marginRight: 6 }} />
                Yêu Thích
              </Link>
            )}
          </nav>
        </div>

        <div className="account-area">
          {/* Chỉ hiển thị "Giỏ hàng" nếu không phải ADMIN hoặc OWNER */}
          {!isAdminOrOwner && (
            <div className="cart-container">
              <div
                className="cart-link"
                onClick={() => setIsCartDialogOpen(true)}
              >
                <FaShoppingBag style={{ fontSize: "18px", color: "white" }} />
              </div>
            </div>
          )}

          {isCartDialogOpen && !isAdminOrOwner && (
            <>
              <div className="cart-dialog-overlay" />
              <div className="cart-dialog" ref={dialogRef}>
                <div className="cart-dialog-header">
                  <h3>Giỏ hàng</h3>
                  <button
                    className="cart-dialog-close"
                    onClick={() => setIsCartDialogOpen(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="cart-dialog-content">
                  <RestaurantCart onCheckout={handleCheckoutClose} />
                </div>
              </div>
            </>
          )}

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