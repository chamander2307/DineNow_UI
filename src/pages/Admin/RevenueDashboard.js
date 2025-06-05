import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AdminLayout from "./AdminLayout";
import "../../assets/styles/admin/RevenueDashboard.css";
import { fetchAdminMonthlyRevenue, fetchAdminTotalRevenue, fetchAdminRevenueInRange } from "../../services/revenueService";
import MonthPicker from "../../components/admin/MonthPicker";

const MAX_RESTAURANTS = 5;

const RevenueDashboard = () => {
  // Hàm lấy thời gian hiện tại
  const getCurrentDate = () => {
    const currentDate = new Date();
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    };
  };

  // Các state
  const [revenueStats, setRevenueStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [viewType, setViewType] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentDate());
  const [startDate, setStartDate] = useState({ year: 2025, month: 4 });
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Kiểm tra và cập nhật thời gian mỗi ngày
  useEffect(() => {
    const checkDate = () => {
      const newDate = getCurrentDate();
      if (newDate.year !== selectedMonth.year || newDate.month !== selectedMonth.month) {
        setSelectedMonth(newDate);
      }
      if (newDate.year !== endDate.year || newDate.month !== endDate.month) {
        setEndDate(newDate);
      }
    };

    const interval = setInterval(checkDate, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedMonth, endDate]);

  // Tải dữ liệu khi viewType, selectedMonth, startDate, endDate thay đổi
  useEffect(() => {
    handleViewData();
  }, [viewType, selectedMonth, startDate, endDate]);

  const handleViewData = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (viewType === "monthly") {
        const monthStr = `${selectedMonth.year}-${selectedMonth.month.toString().padStart(2, "0")}`;
        data = await fetchAdminMonthlyRevenue(monthStr);
        setRevenueStats(
          data.data.restaurantMonthlyDetails.map((item) => ({
            restaurantName: item.restaurantName,
            totalOrders: item.totalOrder,
            totalRevenue: item.totalRevenue,
          }))
        );
        setTotalRevenue(data.data.totalRevenue);
      } else if (viewType === "yearly") {
        data = await fetchAdminTotalRevenue();
        setRevenueStats(
          data.data.restaurantRevenueDetails.map((item) => ({
            restaurantName: item.restaurantName,
            totalOrders: item.totalOrder,
            totalRevenue: item.totalRevenue,
          }))
        );
        setTotalRevenue(data.data.totalRevenue);
      } else if (viewType === "range") {
        if (startDate.year > endDate.year || (startDate.year === endDate.year && startDate.month > endDate.month)) {
          setError("Tháng bắt đầu phải trước tháng kết thúc.");
          setRevenueStats([]);
          return;
        }
        const startMonthStr = `${startDate.year}-${startDate.month.toString().padStart(2, "0")}`;
        const endMonthStr = `${endDate.year}-${endDate.month.toString().padStart(2, "0")}`;
        data = await fetchAdminRevenueInRange(startMonthStr, endMonthStr);
        setRevenueStats(
          data.data.restaurantRevenueDetails.map((item) => ({
            restaurantName: item.restaurantName,
            totalOrders: item.totalOrder,
            totalRevenue: item.totalRevenue,
          }))
        );
        setTotalRevenue(data.data.totalRevenue);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu: " + (err.response?.data?.message || err.message));
      setRevenueStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Lọc dữ liệu dựa trên searchTerm
  const filteredStats = revenueStats.filter((item) =>
    item.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredStats.length / MAX_RESTAURANTS);
  const paginatedStats = filteredStats.slice(
    (currentPage - 1) * MAX_RESTAURANTS,
    currentPage * MAX_RESTAURANTS
  );

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="manager-header">
          <h2>Thống Kê Doanh Thu</h2>
        </div>
        <div className="top-actions">
          <div className="control-item">
            <label>Loại xem:</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              disabled={loading}
              className="form-input"
            >
              <option value="monthly">Theo tháng</option>
              <option value="yearly">Tổng từ trước đến nay</option>
              <option value="range">Theo khoảng thời gian</option>
            </select>
          </div>
          {viewType === "monthly" && (
            <div className="control-item">
              <label>Tháng/Năm:</label>
              <MonthPicker
                value={selectedMonth}
                onChange={setSelectedMonth}
                disabled={loading}
              />
            </div>
          )}
          {viewType === "range" && (
            <>
              <div className="control-item">
                <label>Tháng/Năm bắt đầu:</label>
                <MonthPicker
                  value={startDate}
                  onChange={setStartDate}
                  disabled={loading}
                />
              </div>
              <div className="control-item">
                <label>Tháng/Năm kết thúc:</label>
                <MonthPicker
                  value={endDate}
                  onChange={setEndDate}
                  disabled={loading}
                />
              </div>
            </>
          )}
          <div className="control-item">
            <label>Tìm kiếm nhà hàng:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên nhà hàng..."
              className="search-input"
              disabled={loading}
            />
          </div>
        </div>
        {error && <p className="error-message">{error}</p>}
        {loading ? (
          <div className="loading-spinner">
            <span>Đang tải...</span>
          </div>
        ) : filteredStats.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px" }}>
            Không có dữ liệu để hiển thị.
          </p>
        ) : (
          <>
            <div className="overview">
              <h3>Tổng doanh thu: {totalRevenue.toLocaleString()} VNĐ</h3>
            </div>
            <div className="chart-section">
              <h3>Biểu đồ doanh thu</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={450}>
                  <BarChart
                    data={paginatedStats}
                    margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="restaurantName"
                      tick={{ fontSize: 12 }}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tickFormatter={(value) =>
                        value >= 1000000
                          ? `${(value / 1000000).toFixed(1)}M`
                          : value >= 1000
                            ? `${(value / 1000).toFixed(1)}K`
                            : value
                      }
                      tick={{ fontSize: 12 }}
                      width={80}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value.toLocaleString()} ${name === "totalRevenue" ? "VNĐ" : "đơn"
                        }`,
                        name === "totalRevenue" ? "Doanh thu" : "Số đơn hàng",
                      ]}
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #f0e6e2",
                        borderRadius: "6px",
                        fontSize: "14px",
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: "10px" }} />
                    <Bar
                      dataKey="totalRevenue"
                      name="Doanh thu"
                      fill="#0099FF"
                      barSize={40}
                    />
                    <Bar
                      dataKey="totalOrders"
                      name="Số đơn hàng"
                      fill="#FF6B6B"
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="order-table">
              <h3>Chi tiết doanh thu</h3>
              <table className="revenue-table">
                <thead>
                  <tr>
                    <th>Nhà hàng</th>
                    <th>Số đơn hàng</th>
                    <th>Doanh thu (VNĐ)</th>
                    <th>Tỷ lệ (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStats.map((item, index) => (
                    <tr key={index}>
                      <td>{item.restaurantName}</td>
                      <td>{item.totalOrders}</td>
                      <td>{item.totalRevenue.toLocaleString()}</td>
                      <td>
                        {totalRevenue
                          ? ((item.totalRevenue / totalRevenue) * 100).toFixed(2)
                          : "0.00"}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <strong>Tổng</strong>
                    </td>
                    <td>
                      {filteredStats.reduce(
                        (sum, item) => sum + item.totalOrders,
                        0
                      )}
                    </td>
                    <td>
                      {filteredStats
                        .reduce((sum, item) => sum + item.totalRevenue, 0)
                        .toLocaleString()}
                    </td>
                    <td>100.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {filteredStats.length > MAX_RESTAURANTS && (
              <div className="pagination-container">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  Trang trước
                </button>
                <span className="pagination-span">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default RevenueDashboard;