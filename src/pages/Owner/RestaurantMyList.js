import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import {
  fetchAllRestaurants,
  fetchRestaurantById,
  searchRestaurants,
} from "../../services/restaurantService";
import RestaurantFormModal from "../../components/Owner/RestaurantFormModal";
import RestaurantDetailModal from '../../components/common/RestaurantDetailModal';
import "../../assets/styles/owner/OwnerRestaurant.css";

const RestaurantMyList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchProvince, setSearchProvince] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadRestaurants();
  }, [page]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchAllRestaurants(page, 10);

      setRestaurants(res.data.content.filter(r => r.isOwnedByCurrentUser));
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Lỗi khi tải nhà hàng");
    }
  };

  const handleSearch = async () => {
    try {
      const body = {
        restaurantName: searchName,
        province: searchProvince,
      };
      const res = await searchRestaurants(body, page, 10);
      setRestaurants(res.data.content.filter(r => r.isOwnedByCurrentUser)); // giả định
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Lỗi tìm kiếm");
    }
  };

  const handleDetail = async (id) => {
    const res = await fetchRestaurantById(id);
    setSelectedRestaurant(res.data);
    setShowDetailModal(true);
  };

  const handleEdit = async (id) => {
    const res = await fetchRestaurantById(id);
    setEditingRestaurant(res.data);
    setShowFormModal(true);
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Nhà hàng của tôi</h2>
        <button
          className="btn-create"
          onClick={() => {
            setEditingRestaurant(null);
            setShowFormModal(true);
          }}
        >
          ➕ Tạo mới nhà hàng
        </button>
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
          {restaurants.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.address}</td>
              <td>{r.status}</td>
              <td>
                <button onClick={() => handleDetail(r.id)}>Chi tiết</button>
                <button onClick={() => handleEdit(r.id)}>Sửa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page <= 0} onClick={() => setPage(page - 1)}>← Trước</button>
        <span>Trang {page + 1} / {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Tiếp →</button>
      </div>

      {/* Modal chi tiết */}
      {showDetailModal && selectedRestaurant && (
        <RestaurantDetailModal
          restaurant={selectedRestaurant}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedRestaurant(null);
          }}
        />
      )}

      {/* Modal tạo/sửa */}
      {showFormModal && (
        <RestaurantFormModal
          initialData={editingRestaurant}
          onClose={() => {
            setEditingRestaurant(null);
            setShowFormModal(false);
            loadRestaurants();
          }}
        />
      )}
    </OwnerLayout>
  );
};

export default RestaurantMyList;
