import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import { fetchRevenueStatsByRestaurant } from "../../services/revenueService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OwnerRevenueDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [revenueStats, setRevenueStats] = useState([]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadRevenue(selectedRestaurantId);
    }
  }, [selectedRestaurantId]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      const data = res.data.data;
      setRestaurants(data);
      if (data.length > 0) setSelectedRestaurantId(data[0].id);
    } catch (err) {
      console.error("Lỗi tải danh sách nhà hàng", err);
    }
  };

  const loadRevenue = async (restaurantId) => {
    try {
      const res = await fetchRevenueStatsByRestaurant(restaurantId);
      setRevenueStats(res.data.data || []);
    } catch (err) {
      console.error("Lỗi tải doanh thu", err);
    }
  };

  return (
    <OwnerLayout>
      <div className="dashboard-container">
        <h2>Thống kê doanh thu</h2>
        <div style={{ marginBottom: "16px" }}>
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

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={revenueStats}
            margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
            <Legend />
            <Bar
              dataKey="totalRevenue"
              name="Doanh thu"
              fill="#8884d8"
              label={{
                position: "top",
                formatter: (value) => `${value.toLocaleString()} đ`,
              }}
            />
          </BarChart>
        </ResponsiveContainer>

        <table className="revenue-table" style={{ marginTop: 24 }}>
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Số đơn hàng</th>
              <th>Doanh thu (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {revenueStats.map((item, idx) => (
              <tr key={idx}>
                <td>{item.month}</td>
                <td>{item.totalOrders}</td>
                <td>{item.totalRevenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OwnerLayout>
  );
};

export default OwnerRevenueDashboard;
