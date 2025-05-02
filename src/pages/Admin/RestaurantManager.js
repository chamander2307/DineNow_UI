import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  getPendingRestaurants,
  getApprovedRestaurants,
  getRejectedRestaurants,
  getBlockedRestaurants,
  approveRestaurant,
  rejectRestaurant,
  blockRestaurant,
  unblockRestaurant,
} from "../../services/adminService";
import RestaurantDetailModal from "../../components/common/RestaurantDetailModal";
import "../../assets/styles/admin/AdminRestaurantManager.css";

const AdminRestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filterType, setFilterType] = useState("PENDING");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRestaurants();
  }, [filterType, page]);

  const loadRestaurants = async () => {
    try {
      let res;

      switch (filterType) {
        case "PENDING":
          res = await getPendingRestaurants();
          break;
        case "APPROVED":
          res = await getApprovedRestaurants();
          break;
        case "REJECTED":
          res = await getRejectedRestaurants();
          break;
        case "BLOCKED":
          res = await getBlockedRestaurants();
          break;
        default:
          res = { data: [] };
      }

      const content = Array.isArray(res.data.data) ? res.data.data : [];
      setRestaurants(content);
      setTotalPages(1); // Giả sử chưa phân trang
    } catch (err) {
      console.error("Lỗi khi tải danh sách nhà hàng:", err);
      alert("Không thể tải danh sách nhà hàng");
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Duyệt nhà hàng này?")) {
      await approveRestaurant(id);
      loadRestaurants();
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Từ chối nhà hàng này?")) {
      await rejectRestaurant(id);
      loadRestaurants();
    }
  };

  const handleBlock = async (id) => {
    if (window.confirm("Chặn nhà hàng này?")) {
      await blockRestaurant(id);
      loadRestaurants();
    }
  };

  const handleUnblock = async (id) => {
    if (window.confirm("Bỏ chặn nhà hàng này?")) {
      await unblockRestaurant(id);
      loadRestaurants();
    }
  };

  const handleDetail = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowDetailModal(true);
  };

  return (
    <AdminLayout>
      <div className="manager-header">
        <h2>Quản lý Nhà hàng</h2>
      </div>

      <div className="filter-bar">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(0);
          }}
        >
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Bị từ chối</option>
          <option value="BLOCKED">Bị chặn</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Kích hoạt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.address}</td>
              <td>{r.status}</td>
              <td>{r.enabled ? "Đang hoạt động" : "Đã khoá"}</td>
              <td>
                <button onClick={() => handleDetail(r)}>Chi tiết</button>
                {filterType === "PENDING" && (
                  <>
                    <button onClick={() => handleApprove(r.id)}>Duyệt</button>
                    <button onClick={() => handleReject(r.id)}>Từ chối</button>
                  </>
                )}
                {filterType === "APPROVED" && (
                  <button onClick={() => handleBlock(r.id)}>Chặn</button>
                )}
                {filterType === "BLOCKED" && (
                  <button onClick={() => handleUnblock(r.id)}>Bỏ chặn</button>
                )}
                <button onClick={() => handleReject(r.id)}>Xoá</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>
          ← Trước
        </button>
        <span>
          Trang {page + 1} / {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Tiếp →
        </button>
      </div>

      {showDetailModal && selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminRestaurantManager;
