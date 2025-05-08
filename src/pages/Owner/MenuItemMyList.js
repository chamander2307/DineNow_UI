import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";

import MenuItemFormModal from "../../components/Owner/MenuItemFormModal";

import {
  getFullMenuByOwner,
  deleteMenuItem,
  updateMenuItemAvailability,
} from "../../services/menuItemService";

import { fetchRestaurantsByOwner } from "../../services/restaurantService";
// import "../../assets/styles/owner/MenuItemList.css";

const MenuItemMyList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadMenuItems(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      const data = res.data.data;
      setRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurantId(data[0].id);
      }
    } catch (err) {
      alert("Không thể tải danh sách nhà hàng");
      console.error(err);
    }
  };

  const loadMenuItems = async (restaurantId) => {
    try {
      const res = await getFullMenuByOwner(restaurantId);
      setMenuItems(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      alert("Không thể tải danh sách món ăn");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá món ăn này?")) return;
    try {
      await deleteMenuItem(id);
      loadMenuItems(selectedRestaurantId);
    } catch (err) {
      alert("Không thể xoá món ăn");
      console.error(err);
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      await updateMenuItemAvailability(item.id, !item.available);
      loadMenuItems(selectedRestaurantId);
    } catch (err) {
      alert("Không thể cập nhật trạng thái");
      console.error(err);
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
          >
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <button
            className="btn-create"
            onClick={() => {
              setEditingItem(null);
              setShowFormModal(true);
            }}
          >
            + Tạo món ăn mới
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
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
              <td>
                <img
                  src={item.imageUrl || "/fallback.jpg"}
                  alt={item.name}
                  width={60}
                  height={60}
                  style={{ objectFit: "cover", borderRadius: 4 }}
                />
              </td>
              <td>{item.name}</td>
              <td>{Number(item.price).toLocaleString()}đ</td>
              <td>{item.available ? "Còn phục vụ" : "Tạm ngưng"}</td>
              <td>{item.category?.name || "Không có"}</td>
              <td>
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setShowFormModal(true);
                  }}
                >
                  Sửa
                </button>
                <button onClick={() => handleDelete(item.id)}>Xoá</button>
                <button onClick={() => handleToggleAvailable(item)}>
                  {item.available ? "Ngưng phục vụ" : "Mở lại"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </OwnerLayout>
  );
};

export default MenuItemMyList;
