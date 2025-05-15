import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import { fetchRestaurantReviews } from "../../services/reviewService";

const OwnerReviewList = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const res = await fetchRestaurantsByOwner();
      const data = res?.data || [];
      setRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurantId(data[0].id);
      }
    } catch (err) {
      console.error("Lỗi tải nhà hàng", err);
      alert("Không thể tải danh sách nhà hàng");
    } finally {
      setIsLoading(false);
    }
  };
  const loadReviews = async (restaurantId) => {
    setIsLoading(true);
    try {
      const res = await fetchRestaurantReviews(restaurantId);
      // Đảm bảo res luôn là một mảng
      setReviews(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Lỗi tải đánh giá", err);
      alert("Không thể tải danh sách đánh giá");
      // Nếu có lỗi, đảm bảo setReviews là một mảng rỗng
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    try {
      const date = new Date(dateString);
      if (isNaN(date)) throw new Error("Invalid Date");
      return date.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
    } catch {
      return "Không xác định";
    }
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Quản lý Đánh giá Nhà hàng</h2>
        <div className="top-actions">
          <select
            className="form-input"
            value={selectedRestaurantId || ""}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
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
      </div>

      {isLoading ? (
        <div
          className="loading-spinner"
          style={{ textAlign: "center", padding: "20px" }}
        >
          <span>Đang tải...</span>
        </div>
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
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((r, index) => (
                <tr key={index}>
                  <td>{r.reviewerName || "Ẩn danh"}</td>
                  <td>{r.rating}/5</td>
                  <td>{r.comment || "Không có nội dung"}</td>
                  <td>{formatDate(r.reviewDate)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Chưa có đánh giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </OwnerLayout>
  );
};

export default OwnerReviewList;
