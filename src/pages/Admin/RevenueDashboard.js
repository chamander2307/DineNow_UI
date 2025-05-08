import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../assets/styles/admin/RevenueDashboard.css";
import AdminLayout from "./AdminLayout";
/* tìm kiếm doanh thu theo nhà hàng*/
/* tìm kiếm doanh thu theo nhà hàng*/
/* tìm kiếm doanh thu theo nhà hàng*/
/* tìm kiếm doanh thu theo nhà hàng*/
/* tìm kiếm doanh thu theo nhà hàng*/
/*hiển tổng doanh thu từ trước tới nay
hiển thị theo năm */
const RevenueDashboard = () => {
  const revenueStats = [
    {
      restaurantId: 1,
      name: "Nhà hàng A",
      totalOrders: 120,
      totalRevenue: 5600000,
      month: "04/2025",
    },
    {
      restaurantId: 2,
      name: "Nhà hàng B",
      totalOrders: 75,
      totalRevenue: 32250000,
      month: "04/2025",
    },
    {
      restaurantId: 3,
      name: "Nhà hàng C",
      totalOrders: 30,
      totalRevenue: 10800000,
      month: "04/2025",
    },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <h3>Biểu đồ doanh thu</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueStats}
              margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
              <Legend />
              <Bar
                dataKey="totalRevenue"
                name="Doanh thu"
                fill="#82ca9d"
                label={{
                  position: "top",
                  formatter: (value) => `${value.toLocaleString()} đ`,
                  fill: "#000",
                  fontSize: 12,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <h2>Thống kê doanh thu theo nhà hàng (04/2025)</h2>

        <table className="revenue-table">
          <thead>
            <tr>
              <th>Nhà hàng</th>
              <th>Số đơn hàng</th>
              <th>Doanh thu (VNĐ)</th>
              <th>Tháng</th>
            </tr>
          </thead>
          <tbody>
            {revenueStats.map((item) => (
              <tr key={item.restaurantId}>
                <td>{item.name}</td>
                <td>{item.totalOrders}</td>
                <td>{item.totalRevenue.toLocaleString()}</td>
                <td>{item.month}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default RevenueDashboard;
