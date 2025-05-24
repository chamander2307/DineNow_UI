import React, { useEffect, useState } from "react";
import {
  fetchMonthlyRestaurantProfits,
  fetchTotalRestaurantProfits,
  fetchRangeRestaurantProfits,
} from "../../services/adminService";
import AdminLayout from "./AdminLayout";
import MonthPicker from "../../components/admin/MonthPicker";
import "../../assets/styles/admin/ProfitManager.css";

const ProfitManager = () => {
  const [viewType, setViewType] = useState("monthly");
  const [monthlyProfits, setMonthlyProfits] = useState(null);
  const [totalProfits, setTotalProfits] = useState(null);
  const [rangeProfits, setRangeProfits] = useState(null);
  const [yearMonth, setYearMonth] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, '0')}`;
  });
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [message, setMessage] = useState("");

  const parseMonthString = (monthStr) => {
    if (!monthStr) return { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
    const [year, month] = monthStr.split('-').map(Number);
    return { year, month };
  };

  const loadMonthlyProfits = async () => {
    if (!yearMonth) {
      setMessage("Vui lòng chọn tháng");
      return;
    }
    try {
      const res = await fetchMonthlyRestaurantProfits(yearMonth);
      console.log("Monthly profits response:", res);
      setMonthlyProfits(res);
      setTotalProfits(null);
      setRangeProfits(null);
      setMessage("Tải lợi nhuận tháng thành công");
    } catch (err) {
      console.error("Error fetching monthly profits:", err);
      setMessage("Không thể tải lợi nhuận tháng");
      setMonthlyProfits(null);
    }
  };

  const loadTotalProfits = async () => {
    try {
      const res = await fetchTotalRestaurantProfits();
      console.log("Total profits response:", res);
      setTotalProfits(res);
      setMonthlyProfits(null);
      setRangeProfits(null);
      setMessage("Tải tổng lợi nhuận thành công");
    } catch (err) {
      console.error("Error fetching total profits:", err);
      setMessage("Không thể tải tổng lợi nhuận");
      setTotalProfits(null);
    }
  };

  const loadRangeProfits = async () => {
    if (!startMonth || !endMonth) {
      setMessage("Vui lòng chọn khoảng thời gian");
      return;
    }
    console.log("startMonth:", startMonth, "endMonth:", endMonth);
    const startDate = new Date(startMonth);
    const endDate = new Date(endMonth);
    console.log("startDate:", startDate, "endDate:", endDate);
    if (startDate > endDate) {
      setMessage("Tháng bắt đầu phải trước tháng kết thúc");
      return;
    }
    try {
      const res = await fetchRangeRestaurantProfits(startMonth, endMonth);
      console.log("Range profits response:", res);
      setRangeProfits(res);
      setMonthlyProfits(null);
      setTotalProfits(null);
      setMessage("Tải lợi nhuận khoảng thời gian thành công");
    } catch (err) {
      console.error("Error fetching range profits:", err);
      setMessage("Không thể tải lợi nhuận khoảng thời gian");
      setRangeProfits(null);
    }
  };

  useEffect(() => {
    if (viewType === "monthly") {
      loadMonthlyProfits();
    } else if (viewType === "total") {
      loadTotalProfits();
    } else if (viewType === "range" && startMonth && endMonth) {
      loadRangeProfits();
    }
  }, [viewType, yearMonth, startMonth, endMonth]);

  const handleViewChange = (e) => {
    setViewType(e.target.value);
    setMessage("");
  };

  const currentProfits = viewType === "monthly" ? monthlyProfits : viewType === "total" ? totalProfits : rangeProfits;
  const profitDetails = currentProfits?.monthlyProfitDetails || currentProfits?.totalProfitDetails || [];

  return (
    <AdminLayout>
      <div className="profit-manager">
        <h2>Quản lý lợi nhuận</h2>
        {message && <p className="message">{message}</p>}

        <div className="view-selector">
          <label htmlFor="viewType">Chọn chế độ xem: </label>
          <select id="viewType" value={viewType} onChange={handleViewChange}>
            <option value="monthly">Lợi nhuận theo tháng</option>
            <option value="total">Tổng lợi nhuận từ khi tham gia</option>
            <option value="range">Lợi nhuận theo khoảng thời gian</option>
          </select>
        </div>

        <div className="time-inputs">
          {viewType === "monthly" && (
            <>
              <MonthPicker
                value={parseMonthString(yearMonth)}
                onChange={({ year, month }) => setYearMonth(`${year}-${month.toString().padStart(2, '0')}`)}
              />
              <button onClick={loadMonthlyProfits}>Tìm kiếm</button>
            </>
          )}
          {viewType === "range" && (
            <>
              <MonthPicker
                value={parseMonthString(startMonth)}
                onChange={({ year, month }) => setStartMonth(`${year}-${month.toString().padStart(2, '0')}`)}
              />
              <MonthPicker
                value={parseMonthString(endMonth)}
                onChange={({ year, month }) => setEndMonth(`${year}-${month.toString().padStart(2, '0')}`)}
              />
              <button onClick={loadRangeProfits}>Tìm kiếm</button>
            </>
          )}
        </div>

        {currentProfits && currentProfits.totalProfit !== undefined && (
          <div className="profit-section">
            <h3>
              {viewType === "monthly" ? "Lợi nhuận theo tháng" : viewType === "total" ? "Tổng lợi nhuận từ khi tham gia" : "Lợi nhuận theo khoảng thời gian"}
            </h3>
            <p>Tổng lợi nhuận: {currentProfits.totalProfit.toLocaleString()} VND</p>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên nhà hàng</th>
                  <th>Tổng khách</th>
                  <th>Tổng đơn hàng</th>
                  <th>Lợi nhuận</th>
                </tr>
              </thead>
              <tbody>
                {profitDetails.map((item) => (
                  <tr key={item.restaurantName}>
                    <td>{item.restaurantName}</td>
                    <td>{item.totalGuests}</td>
                    <td>{item.totalOrders}</td>
                    <td>{(viewType === "monthly" ? item.profit : item.totalProfit || 0).toLocaleString()} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {currentProfits && currentProfits.totalProfit === undefined && (
          <p>Không có dữ liệu lợi nhuận để hiển thị.</p>
        )}
        {!currentProfits && <p>Đang tải dữ liệu...</p>}
      </div>
    </AdminLayout>
  );
};

export default ProfitManager;