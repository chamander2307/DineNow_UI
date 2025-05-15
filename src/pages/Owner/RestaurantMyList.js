import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import RestaurantFormModal from "../../components/Owner/RestaurantFormModal";
import RestaurantDetailModal from "../../components/Owner/RestaurantDetailModal";
import Modal from "react-modal";
import "../../assets/styles/owner/OwnerRestaurant.css";

Modal.setAppElement("#root");

const RestaurantMyList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetchRestaurantsByOwner();
      setRestaurants(res?.data || []);
    } catch (err) {
      alert("Không thể tải danh sách nhà hàng: " + (err.response?.data?.message || err.message));
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedRestaurant(null);
    setShowFormModal(true);
  };

  const openEditModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowFormModal(true);
  };

  const openDetailModal = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setSelectedRestaurant(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedRestaurant(null);
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
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td>{r.type?.name || r.typeName || "N/A"}</td>
                <td>{r.restaurantTierName || "N/A"}</td>
                <td>{r.averageRating ? r.averageRating.toFixed(1) : "0.0"}</td>
                <td>{r.reservationCount ?? "0"}</td>
                <td>
                  <button onClick={() => openEditModal(r)}>Sửa</button>
                  <button onClick={() => openDetailModal(r)}>Xem</button>
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
          restaurant={selectedRestaurant}
          onRefresh={loadRestaurants}
          restaurants={restaurants} // Truyền danh sách nhà hàng
        />
      )}

      {showDetailModal && selectedRestaurant && (
        <RestaurantDetailModal
          isOpen={showDetailModal}
          onClose={closeDetailModal}
          restaurantId={selectedRestaurant.id}
        />
      )}
    </OwnerLayout>
  );
};

export default RestaurantMyList;