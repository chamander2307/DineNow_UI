import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  fetchAllRestaurants,
  updateRestaurantStatus,
  fetchRestaurantById,
} from "../../services/adminService";
import RestaurantDetailModal from "../../components/common/RestaurantDetailModal";
import "../../assets/styles/admin/AdminRestaurantManager.css";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Từ chối" },
  { value: "SUSPENDED", label: "Tạm dừng" },
  { value: "BLOCKED", label: "Bị chặn" },
];

const RestaurantManager = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [page, setPage] = useState(0);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, [statusFilter, page]);

  useEffect(() => {
    applyFilter();
  }, [allRestaurants, searchName, searchProvince]);

  const loadRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAllRestaurants(page, 100, statusFilter);
      const list = Array.isArray(res.data) ? res.data : [];
      setAllRestaurants(list);
      console.log("Danh sách nhà hàng:", list); // Debug
    } catch (err) {
      console.error("Lỗi tải danh sách nhà hàng:", err);
      setError("Không thể tải danh sách nhà hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...allRestaurants];
    if (searchName.trim()) {
      filtered = filtered.filter((r) =>
        r.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchProvince.trim()) {
      filtered = filtered.filter((r) =>
        r.address?.toLowerCase().includes(searchProvince.toLowerCase())
      );
    }
    setFilteredRestaurants(filtered);
  };

  const openDetailModal = async (restaurantId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchRestaurantById(restaurantId);
      console.log("Chi tiết nhà hàng:", res.data); // Debug
      setSelectedRestaurant(res.data);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Không thể tải chi tiết nhà hàng:", err);
      setError("Không thể tải chi tiết nhà hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Cập nhật trạng thái:", { id, status }); // Debug
      await updateRestaurantStatus(id, status);
      setShowDetailModal(false);
      setSelectedRestaurant(null);
      await loadRestaurants();
    } catch (err) {
      console.error("Lỗi duyệt nhà hàng:", err);
      setError("Không thể cập nhật trạng thái nhà hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="restaurant-manager">
        <h2>Quản lý nhà hàng</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="filter-group">
          <input
            type="text"
            placeholder="Tên nhà hàng..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tỉnh/Thành phố..."
            value={searchProvince}
            onChange={(e) => setSearchProvince(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            disabled={loading}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner" style={{ textAlign: "center", padding: "20px" }}>
            <span>Đang tải...</span>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình</th>
                <th>Tên</th>
                <th>Địa chỉ</th>
                <th>Loại</th>
                <th>Hạng</th>
                <th>Ngày tạo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td colSpan="7">Không có nhà hàng phù hợp</td>
                </tr>
              ) : (
                filteredRestaurants.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <img
                        src={r.thumbnailUrl || "/fallback.jpg"}
                        alt={r.name || "Nhà hàng"}
                        className="thumbnail"
                        onError={(e) => {
                          e.target.src = "/fallback.jpg";
                        }}
                      />
                    </td>
                    <td>{r.name || "—"}</td>
                    <td>{r.address || "—"}</td>
                    <td>{r.typeName || "—"}</td>
                    <td>{r.restaurantTierName || "—"}</td>
                    <td>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                    <td>
                      <button
                        onClick={() => openDetailModal(r.id)}
                        disabled={loading}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {showDetailModal && selectedRestaurant && (
          <RestaurantDetailModal
            restaurant={selectedRestaurant}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedRestaurant(null);
            }}
            onApprove={handleApprove}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default RestaurantManager;