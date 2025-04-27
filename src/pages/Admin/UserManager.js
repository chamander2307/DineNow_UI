import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { fetchAllUsers } from "../../services/adminService";
import "../../assets/styles/admin/AdminUserManager.css";

const UserManager = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      alert("Không thể tải danh sách người dùng");
    }
  };

  return (
    <AdminLayout>
      <div className="manager-header">
        <h2>Quản lý Người dùng</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.enabled ? "✅ Kích hoạt" : "❌ Khoá"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default UserManager;
