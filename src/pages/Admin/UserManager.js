import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  fetchAllUsers,
  createOwner,
} from "../../services/adminService";
import UserFormModal from "../../components/common/UserFormModal";
import UserDetailModal from "../../components/common/UserDetailModal";
import "../../assets/styles/admin/UserManager.css";

const ROLE_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "OWNER", label: "Chủ nhà hàng" },
  { value: "CUSTOMER", label: "Khách hàng" },
];

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchAllUsers();
      const list = Array.isArray(res) ? res : [];
      setUsers(list);
    } catch {
      console.error("Không thể tải danh sách người dùng");
    }
  };

  const filteredUsers = roleFilter
    ? users.filter((u) => u.role === roleFilter)
    : users;

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleCreateOwner = async (data) => {
    try {
      await createOwner(data);
      loadUsers();
      setShowFormModal(false);
    } catch {
      console.error("Tạo owner thất bại");
    }
  };

  return (
    <AdminLayout>
      <div className="user-manager">
        <h2>Quản lý người dùng</h2>

        <div className="filter-group">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button onClick={() => setShowFormModal(true)}>+ Thêm chủ nhà hàng</button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Vai trò</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone || "—"}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => openDetailModal(user)}>Chi tiết</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showFormModal && (
          <UserFormModal
            onClose={() => setShowFormModal(false)}
            onSuccess={handleCreateOwner}
          />
        )}

        {showDetailModal && selectedUser && (
          <UserDetailModal
            user={selectedUser}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManager;
