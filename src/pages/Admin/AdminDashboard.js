import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchAdminDashboard } from "../../services/revenueService";
import "../../assets/styles/admin/AdminDashboard.css";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetchAdminDashboard();
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
        { name: "Người dùng", value: dashboardData.totalUser },
        { name: "Chủ nhà hàng", value: dashboardData.totalOwner },
        { name: "Đơn hàng hoàn thành", value: dashboardData.totalOrderCompleted },
      ]
    : [];

  const COLORS = ["#4A90E2", "#50C878", "#FF6B6B", "#FFD166"];

  return (
    <AdminLayout title="Tổng Quan Dashboard Admin">
      <div className="admin-dashboard-container">
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
                <h3>Tổng người dùng</h3>
                <p>{dashboardData.totalUser}</p>
              </div>
              <div className="stat-card">
                <h3>Tổng chủ nhà hàng</h3>
                <p>{dashboardData.totalOwner}</p>
              </div>
              <div className="stat-card">
                <h3>Tổng doanh thu</h3>
                <p>{dashboardData.totalRevenue.toLocaleString()} VND</p>
              </div>
              <div className="stat-card">
                <h3>Tổng lợi nhuận</h3>
                <p>{dashboardData.totalProfit.toLocaleString()} VND</p>
              </div>
              <div className="stat-card">
                <h3>Đơn hàng hoàn thành</h3>
                <p>{dashboardData.totalOrderCompleted}</p>
              </div>
            </div>

            <div className="chart-section">
              <h3>Biểu đồ tổng quan</h3>
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
    </AdminLayout>
  );
};

export default AdminDashboard;