import React from "react";
import OwnerSidebar from "../../components/Owner/Sidebar";
import "../../assets/styles/admin/AdminLayout.css"; // Dùng chung CSS layout

const OwnerLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <OwnerSidebar />
      </div>
      <div className="admin-content">{children}</div>
    </div>
  );
};

export default OwnerLayout;