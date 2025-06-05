import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner, updateOwnerRestaurantStatus } from "../../services/restaurantService";
import RestaurantFormModal from "../../components/Owner/RestaurantFormModal";
import RestaurantDetailModal from "../../components/Owner/RestaurantDetailModal";
import httpStatusMessages from "../../constants/httpStatusMessages";
import Modal from "react-modal";
import "../../assets/styles/owner/OwnerRestaurant.css";

Modal.setAppElement("#root");

const RestaurantMyList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetchRestaurantsByOwner();
      const data = res?.data || [];

      if (res?.status !== 200) {
        const statusCode = res?.status || 500;
        const errorMessage = res?.message || httpStatusMessages[statusCode] || "Lỗi không xác định";
        throw new Error(errorMessage);
      }

      setRestaurants(data);
    } catch (err) {
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || httpStatusMessages[statusCode] || err.message || "Lỗi không xác định";
      alert(`Không thể tải danh sách nhà hàng: ${errorMessage}`);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantStatus = async (restaurantId, currentStatus) => {
    if (!["APPROVED", "SUSPENDED"].includes(currentStatus)) {
      alert("Trạng thái nhà hàng không hợp lệ để thay đổi.");
      return;
    }

    const newStatus = currentStatus === "APPROVED" ? "SUSPENDED" : "APPROVED";
    const actionText = currentStatus === "APPROVED" ? "khóa" : "mở khóa";

    if (!window.confirm(`Bạn có chắc muốn ${actionText} nhà hàng này?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await updateOwnerRestaurantStatus(restaurantId, newStatus);
      if (response.status === 200 && response.data === true) {
        alert(`Nhà hàng đã được ${actionText} thành công!`);
        await loadRestaurants();
      } else {
        throw new Error("Phản hồi không hợp lệ từ server");
      }
    } catch (err) {
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || httpStatusMessages[statusCode] || err.message || "Lỗi không xác định";
      alert(`Lỗi khi ${actionText} nhà hàng: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedRestaurantId(null);
    setShowFormModal(true);
  };

  const openEditModal = (restaurant) => {
  if (restaurant.status !== "APPROVED") {
    alert(
      restaurant.status === "PENDING"
        ? "Nhà hàng chưa được duyệt, không thể chỉnh sửa."
        : "Nhà hàng đã bị khóa, không thể chỉnh sửa."
    );
    return;
  }

  setSelectedRestaurantId(restaurant.id);
  setShowFormModal(true);
};


  const openDetailModal = (restaurant) => {
    if (restaurant.status !== "APPROVED") {
      alert(
        restaurant.status === "PENDING"
          ? "Nhà hàng chưa được duyệt, không thể xem chi tiết."
          : "Nhà hàng đã bị khóa, không thể xem chi tiết."
      );
      return;
    }
    setSelectedRestaurantId(restaurant.id);
    setShowDetailModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setSelectedRestaurantId(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRestaurantId(null);
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Quản lý nhà hàng</h2>
        <button className="btn-create" onClick={openCreateModal} disabled={loading}>
          Thêm mới nhà hàng
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ textAlign: "center", padding: "20px" }}>
          <span>Đang tải...</span>
        </div>
      ) : restaurants.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Không có nhà hàng nào.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>ID</th>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Loại</th>
              <th>Hạng</th>
              <th>Đánh giá TB</th>
              <th>Số lượng đặt bàn</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r.id}>
                <td>
                  <img
                    src={r.thumbnailUrl || "/fallback.jpg"}
                    alt={r.name || "Nhà hàng"}
                    width={80}
                    height={60}
                    onError={(e) => { e.target.src = "/fallback.jpg"; }}
                  />
                </td>
                <td>{r.id}</td>
                <td>{r.name || "N/A"}</td>
                <td>{r.address || "N/A"}</td>
                <td>{r.typeName || "N/A"}</td>
                <td>{r.restaurantTierName || "N/A"}</td>
                <td>{r.averageRating ? r.averageRating.toFixed(1) : "0.0"}</td>
                <td>{r.reservationCount ?? "0"}</td>
                <td>
                  {r.status === "APPROVED" ? "Đã duyệt" : 
                   r.status === "PENDING" ? "Đang chờ" : 
                   r.status === "SUSPENDED" ? "Đã khóa" : 
                   r.status === "BLOCKED" ? "Bị chặn" : "N/A"}
                </td>
                <td>
                    <button onClick={() => openEditModal(r)} disabled={loading}>Sửa</button>
                  <button onClick={() => openDetailModal(r)} disabled={loading}>Xem</button>
                  <button
                    onClick={() => toggleRestaurantStatus(r.id, r.status)}
                    disabled={loading || !["APPROVED", "SUSPENDED"].includes(r.status)}
                  >
                    {r.status === "APPROVED" ? "Khóa" : r.status === "SUSPENDED" ? "Mở khóa" : "N/A"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showFormModal && (
        <RestaurantFormModal
          isOpen={showFormModal}
          onClose={closeFormModal}
          restaurantId={selectedRestaurantId}
          onRefresh={loadRestaurants}
          restaurants={restaurants}
        />
      )}

      {showDetailModal && selectedRestaurantId && (
        <RestaurantDetailModal
          isOpen={showDetailModal}
          onClose={closeDetailModal}
          restaurantId={selectedRestaurantId}
        />
      )}
    </OwnerLayout>
  );
};

export default RestaurantMyList;