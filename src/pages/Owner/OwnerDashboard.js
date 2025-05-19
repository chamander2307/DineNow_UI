// OwnerDashboard.js
import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { OwnerDashboard as fetchOwnerDashboard } from "../../services/DashboardServices";
import "../../assets/styles/owner/OwnerDashboard.css";

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetchOwnerDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu dashboard: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const pieData = dashboardData
    ? [
        { name: "Nhà hàng", value: dashboardData.totalRestaurant },
        { name: "Đơn hàng hoàn thành", value: dashboardData.totalOrderCompleted },
        { name: "Loại món ăn", value: dashboardData.totalFoodCategory },
        { name: "Đánh giá nhà hàng", value: dashboardData.totalRestaurantReview },
        { name: "Đánh giá món ăn", value: dashboardData.totalMenuItemReview },
      ]
    : [];

const COLORS = ["#4A90E2", "#50C878", "#FF6B6B", "#FFD166", "#A569BD"];

  return (
    <OwnerLayout>
      <div className="dashboard-container">
        <div className="manager-header">
          <h2>Tổng Quan Dashboard</h2>
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <div className="loading-spinner" style={{ textAlign: "center", padding: "20px" }}>
            <span>Đang tải...</span>
          </div>
        ) : !dashboardData ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Không có dữ liệu để hiển thị.</p>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Tổng nhà hàng</h3>
                <p>{dashboardData.totalRestaurant}</p>
              </div>
              <div className="stat-card">
                <h3>Đơn hàng hoàn thành</h3>
                <p>{dashboardData.totalOrderCompleted}</p>
              </div>
              <div className="stat-card">
                <h3>Tổng doanh thu</h3>
                <p>{dashboardData.totalRevenue.toLocaleString()} VND</p>
              </div>
              <div className="stat-card">
                <h3>Loại món ăn</h3>
                <p>{dashboardData.totalFoodCategory}</p>
              </div>
              <div className="stat-card">
                <h3>Đánh giá nhà hàng</h3>
                <p>{dashboardData.totalRestaurantReview}</p>
              </div>
              <div className="stat-card">
                <h3>Đánh giá món ăn</h3>
                <p>{dashboardData.totalMenuItemReview}</p>
              </div>
            </div>

            <div className="chart-section">
              <h3>Phân bố dữ liệu</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </OwnerLayout>
  );
};

export default OwnerDashboard;