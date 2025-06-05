import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import FoodCategoryFormModal from "../../components/Owner/FoodCategoryFormModal";
import { getFoodCategoriesByRestaurant, deleteFoodCategory } from "../../services/foodCategoryService";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import { fetchMainCategories } from "../../services/menuItemService";
import httpStatusMessages from "../../constants/httpStatusMessages";
import "../../assets/styles/owner/MenuItem.css";

const FoodCategoryMyList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRestaurants();
    loadMainCategories();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) loadCategories(selectedRestaurantId);
  }, [selectedRestaurantId]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetchRestaurantsByOwner();
      const data = res?.data || [];
      setRestaurants(data);
      if (data.length > 0) setSelectedRestaurantId(data[0].id);
      else alert("Vui lòng tạo nhà hàng trước khi quản lý danh mục.");
    } catch (err) {
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || httpStatusMessages[statusCode] || "Lỗi không xác định";
      alert(`Không thể tải danh sách nhà hàng: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const loadMainCategories = async () => {
    try {
      const res = await fetchMainCategories();
      setMainCategories(res.map((cat) => ({ value: cat.id, label: cat.name })));
    } catch (err) {
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || httpStatusMessages[statusCode] || "Lỗi không xác định";
      alert(`Không thể tải danh mục chính: ${errorMessage}`);
    }
  };

  const loadCategories = async (restaurantId) => {
    setLoading(true);
    try {
      const res = await getFoodCategoriesByRestaurant(restaurantId);
      setCategories(res || []);
    } catch (err) {
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || httpStatusMessages[statusCode] || "Lỗi không xác định";
      let displayMessage = errorMessage;
      if (statusCode === 417) {
        displayMessage += " Vui lòng kiểm tra trạng thái phê duyệt nhà hàng hoặc liên hệ admin.";
      }
      alert(`Không thể tải danh sách danh mục: ${displayMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      await deleteFoodCategory(id);
      alert("Xóa danh mục thành công.");
      loadCategories(selectedRestaurantId);
    } catch (err) {
      const statusCode = err.response?.status || 500;
      const errorMessage = err.response?.data?.message || httpStatusMessages[statusCode] || "Lỗi không xác định";
      alert(`Không thể xóa danh mục: ${errorMessage}`);
    }
  };

  return (
    <OwnerLayout>
      <div className="menu-manager-header">
        <h2>Quản lý Danh mục</h2>
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
              setEditingCategory(null);
              setShowFormModal(true);
            }}
            disabled={loading || !selectedRestaurantId}
            title={!selectedRestaurantId ? "Vui lòng chọn nhà hàng" : "Tạo danh mục mới"}
          >
            + Tạo danh mục mới
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
      ) : categories.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Không có danh mục nào.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Nhà hàng</th>
              <th>Danh mục chính</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.description || "N/A"}</td>
                <td>{cat.restaurantName}</td>
                <td>{cat.mainCategoryName}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setShowFormModal(true);
                    }}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showFormModal && (
        <FoodCategoryFormModal
          isOpen={showFormModal}
          restaurantId={selectedRestaurantId}
          initialData={editingCategory}
          mainCategories={mainCategories}
          onClose={() => setShowFormModal(false)}
          onSuccess={() => {
            loadCategories(selectedRestaurantId);
            setShowFormModal(false);
          }}
        />
      )}
    </OwnerLayout>
  );
};

export default FoodCategoryMyList;