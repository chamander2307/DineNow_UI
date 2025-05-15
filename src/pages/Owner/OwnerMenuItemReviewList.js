import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import { fetchMenuItemsByRestaurant } from "../../services/menuItemService";
import { fetchMenuItemReviews } from "../../services/reviewService";

const OwnerMenuItemReviewList = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "OWNER") {
      navigate("/unauthorized");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadMenuItems(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  useEffect(() => {
    if (selectedMenuItemId) {
      loadReviews(selectedMenuItemId);
    }
  }, [selectedMenuItemId]);

  const loadRestaurants = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const loadMenuItems = async (restaurantId) => {
    setIsLoading(true);
    try {
      setMenuItems([]);
      setReviews([]);
      setSelectedMenuItemId(null);
      const res = await fetchMenuItemsByRestaurant(restaurantId);
      const data = Array.isArray(res.data) ? res.data : [];
      setMenuItems(data);
      if (data.length > 0) {
        setSelectedMenuItemId(data[0].id);
      }
    } catch (err) {
      alert("Không thể tải danh sách món ăn.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadReviews = async (menuItemId) => {
    setIsLoading(true);
    try {
      const res = await fetchMenuItemReviews(menuItemId);
      setReviews(Array.isArray(res) ? res : []);
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Không có quyền truy cập. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        alert("Không thể tải danh sách đánh giá.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    } catch {
      return "Không xác định";
    }
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Quản lý Đánh giá Món ăn</h2>
        <div className="top-actions" style={{ display: "flex", gap: "16px" }}>
          <div>
            <label className="form-group label">Chọn nhà hàng:</label>
            <select
              className="form-input"
              value={selectedRestaurantId || ""}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              disabled={isLoading}
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
          </div>
          <div>
            <label className="form-group label">Chọn món ăn:</label>
            <select
              className="form-input"
              value={selectedMenuItemId || ""}
              onChange={(e) => setSelectedMenuItemId(e.target.value)}
              disabled={isLoading || !menuItems.length}
            >
              <option value="" disabled>
                Chọn món ăn
              </option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div
          className="loading-spinner"
          style={{ textAlign: "center", padding: "20px" }}
        >
          <span>Đang tải...</span>
        </div>
      ) : reviews.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px" }}>
          Chưa có đánh giá nào.
        </p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Người đánh giá</th>
              <th>Điểm</th>
              <th>Nội dung</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, index) => (
              <tr key={index}>
                <td>{r.reviewerName || "Ẩn danh"}</td>
                <td>{r.rating ? `${r.rating}/5` : "N/A"}</td>
                <td>{r.comment || "Không có nội dung"}</td>
                <td>{formatDate(r.reviewDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </OwnerLayout>
  );
};

export default OwnerMenuItemReviewList;
