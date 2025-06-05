import React, { useEffect, useState } from "react";
import OwnerLayout from "./OwnerLayout";
import "../../assets/styles/owner/OwnerRevenueDashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import {
  fetchMonthlyRevenue,
  fetchYearlyRevenue,
  fetchMonthlyRevenueInRange,
} from "../../services/revenueService";
import MonthPicker from "../../components/admin/MonthPicker";

const OwnerRevenueDashboard = () => {
  // Hàm lấy thời gian hiện tại
  const getCurrentDate = () => {
    const currentDate = new Date();
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1, // getMonth() trả về 0-11, cần +1
    };
  };

  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [revenueStats, setRevenueStats] = useState([]);
  const [viewType, setViewType] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(getCurrentDate().year); // Năm hiện tại
  const [startDate, setStartDate] = useState({ year: 2025, month: 4 }); // 01/04/2025
  const [endDate, setEndDate] = useState(getCurrentDate()); // Thời gian hiện tại
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kiểm tra và cập nhật thời gian mỗi ngày
  useEffect(() => {
    const checkDate = () => {
      const newDate = getCurrentDate();
      if (newDate.year !== selectedYear) {
        setSelectedYear(newDate.year);
      }
      if (newDate.year !== endDate.year || newDate.month !== endDate.month) {
        setEndDate(newDate);
      }
    };

    const interval = setInterval(checkDate, 24 * 60 * 60 * 1000); // Kiểm tra mỗi 24 giờ
    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [selectedYear, endDate]);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (selectedRestaurantId) {
      handleViewData();
    }
  }, [selectedRestaurantId, viewType, selectedYear, startDate, endDate]);

  const getYearList = () => Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const formatMonth = (month) => (month < 10 ? `0${month}` : `${month}`);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const res = await fetchRestaurantsByOwner();
      const data = res?.data || [];
      setRestaurants(data);
      if (data.length > 0) setSelectedRestaurantId(data[0].id);
    } catch (err) {
      setError("Không thể tải danh sách nhà hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewData = async () => {
    if (!selectedRestaurantId) {
      setError("Vui lòng chọn nhà hàng.");
      setRevenueStats([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (viewType === "monthly") {
        const res = await fetchMonthlyRevenue(selectedRestaurantId, selectedYear);
        setRevenueStats(res?.data?.monthlyDetails?.map(item => ({
          month: `Tháng ${item.month}/${item.year}`,
          totalOrders: item.orderCount,
          totalRevenue: item.revenue,
        })) || []);
      } else if (viewType === "yearly") {
        const res = await fetchYearlyRevenue(selectedRestaurantId);
        setRevenueStats(res?.data?.yearlyDetails?.map(item => ({
          month: `Năm ${item.year}`,
          totalOrders: item.orderCount,
          totalRevenue: item.revenue,
        })) || []);
      } else if (viewType === "range") {
        if (startDate.year > endDate.year || (startDate.year === endDate.year && startDate.month > endDate.month)) {
          setError("Ngày bắt đầu phải trước ngày kết thúc.");
          setRevenueStats([]);
          return;
        }
        const startDateStr = `${startDate.year}-${formatMonth(startDate.month)}`;
        const endDateStr = `${endDate.year}-${formatMonth(endDate.month)}`;
        const res = await fetchMonthlyRevenueInRange(selectedRestaurantId, startDateStr, endDateStr);
        setRevenueStats(res?.data?.monthlyDetails?.map(item => ({
          month: `Tháng ${item.month}/${item.year}`,
          totalOrders: item.orderCount,
          totalRevenue: item.revenue,
        })) || []);
      }
    } catch (err) {
      setError("Không thể tải dữ liệu doanh thu: " + (err.response?.data?.message || err.message));
      setRevenueStats([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerLayout>
      <div className="dashboard-container">
        <div className="manager-header">
          <h2>Thống Kê Doanh Thu</h2>
        </div>
        <div className="top-actions">
          <div className="control-item">
            <label>Nhà hàng:</label>
            <select
              value={selectedRestaurantId || ""}
              onChange={(e) => setSelectedRestaurantId(e.target.value)}
              disabled={loading || !restaurants.length}
              className="select-input-custom"
            >
              <option value="" disabled>Chọn nhà hàng</option>
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div className="control-item">
            <label>Loại xem:</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              disabled={loading}
              className="form-input"
            >
              <option value="monthly">Theo tháng</option>
              <option value="yearly">Theo năm</option>
              <option value="range">Theo khoảng thời gian</option>
            </select>
          </div>
          {viewType === "monthly" && (
            <div className="control-item">
              <label>Năm:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                disabled={loading}
                className="form-input"
              >
                {getYearList().map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
          {viewType === "range" && (
            <>
              <div className="control-item">
                <label>Tháng/Năm bắt đầu:</label>
                <MonthPicker value={startDate} onChange={setStartDate} disabled={loading} />
              </div>
              <div className="control-item">
                <label>Tháng/Năm kết thúc:</label>
                <MonthPicker value={endDate} onChange={setEndDate} disabled={loading} />
              </div>
            </>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <div className="loading-spinner" style={{ textAlign: "center", padding: "20px" }}>
            <span>Đang tải...</span>
          </div>
        ) : revenueStats.length === 0 ? (
          <p style={{ textAlign: "center", padding: "20px" }}>Không có dữ liệu doanh thu để hiển thị.</p>
        ) : (
          <>
            <div className="chart-section">
              <h3>Biểu đồ doanh thu</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueStats}>
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      value >= 1000000
                        ? `${(value / 1000000).toFixed(1)}M`
                        : value >= 1000
                          ? `${(value / 1000).toFixed(1)}K`
                          : value.toString()
                    }
                    tick={{ fontSize: 12 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => [
                      value >= 1000000
                        ? `${(value / 1000000).toFixed(1)}M VND`
                        : value >= 1000
                          ? `${(value / 1000).toFixed(1)}K VND`
                          : `${value.toLocaleString()} VND`,
                      "Doanh thu"
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="totalRevenue" name="Doanh thu" fill="#0099FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="order-table">
              <h3>Chi tiết doanh thu</h3>
              <table>
                <thead>
                  <tr>
                    <th>Tháng/Năm</th>
                    <th>Số đơn hàng</th>
                    <th>Doanh thu (VND)</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueStats.map((item, index) => (
                    <tr key={index}>
                      <td>{item.month}</td>
                      <td>{item.totalOrders}</td>
                      <td>{item.totalRevenue ? item.totalRevenue.toLocaleString() : "0"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </OwnerLayout>
  );
};

export default OwnerRevenueDashboard;