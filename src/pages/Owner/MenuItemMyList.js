import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import MenuItemFormModal from "../../components/Owner/MenuItemFormModal";
import MenuItemDetailModal from "../../components/Owner/MenuItemDetailModal";
import {
  getFullMenuByOwner,
  deleteMenuItem,
  updateMenuItemAvailability,
} from "../../services/menuItemService";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";

const MenuItemMyList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadMenuItems(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetchRestaurantsByOwner();
      const data = res?.data || [];
      setRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurantId(data[0].id);
      }
    } catch (err) {
      alert("Không thể tải danh sách nhà hàng.");
    } finally {
      setLoading(false);
    }
  };

  const loadMenuItems = async (restaurantId) => {
  setLoading(true);
  try {
    setMenuItems([]);
    const res = await getFullMenuByOwner(restaurantId);
    setMenuItems(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    alert("Không thể tải danh sách món ăn.");
  } finally {
    setLoading(false);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) return;
    try {
      await deleteMenuItem(id);
      alert("Xóa món ăn thành công.");
      loadMenuItems(selectedRestaurantId);
    } catch (err) {
      alert("Không thể xóa món ăn: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      await updateMenuItemAvailability(item.id, !item.available);
      alert("Cập nhật trạng thái thành công.");
      loadMenuItems(selectedRestaurantId);
    } catch (err) {
      alert("Không thể cập nhật trạng thái: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <OwnerLayout>
      <div className="menu-manager-header">
        <h2>Quản lý Món ăn</h2>
        <div className="top-actions">
          <select
            value={selectedRestaurantId || ""}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            disabled={loading || !restaurants.length}
          >
            <option value="" disabled>Chọn nhà hàng</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button
            className="btn-create"
            onClick={() => {
              setEditingItem(null);
              setShowFormModal(true);
            }}
            disabled={loading || !selectedRestaurantId}
          >
            + Tạo món ăn mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ textAlign: "center", padding: "20px" }}>
          <span>Đang tải...</span>
        </div>
      ) : menuItems.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Không có món ăn nào.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Phục vụ</th>
              <th>Danh mục</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <img
                    src={item.imageUrl || "/fallback.jpg"}
                    alt={item.name || "Món ăn"}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                    onError={(e) => { e.target.src = "/fallback.jpg"; }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.price ? Number(item.price).toLocaleString() + "đ" : "N/A"}</td>
                <td>{item.available ? "Còn phục vụ" : "Tạm ngưng"}</td>
                <td>{item.category?.name || "Không có"}</td>
                <td>
                  <button onClick={() => { setSelectedItem(item); setShowDetailModal(true); }}>Chi tiết</button>
                  <button onClick={() => { setEditingItem(item); setShowFormModal(true); }}>Sửa</button>
                  <button onClick={() => handleDelete(item.id)}>Xóa</button>
                  <button onClick={() => handleToggleAvailable(item)}>
                    {item.available ? "Ngưng phục vụ" : "Mở lại"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showFormModal && (
        <MenuItemFormModal
          restaurantId={selectedRestaurantId}
          initialData={editingItem}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            loadMenuItems(selectedRestaurantId);
            setShowFormModal(false);
          }}
        />
      )}

      {showDetailModal && (
        <MenuItemDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          item={selectedItem}
        />
      )}
    </OwnerLayout>
  );
};

export default MenuItemMyList;