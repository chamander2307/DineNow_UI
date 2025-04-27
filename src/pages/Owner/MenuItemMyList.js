import React, { useEffect, useState } from "react";
import MenuItemFormModal from "../../components/Owner/MenuItemFormModal";
import {
  getFullMenuByOwner,
  deleteMenuItem,
  updateMenuItemAvailability,
} from "../../services/menuItemService";
import OwnerLayout from "./OwnerLayout";
import "../../assets/styles/owner/MenuItemList.css"; // bạn cần tạo file css

const MenuItemMyList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // Load danh sách món ăn của 1 nhà hàng
  const loadMenuItems = async () => {
    if (!restaurantId) return;
    try {
      setLoading(true);
      const res = await getFullMenuByOwner(restaurantId);
      setMenuItems(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách món ăn", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuItems();
    // eslint-disable-next-line
  }, [restaurantId]);

  // Toggle trạng thái phục vụ
  const toggleAvailable = async (itemId, current) => {
    try {
      await updateMenuItemAvailability(itemId, !current);
      loadMenuItems();
    } catch (err) {
      alert("❌ Không thể cập nhật trạng thái");
    }
  };

  // Xoá món ăn
  const handleDelete = async (itemId) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá món này?")) return;
    try {
      await deleteMenuItem(itemId);
      loadMenuItems();
    } catch (err) {
      alert("❌ Xoá thất bại!");
    }
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Quản lý món ăn</h2>
        <div>
          <input
            placeholder="Nhập ID nhà hàng"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
          />
          <button
            onClick={() => {
              setEditingMenuItem(null);
              setShowFormModal(true);
            }}
            style={{ marginLeft: 12 }}
          >
            ➕ Thêm món mới
          </button>
        </div>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Trạng thái</th>
              <th>Phục vụ</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.available ? "✅" : "❌"}</td>
                <td>
                  <button onClick={() => toggleAvailable(item.id, item.available)}>
                    {item.available ? "Tắt" : "Bật"}
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setEditingMenuItem(item);
                      setShowFormModal(true);
                    }}
                  >
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(item.id)}>
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal thêm/sửa */}
      {showFormModal && (
        <MenuItemFormModal
          restaurantId={restaurantId}
          initialData={editingMenuItem}
          onClose={() => setShowFormModal(false)}
          onSuccess={loadMenuItems}
        />
      )}
    </OwnerLayout>
  );
};

export default MenuItemMyList;
