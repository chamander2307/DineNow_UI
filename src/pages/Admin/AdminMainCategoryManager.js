import React, { useEffect, useState } from "react";
import {
  createMainCategory,
  updateMainCategory,
  deleteMainCategory,
} from "../../services/adminService";
import { fetchMainCategories } from "../../services/menuItemService";
import AdminLayout from "./AdminLayout";
import MainCategoryFormModal from "../../components/admin/MainCategoryFormModal";
import "../../assets/styles/admin/AdminMainCategoryManager.css";
const AdminMainCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetchMainCategories();
      setCategories(Array.isArray(res) ? res : []);
    } catch {
      setMessage("Không thể tải danh mục");
    }
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xoá?")) {
      try {
        await deleteMainCategory(id);
        loadCategories();
      } catch {
        setMessage("Xoá thất bại");
      }
    }
  };

  const handleModalSubmit = async (formData, id) => {
    try {
      if (id) {
        await updateMainCategory(id, formData);
        setMessage("Cập nhật thành công");
      } else {
        await createMainCategory(formData);
        setMessage("Tạo mới thành công");
      }
      setShowModal(false);
      loadCategories();
    } catch {
      setMessage("Thao tác thất bại");
    }
  };

  return (
    <AdminLayout>
      <div className="main-category-manager">
        <h2>Quản lý danh mục chính</h2>
        <button className="create-button" onClick={openCreateModal}>+ Tạo mới</button>

        {message && <p className="message">{message}</p>}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Tên danh mục</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>
                  <button onClick={() => openEditModal(c)}>Sửa</button>
                  <button onClick={() => handleDelete(c.id)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <MainCategoryFormModal
            onClose={() => setShowModal(false)}
            onSuccess={handleModalSubmit}
            initialData={editingCategory}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMainCategoryManager;
