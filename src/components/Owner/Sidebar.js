import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/styles/admin/Sidebar.css";

const OwnerSidebar = () => {
  return (
    <div className="sidebar">
      <h2>Chủ Nhà Hàng</h2>
      <ul>
        <li>
          <NavLink
            to="/owner/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Tổng quan
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/owner/food-category"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Danh mục món ăn
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/owner/restaurants"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Nhà hàng của tôi
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/owner/menu-items"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Món ăn
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/owner/reservation"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Đặt bàn
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/owner/review"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Đánh giá nhà hàng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/owner/menu-item-review"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Đánh giá món ăn
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/owner/revenue-dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quản lý doanh thu
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/owner/order"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quản lý đơn hàng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/owner/bank-account"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Tài khoản ngân hàng
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default OwnerSidebar;