import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/admin/Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="admin-sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/restaurants">Quản lý Nhà hàng</Link></li>
        <li><Link to="/admin/restaurant-types">Quản lý Loại Nhà hàng</Link></li>
        <li><Link to="/admin/users">Quản lý Người dùng</Link></li>
        {/* Có thể thêm sau nếu có quản lý món ăn riêng */}
        {/* <li><Link to="/admin/menus">Quản lý Món ăn</Link></li> */}
      </ul>
    </aside>
  );
};

export default Sidebar;
