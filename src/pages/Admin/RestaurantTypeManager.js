import React, { useEffect, useState } from "react";
import { fetchRestaurantTypes } from "../../services/restaurantService";
import AdminLayout from "./AdminLayout";
import RestaurantTypeFormModal from "../../components/common/RestaurantTypeFormModal";
import "../../assets/styles/admin/RestaurantTypeManager.css";

const RestaurantTypeManager = () => {
  const [types, setTypes] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    setLoading(true);
    try {
      const res = await fetchRestaurantTypes();
      if (Array.isArray(res)) {
        setTypes(res);
        setMessage("");
      } else {
        setMessage("Dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách loại nhà hàng:", err);
      setMessage("Không thể tải loại nhà hàng");
    } finally {
      setLoading(false);
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
    return types.some((type) => type.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <AdminLayout>
      <div className="restaurant-type-manager">
        <div className="manager-header">
          <h2>Quản lý loại nhà hàng</h2>
          <button className="btn-create" onClick={openCreateModal}>
            + Thêm loại
          </button>
        </div>

        {message && (
          <p className={message.includes("thành công") ? "message" : "error"}>
            {message}
          </p>
        )}

        {loading ? (
          <div className="loading-spinner">
            <span>Đang tải...</span>
          </div>
        ) : (
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
              {types.length > 0 ? (
                types.map((type) => (
                  <tr key={type.id}>
                    <td>
                      {type.imageUrl && (
                        <img
                          src={type.imageUrl}
                          alt={type.name}
                          className="thumbnail"
                        />
                      )}
                    </td>
                    <td>{type.name}</td>
                    <td>{type.description}</td>
                    <td>
                      <button onClick={() => openEditModal(type)}>Sửa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Không có loại nhà hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

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