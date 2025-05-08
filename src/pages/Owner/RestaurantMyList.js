import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "./OwnerLayout";
import {
  fetchRestaurantsByOwner,
} from "../../services/restaurantService";
import RestaurantFormModal from "../../components/Owner/RestaurantFormModal";
import RestaurantDetailModal from "../../components/Owner/RestaurantDetailModal";
import "../../assets/styles/owner/OwnerRestaurant.css";

const RestaurantMyList = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  // Load restaurants from API
  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      console.log("API Response:", res);

      if (res && res.status === 200) {
        if (Array.isArray(res.data)) {
          setRestaurants(res.data);
        } else if (res.data && Array.isArray(res.data.data)) {
          setRestaurants(res.data.data);
        } else {
          console.warn("Không tìm thấy dữ liệu nhà hàng:", res);
          setRestaurants([]);
        }
      } else {
        console.warn("API trả về lỗi:", res);
        setRestaurants([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách nhà hàng:", err);
      setRestaurants([]);
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

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Quản lý nhà hàng</h2>
        <button className="btn-create" onClick={openCreateModal}>
          Thêm mới nhà hàng
        </button>
      </div>

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
            <th>Đặt chỗ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length === 0 ? (
            <tr>
              <td colSpan="10">Chưa có nhà hàng nào.</td>
            </tr>
          ) : (
            restaurants.map((r) => (
              <tr key={r.id}>
                <td>
                  <img
                    src={r.thumbnailUrl || "/fallback.jpg"}
                    alt={r.name}
                    width={80}
                    height={60}
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                  />
                </td>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td>{r.typeName || "—"}</td>
                <td>{r.restaurantTierName || "—"}</td>
                <td>{r.averageRating?.toFixed(1) || "0.0"}</td>
                <td>{r.reservationCount || "0"}</td>
                <td>{r.status || "Đang hoạt động"}</td>
                <td>
                  <button onClick={() => openEditModal(r)}>Sửa</button>
                  <button onClick={() => openDetailModal(r)}>Xem</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showFormModal && (
        <RestaurantFormModal
          isOpen={showFormModal}
          onClose={() => setShowFormModal(false)}
          restaurant={selectedRestaurant}
          onRefresh={loadRestaurants}
        />
      )}

      {showDetailModal && (
        <RestaurantDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          restaurant={selectedRestaurant}
        />
      )}
    </OwnerLayout>
  );
};

export default RestaurantMyList;
