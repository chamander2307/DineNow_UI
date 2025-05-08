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

  useEffect(() => {
    loadRestaurants();
  }, [statusFilter]);

  useEffect(() => {
    applyFilter();
  }, [allRestaurants, searchName, searchProvince]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchAllRestaurants(page, 100, statusFilter); // size 100 để tránh phân trang sớm
      const list = Array.isArray(res.data.data) ? res.data.data : [];
      setAllRestaurants(list);
    } catch (err) {
      console.error("Lỗi tải danh sách nhà hàng", err);
    }
  };

  const applyFilter = () => {
    let filtered = [...allRestaurants];
    if (searchName.trim()) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchProvince.trim()) {
      filtered = filtered.filter((r) =>
        r.address.toLowerCase().includes(searchProvince.toLowerCase())
      );
    }
    setFilteredRestaurants(filtered);
  };

  const handleSearch = () => {
    applyFilter();
  };

  const openDetailModal = async (restaurantId) => {
    try {
      const res = await fetchRestaurantById(restaurantId);
      setSelectedRestaurant(res.data.d);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Không thể tải chi tiết nhà hàng");
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await updateRestaurantStatus(id, status);
      setShowDetailModal(false);
      loadRestaurants();
    } catch (err) {
      console.error("Lỗi duyệt nhà hàng");
    }
  };

  return (
    <AdminLayout>
      <div className="restaurant-manager">
        <h2>Quản lý nhà hàng</h2>

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
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button onClick={handleSearch}>Tìm kiếm</button>
        </div>

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
                    <img src={r.thumbnailUrl} alt={r.name} className="thumbnail" />
                  </td>
                  <td>{r.name}</td>
                  <td>{r.address}</td>
                  <td>{r.typeName || "—"}</td>
                  <td>{r.restaurantTierName || "—"}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => openDetailModal(r.id)}>Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showDetailModal && selectedRestaurant && (
          <RestaurantDetailModal
            restaurant={selectedRestaurant}
            onClose={() => setShowDetailModal(false)}
            onApprove={handleApprove}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default RestaurantManager;
