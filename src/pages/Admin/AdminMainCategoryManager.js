import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import "../../assets/styles/admin/AdminMainCategoryManager.css";

const AdminMainCategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadMockCategories();
  }, []);

  const loadMockCategories = () => {
    const mockData = [
      { id: 1, name: "Khai vị", description: "Món khai vị hấp dẫn" },
      { id: 2, name: "Món chính", description: "Món ăn chính trong bữa ăn" },
      { id: 3, name: "Tráng miệng", description: "Món ngọt sau bữa ăn" },
    ];
    setCategories(mockData);
  };

  const handleCreate = () => {
    if (!newCategory.name.trim()) {
      alert("Tên loại không được để trống");
      return;
    }
    const newItem = {
      id: categories.length + 1,
      name: newCategory.name,
      description: newCategory.description,
    };
    setCategories([...categories, newItem]);
    setNewCategory({ name: "", description: "" });
  };

  const handleUpdate = () => {
    if (!editingCategory.name.trim()) {
      alert("Tên loại không được để trống");
      return;
    }
    setCategories(categories.map(cat => cat.id === editingCategory.id ? editingCategory : cat));
    setEditingCategory(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá loại món ăn này?")) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  return (
    <AdminLayout>
      <div className="manager-header">
        <h2>Quản lý Loại Món ăn Chính (Main Category)</h2>
      </div>

      <div className="add-category">
        <input
          type="text"
          placeholder="Tên loại món ăn"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mô tả (tuỳ chọn)"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
        />
        <button onClick={handleCreate}>Thêm loại</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>
                {editingCategory?.id === cat.id ? (
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editingCategory?.id === cat.id ? (
                  <input
                    type="text"
                    value={editingCategory.description}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  />
                ) : (
                  cat.description
                )}
              </td>
              <td>
                {editingCategory?.id === cat.id ? (
                  <>
                    <button onClick={handleUpdate}>Lưu</button>
                    <button onClick={() => setEditingCategory(null)}>Huỷ</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingCategory(cat)}>Sửa</button>
                    <button onClick={() => handleDelete(cat.id)}>Xoá</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default AdminMainCategoryManager;
