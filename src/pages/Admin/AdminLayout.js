import React from 'react';
import Sidebar from '../../components/admin/Sidebar';
import '../../assets/styles/admin/AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
      <Sidebar />
      </div>
      <main className="admin-content">{children}</main>
    </div>
  );
};

export default AdminLayout;
