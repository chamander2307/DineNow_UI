import React, { useEffect, useState } from "react";
import {
  deleteRestaurantType,
} from "../../services/adminService";
import { fetchRestaurantTypes } from "../../services/restaurantService";
import AdminLayout from "./AdminLayout";
import RestaurantTypeFormModal from "../../components/common/RestaurantTypeFormModal";
import "../../assets/styles/admin/RestaurantTypeManager.css";

const RestaurantTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      const res = await fetchRestaurantTypes();
      if (res.status === 200 && Array.isArray(res.data.data)) {
        setTypes(res.data.data);
      } else {
        setMessage(res.data.message || "Dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Error fetching types:", err);
      setMessage("Không thể tải loại nhà hàng");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xoá?")) {
      try {
        const res = await deleteRestaurantType(id);
        if (res.status === 200) {
          loadTypes();
          setMessage("Xoá thành công");
        } else {
          setMessage(res.data.message || "Xoá thất bại");
        }
      } catch (err) {
        console.error("Error deleting type:", err);
        setMessage(err || "Xoá thất bại");
      }
    }
  };

  const openCreateModal = () => {
    setEditingData(null);
    setShowFormModal(true);
  };

  const openEditModal = (type) => {
    setEditingData(type);
    setShowFormModal(true);
  };

  const handleSuccess = (msg) => {
    loadTypes();
    setShowFormModal(false);
    setMessage(msg || "Thành công");
  };

  const checkDuplicateName = (name) => {
    return types.some(type => type.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <AdminLayout>
      <div className="restaurant-type-manager">
        <h2>Quản lý loại nhà hàng</h2>
        <button onClick={openCreateModal}>+ Thêm loại</button>

        {message && <p className="message">{message}</p>}

        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type) => (
              <tr key={type.id}>
                <td>
                  {type.imageUrl && (
                    <img src={type.imageUrl} alt={type.name} className="thumbnail" />
                  )}
                </td>
                <td>{type.name}</td>
                <td>{type.description}</td>
                <td>
                  <button onClick={() => openEditModal(type)}>Sửa</button>
                  <button onClick={() => handleDelete(type.id)}>Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showFormModal && (
          <RestaurantTypeFormModal
            onClose={() => setShowFormModal(false)}
            onSuccess={handleSuccess}
            initialData={editingData}
            checkDuplicateName={checkDuplicateName}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default RestaurantTypeManager;