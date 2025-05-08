import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import { fetchReviewsByRestaurant } from "../../services/reviewService";

const OwnerReviewList = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "OWNER") {
      navigate("/unauthorized");
    }
  }, [user, loading]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadReviews(selectedRestaurantId);
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
      console.error("Lỗi tải nhà hàng", err);
    }
  };

  const loadReviews = async (restaurantId) => {
    try {
      const res = await fetchReviewsByRestaurant(restaurantId);
      setReviews(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Lỗi tải đánh giá", err);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <OwnerLayout>
      <div className="menu-manager-header">
        <h2>Quản lý Đánh giá</h2>
        <div className="top-actions">
          <label>Chọn nhà hàng:</label>
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
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Điểm</th>
            <th>Nội dung</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="4">Chưa có đánh giá nào.</td>
            </tr>
          ) : (
            reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.customerName}</td>
                <td>{r.rating}/5</td>
                <td>{r.comment}</td>
                <td>{new Date(r.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </OwnerLayout>
  );
};

export default OwnerReviewList;
