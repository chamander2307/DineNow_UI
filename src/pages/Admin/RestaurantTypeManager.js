import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  fetchRestaurantTypes,
  createRestaurantType,
  updateRestaurantType,
  deleteRestaurantType,
} from "../../services/adminService";
import "../../assets/styles/admin/AdminRestaurantTypeManager.css";

const RestaurantTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState({ name: "", description: "" });
  const [editingType, setEditingType] = useState(null);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const data = await fetchRestaurantTypes();
      setTypes(data);
    } catch (err) {
      alert("Không thể tải loại nhà hàng");
    }
  };

  const handleCreate = async () => {
    if (!newType.name.trim()) {
      alert("Tên loại không được để trống");
      return;
    }
    const formData = new FormData();
    formData.append("name", newType.name);
    formData.append("description", newType.description || "");
    try {
      await createRestaurantType(formData);
      setNewType({ name: "", description: "" });
      loadTypes();
    } catch (err) {
      alert("Tạo loại nhà hàng thất bại");
    }
  };

  const handleUpdate = async () => {
    if (!editingType.name.trim()) {
      alert("Tên loại không được để trống");
      return;
    }
    const formData = new FormData();
    formData.append("name", editingType.name);
    formData.append("description", editingType.description || "");
    try {
      await updateRestaurantType(editingType.id, formData);
      setEditingType(null);
      loadTypes();
    } catch (err) {
      alert("Cập nhật loại nhà hàng thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá loại nhà hàng này?")) {
      await deleteRestaurantType(id);
      loadTypes();
    }
  };

  return (
    <AdminLayout>
      <div className="manager-header">
        <h2>Quản lý Loại Nhà hàng</h2>
      </div>

      {/* Thêm mới */}
      <div className="add-type">
        <input
          type="text"
          placeholder="Tên loại nhà hàng"
          value={newType.name}
          onChange={(e) => setNewType({ ...newType, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mô tả (tuỳ chọn)"
          value={newType.description}
          onChange={(e) => setNewType({ ...newType, description: e.target.value })}
        />
        <button onClick={handleCreate}>Thêm loại</button>
      </div>

      {/* Danh sách */}
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
          {types.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>
                {editingType?.id === t.id ? (
                  <input
                    type="text"
                    value={editingType.name}
                    onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                  />
                ) : (
                  t.name
                )}
              </td>
              <td>
                {editingType?.id === t.id ? (
                  <input
                    type="text"
                    value={editingType.description}
                    onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                  />
                ) : (
                  t.description
                )}
              </td>
              <td>
                {editingType?.id === t.id ? (
                  <>
                    <button onClick={handleUpdate}>Lưu</button>
                    <button onClick={() => setEditingType(null)}>Huỷ</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingType(t)}>Sửa</button>
                    <button onClick={() => handleDelete(t.id)}>Xoá</button>
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

export default RestaurantTypeManager;
