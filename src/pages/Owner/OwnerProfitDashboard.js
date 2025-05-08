import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import "../../assets/styles/owner/OwnerProfitDashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockProfitStats = [
  {
    month: "01/2025",
    totalOrders: 80,
    totalRevenue: 32000000,
    totalCost: 20000000,
    totalProfit: 12000000,
  },
  {
    month: "02/2025",
    totalOrders: 95,
    totalRevenue: 40000000,
    totalCost: 25000000,
    totalProfit: 15000000,
  },
  {
    month: "03/2025",
    totalOrders: 110,
    totalRevenue: 46000000,
    totalCost: 30000000,
    totalProfit: 16000000,
  },
];

const OwnerProfitDashboard = () => {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("1");
  const [profitStats, setProfitStats] = useState([]);

  useEffect(() => {
    // giả lập gọi API
    setProfitStats(mockProfitStats);
  }, [selectedRestaurantId]);

  return (
    <OwnerLayout>
      <div className="dashboard-container">
        <h2>Thống kê lợi nhuận</h2>

        <div style={{ marginBottom: "16px" }}>
          <label>Chọn nhà hàng: </label>
          <select
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
          >
            <option value="1">Nhà hàng A</option>
            <option value="2">Nhà hàng B</option>
            <option value="3">Nhà hàng C</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={profitStats}
            margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
            <Legend />
            <Bar
              dataKey="totalProfit"
              name="Lợi nhuận"
              fill="#f57c00"
              label={{ position: "top", formatter: (val) => `${val.toLocaleString()} đ` }}
            />
          </BarChart>
        </ResponsiveContainer>

        <table className="revenue-table" style={{ marginTop: 24 }}>
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Số đơn hàng</th>
              <th>Doanh thu (VNĐ)</th>
              <th>Chi phí (VNĐ)</th>
              <th>Lợi nhuận (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {profitStats.map((item, idx) => (
              <tr key={idx}>
                <td>{item.month}</td>
                <td>{item.totalOrders}</td>
                <td>{item.totalRevenue.toLocaleString()}</td>
                <td>{item.totalCost.toLocaleString()}</td>
                <td>{item.totalProfit.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OwnerLayout>
  );
};

export default OwnerProfitDashboard;
