import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/admin/Sidebar.css";

const OwnerSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2>Chủ Nhà Hàng</h2>
      <ul>
        <li><Link to="/owner/restaurants">Nhà hàng của tôi</Link></li>
        <li><Link to="/owner/menu-items">Món ăn</Link></li>
      </ul>
    </div>
  );
};

export default OwnerSidebar;
