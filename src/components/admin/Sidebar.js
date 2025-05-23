import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/styles/admin/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Tổng quan
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quản lý người dùng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/restaurants"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quản lý nhà hàng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/restaurant-types"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Loại nhà hàng
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/main-category"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Danh mục món ăn
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Quản lí đơn đặt
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/settlement"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Đối soát và thanh toán{" "}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/revenue-dashboard"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Thống kê doanh thu
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/profit"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Thống kê lợi nhuận
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
