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
import "../../assets/styles/owner/MenuItem.css";

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
    console.log("useEffect: Loading restaurants...");
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      console.log(`useEffect: Loading menu items for restaurant ID: ${selectedRestaurantId}`);
      loadMenuItems(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      console.log("Fetching restaurants...");
      const res = await fetchRestaurantsByOwner();
      console.log("Restaurants response:", res);
      const data = res?.data || [];
      setRestaurants(data);
      if (data.length > 0) {
        console.log(`Setting selectedRestaurantId to: ${data[0].id}`);
        setSelectedRestaurantId(data[0].id);
      } else {
        console.warn("No restaurants found.");
        alert("Vui lòng tạo nhà hàng trước khi thêm món ăn.");
      }
    } catch (err) {
      console.error("Error loading restaurants:", err);
      alert("Không thể tải danh sách nhà hàng: " + (err.message || "Lỗi không xác định"));
    } finally {
      console.log("Finished loading restaurants, setting loading to false");
      setLoading(false);
    }
  };

  const loadMenuItems = async (restaurantId) => {
    setLoading(true);
    try {
      console.log(`Fetching menu items for restaurant ID: ${restaurantId}`);
      setMenuItems([]);
      const res = await getFullMenuByOwner(restaurantId);
      console.log("Menu items response:", res);
      setMenuItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error loading menu items:", err);
      alert("Không thể tải danh sách món ăn: " + (err.message || "Lỗi không xác định"));
    } finally {
      console.log("Finished loading menu items, setting loading to false");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) return;
    try {
      console.log(`Deleting menu item ID: ${id}`);
      await deleteMenuItem(id);
      alert("Xóa món ăn thành công.");
      loadMenuItems(selectedRestaurantId);
    } catch (err) {
      console.error("Error deleting menu item:", err);
      alert("Không thể xóa món ăn: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      console.log(`Toggling availability for menu item ID: ${item.id}`);
      await updateMenuItemAvailability(item.id, !item.available);
      alert("Cập nhật trạng thái thành công.");
      loadMenuItems(selectedRestaurantId);
    } catch (err) {
      console.error("Error toggling availability:", err);
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
            onChange={(e) => {
              console.log(`Selected restaurant ID: ${e.target.value}`);
              setSelectedRestaurantId(e.target.value);
            }}
            disabled={loading || !restaurants.length}
          >
            <option value="" disabled>
              Chọn nhà hàng
            </option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <button
            className="btn-create"
            onClick={() => {
              console.log("Create button clicked, setting showFormModal to true");
              setEditingItem(null);
              setShowFormModal(true);
            }}
            disabled={loading || !selectedRestaurantId}
            title={
              !selectedRestaurantId
                ? "Vui lòng chọn nhà hàng"
                : loading
                ? "Đang tải..."
                : "Tạo món ăn mới"
            }
          >
            + Tạo món ăn mới
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-spinner" style={{ textAlign: "center", padding: "20px" }}>
          <span>Đang tải...</span>
        </div>
      ) : restaurants.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px" }}>
          Bạn chưa có nhà hàng nào. Vui lòng tạo nhà hàng trước.
        </p>
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
                    onError={(e) => {
                      e.target.src = "/fallback.jpg";
                    }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.price ? Number(item.price).toLocaleString() + "đ" : "N/A"}</td>
                <td>{item.available ? "Còn phục vụ" : "Tạm ngưng"}</td>
                <td>{item.category?.name || "Không có"}</td>
                <td>
                  <button
                    onClick={() => {
                      console.log(`Opening detail modal for item ID: ${item.id}`);
                      setSelectedItem(item);
                      setShowDetailModal(true);
                    }}
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => {
                      console.log(`Opening edit modal for item ID: ${item.id}`);
                      setEditingItem(item);
                      setShowFormModal(true);
                    }}
                  >
                    Sửa
                  </button>
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
        <>
          {console.log("Rendering MenuItemFormModal with restaurantId:", selectedRestaurantId, "isOpen:", showFormModal)}
          <MenuItemFormModal
            isOpen={showFormModal}
            restaurantId={selectedRestaurantId}
            initialData={editingItem}
            menuItems={menuItems} // Truyền danh sách menuItems
            onClose={() => {
              console.log("Closing form modal");
              setShowFormModal(false);
            }}
            onSuccess={() => {
              console.log("Form submitted successfully, reloading menu items");
              loadMenuItems(selectedRestaurantId);
              setShowFormModal(false);
            }}
          />
        </>
      )}

      {showDetailModal && (
        <MenuItemDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            console.log("Closing detail modal");
            setShowDetailModal(false);
          }}
          item={selectedItem}
        />
      )}
    </OwnerLayout>
  );
};

export default MenuItemMyList;