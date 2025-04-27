import React, { useEffect, useState } from "react";
import MenuItemFormModal from "../../components/Owner/MenuItemFormModal";
import {
  getFullMenuByOwner,
  deleteMenuItem,
  updateMenuItemAvailability,
} from "../../services/menuItemService";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import OwnerLayout from "./OwnerLayout";
import "../../assets/styles/owner/MenuItemList.css";

const MenuItemMyList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurantList, setRestaurantList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const res = await fetchRestaurantsByOwner();
        const data = res.data;
        setRestaurantList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Lỗi tải danh sách nhà hàng", err);
        setRestaurantList([]);
        setMessage("Không thể tải danh sách nhà hàng.");
      }
    };
    loadRestaurants();
  }, []);
  const loadMenuItems = async () => {
    if (!restaurantId) return;
    try {
      setLoading(true);
      const res = await getFullMenuByOwner(restaurantId);
      const data = res.data;
      setMenuItems(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (err) {
      console.error("❌ Lỗi tải danh sách món ăn", err);
      setMenuItems([]);
      setMessage("Không thể tải danh sách món ăn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, [restaurantId]);

  const toggleAvailable = async (itemId, current) => {
    try {
      await updateMenuItemAvailability(itemId, !current);
      setMessage("✅ Đã cập nhật trạng thái món.");
      loadMenuItems();
    } catch (err) {
      console.error(err);
      setMessage("❌ Không thể cập nhật trạng thái.");
    }
  };

  const handleDelete = async (itemId) => {
    const confirmed = window.confirm("Bạn chắc chắn muốn xoá món này?");
    if (!confirmed) return;

    try {
      await deleteMenuItem(itemId);
      setMessage("🗑️ Xoá món thành công.");
      loadMenuItems();
    } catch (err) {
      console.error(err);
      setMessage("❌ Xoá món thất bại.");
    }
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Quản lý món ăn</h2>
        <div style={{ display: "flex", gap: "12px" }}>
          <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)}>
            <option value="">-- Chọn nhà hàng --</option>
            {restaurantList.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditingMenuItem(null);
              setShowFormModal(true);
            }}
          >
            ➕ Thêm món mới
          </button>
        </div>
      </div>

      {message && <div className="notice">{message}</div>}

      {loading ? (
        <p>⏳ Đang tải danh sách món ăn...</p>
      ) : (
        <table className="menu-item-table">
          <thead>
            <tr>
              <th>Tên món</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length === 0 ? (
              <tr><td colSpan="4">Không có món nào.</td></tr>
            ) : (
              menuItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price.toLocaleString()}đ</td>
                  <td>{item.available ? "✅ Còn món" : "❌ Hết món"}</td>
                  <td>
                    <button onClick={() => toggleAvailable(item.id, item.available)}>
                      Đổi trạng thái
                    </button>
                    <button onClick={() => {
                      setEditingMenuItem(item);
                      setShowFormModal(true);
                    }}>
                      Sửa
                    </button>
                    <button onClick={() => handleDelete(item.id)}>
                      Xoá
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {showFormModal && (
        <MenuItemFormModal
          initialData={editingMenuItem}
          restaurantId={restaurantId}
          onClose={() => setShowFormModal(false)}
          onSuccess={loadMenuItems}
        />
      )}
    </OwnerLayout>
  );
};

export default MenuItemMyList;
