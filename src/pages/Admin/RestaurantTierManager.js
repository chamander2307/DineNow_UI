import React, { useEffect, useState } from "react";
import { fetchAdminRestaurantTiers } from "../../services/restaurantService";
import AdminLayout from "./AdminLayout";
import RestaurantTierFormModal from "../../components/common/RestaurantTierFormModal.js";
import "../../assets/styles/admin/RestaurantTierManager.css";

// Debug import
console.log("RestaurantTierFormModal:", RestaurantTierFormModal);

const RestaurantTierManager = () => {
  const [tiers, setTiers] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    setLoading(true);
    try {
      console.log("Fetching restaurant tiers...");
      const data = await fetchAdminRestaurantTiers();
      if (Array.isArray(data)) {
        console.log("Tiers loaded successfully:", data);
        setTiers(data);
        setMessage("");
      } else {
        console.log("Invalid data format:", data);
        setMessage("Dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách hạng:", err);
      setMessage("Không thể tải danh sách hạng nhà hàng");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    console.log("openCreateModal called, setting showFormModal to true");
    setEditingData(null);
    setShowFormModal(true);
  };

  const openEditModal = (tier) => {
    console.log("openEditModal called with tier:", tier);
    setEditingData(tier);
    setShowFormModal(true);
  };

  const handleSuccess = (msg) => {
    console.log("handleSuccess called with message:", msg);
    console.log("Closing modal immediately");
    setShowFormModal(false); // Đóng modal ngay lập tức
    setMessage(msg || "Thành công");
    // Tải lại dữ liệu sau 2 giây
    setTimeout(() => {
      console.log("Reloading tiers after 2 seconds");
      loadTiers();
    }, 2000);
  };

  const checkDuplicateName = (name) => {
    return tiers.some((tier) => tier.name.toLowerCase() === name.toLowerCase());
  };

  return (
    <AdminLayout>
      <div className="restaurant-tier-manager">
        <div className="manager-header">
          <h2>Quản lý hạng nhà hàng</h2>
          <button
            className="btn-create"
            onClick={() => {
              console.log("Button clicked: Opening create modal");
              openCreateModal();
            }}
          >
            + Thêm hạng
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
                <th>Tên</th>
                <th>Phí mỗi khách</th>
                <th>Mô tả</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tiers.length > 0 ? (
                tiers.map((tier) => (
                  <tr key={tier.id}>
                    <td>{tier.name}</td>
                    <td>{parseInt(tier.feePerGuest).toLocaleString("vi-VN")} VNĐ</td>
                    <td>{tier.description}</td>
                    <td>
                      <button onClick={() => openEditModal(tier)}>Sửa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Không có hạng nhà hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {showFormModal && (
          <RestaurantTierFormModal
            onClose={() => {
              console.log("Closing modal");
              setShowFormModal(false);
            }}
            onSuccess={handleSuccess}
            initialData={editingData}
            checkDuplicateName={checkDuplicateName}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default RestaurantTierManager;