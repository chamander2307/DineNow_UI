import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  fetchAllRestaurants,
  approveRestaurant,
  deleteRestaurant,
  searchRestaurants,
  fetchRestaurantById,
} from "../../services/restaurantService";
import RestaurantDetailModal from "../../components/common/RestaurantDetailModal";
import "../../assets/styles/admin/AdminRestaurantManager.css";

const RestaurantManager = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRestaurants();
  }, [page]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchAllRestaurants(page, 10);
      setRestaurants(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("Không thể tải danh sách nhà hàng");
    }
  };

  const handleSearch = async () => {
    try {
      const body = { restaurantName: searchName, province: searchProvince };
      const res = await searchRestaurants(body, page, 10);
      setRestaurants(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("Lỗi khi tìm kiếm nhà hàng");
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm("Duyệt nhà hàng này?")) {
      await approveRestaurant(id, "APPROVED"); // ✅ thêm status
      loadRestaurants();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xoá nhà hàng này?")) {
      await deleteRestaurant(id);
      loadRestaurants();
    }
  };

  const handleDetail = async (id) => {
    const res = await fetchRestaurantById(id);
    setSelectedRestaurant(res.data);
    setShowDetailModal(true);
  };

  return (
    <AdminLayout>
      <div className="manager-header">
        <h2>Quản lý Nhà hàng</h2>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Tên nhà hàng"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Quận / Thành phố"
          value={searchProvince}
          onChange={(e) => setSearchProvince(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(restaurants) &&
            restaurants.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.address}</td>
                <td>
                  {r.status === "APPROVED"
                    ? "Đã duyệt"
                    : r.status === "PENDING"
                    ? "Chờ duyệt"
                    : "Bị từ chối"}
                </td>
                <td>
                  <button onClick={() => handleDetail(r.id)}>Chi tiết</button>
                  {r.status === "PENDING" && (
                    <button onClick={() => handleApprove(r.id)}>Duyệt</button>
                  )}
                  <button onClick={() => handleDelete(r.id)}>Xoá</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Phân trang */}
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

      {/* Modal chi tiết */}
      {showDetailModal && selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </AdminLayout>
  );
};

export default RestaurantManager;
