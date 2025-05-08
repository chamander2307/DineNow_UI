import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/admin/Sidebar.css";

const OwnerSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2>Chủ Nhà Hàng</h2>
      <ul>
        <li><Link to="/owner/profile">Tổng quan</Link></li>
        <li><Link to="/owner/restaurants">Nhà hàng của tôi</Link></li>
        <li><Link to="/owner/menu-items">Món ăn</Link></li>
        <li><Link to="/owner/reservation">Đơn đặt hàng</Link></li>
        <li><Link to="/owner/review">Đánh giá nhà hàng</Link></li>
        <li><Link to="/">Đánh giá món ăn</Link></li>
        <li><Link to="/owner/revenue-dashboard">Quản lý doanh thu</Link></li>
        <li><Link to="/owner/order">Quản lý đơn đặt</Link></li>
      </ul>
    </div>
  );
};

export default OwnerSidebar;
