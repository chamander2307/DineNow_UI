import React, { useEffect, useState } from "react";
import {
  fetchMonthlyRestaurantProfits,
  fetchTotalRestaurantProfits,
  fetchRangeRestaurantProfits,
} from "../../services/adminService";
import AdminLayout from "./AdminLayout";
import MonthPicker from "../../components/admin/MonthPicker";
import "../../assets/styles/admin/ProfitManager.css";

const MAX_RESTAURANTS = 10;

const ProfitManager = () => {
  const [viewType, setViewType] = useState("monthly");
  const [monthlyProfits, setMonthlyProfits] = useState(null);
  const [totalProfits, setTotalProfits] = useState(null);
  const [rangeProfits, setRangeProfits] = useState(null);
  const [yearMonth, setYearMonth] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, "0")}`;
  });
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterName, setFilterName] = useState("");

  // Hàm helper để set message và tự động xóa sau 3 giây
  const showMessage = (msg) => {
    setMessage(msg);
  };

  // Tự động xóa message sau 3 giây
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage("");
      }, 3000); // 3 giây
      return () => clearTimeout(timeout); // Dọn dẹp timeout khi message thay đổi hoặc component unmount
    }
  }, [message]);

  const parseMonthString = (monthStr) => {
    if (!monthStr) return { year: new Date().getFullYear(), month: new Date().getMonth() + 1 };
    const [year, month] = monthStr.split("-").map(Number);
    return { year, month };
  };

  const loadMonthlyProfits = async () => {
    if (!yearMonth) {
      showMessage("Vui lòng chọn tháng");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchMonthlyRestaurantProfits(yearMonth);
      setMonthlyProfits(res);
      setTotalProfits(null);
      setRangeProfits(null);
      showMessage("Tải lợi nhuận tháng thành công");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching monthly profits:", err);
      showMessage("Không thể tải lợi nhuận tháng");
      setMonthlyProfits(null);
    } finally {
      setLoading(false);
    }
  };

  const loadTotalProfits = async () => {
    setLoading(true);
    try {
      const res = await fetchTotalRestaurantProfits();
      setTotalProfits(res);
      setMonthlyProfits(null);
      setRangeProfits(null);
      showMessage("Tải tổng lợi nhuận thành công");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching total profits:", err);
      showMessage("Không thể tải tổng lợi nhuận");
      setTotalProfits(null);
    } finally {
      setLoading(false);
    }
  };

  const loadRangeProfits = async () => {
    if (!startMonth || !endMonth) {
      showMessage("Vui lòng chọn khoảng thời gian");
      return;
    }
    const startDate = new Date(startMonth);
    const endDate = new Date(endMonth);
    if (startDate > endDate) {
      showMessage("Tháng bắt đầu phải trước tháng kết thúc");
      return;
    }
    setLoading(true);
    try {
      const res = await fetchRangeRestaurantProfits(startMonth, endMonth);
      setRangeProfits(res);
      setMonthlyProfits(null);
      setTotalProfits(null);
      showMessage("Tải lợi nhuận khoảng thời gian thành công");
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching range profits:", err);
      showMessage("Không thể tải lợi nhuận khoảng thời gian");
      setRangeProfits(null);
    } finally {
      setLoading(false);
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
    showMessage("");
    setCurrentPage(1);
    setFilterName("");
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterName(e.target.value);
    setCurrentPage(1);
  };

  const currentProfits = viewType === "monthly" ? monthlyProfits : viewType === "total" ? totalProfits : rangeProfits;
  const profitDetails = currentProfits?.monthlyProfitDetails || currentProfits?.totalProfitDetails || [];

  // Tính tổng platformFee (nếu có)
  const totalPlatformFee = profitDetails.reduce((sum, item) => {
    return sum + (item.feePerGuest || 0) * (item.totalGuests || 0);
  }, 0);

  const filteredDetails = profitDetails
    .filter((item) => item.restaurantName.toLowerCase().includes(filterName.toLowerCase()))
    .sort((a, b) => {
      const profitA = viewType === "monthly" ? a.profit : a.totalProfit || a.profit || 0;
      const profitB = viewType === "monthly" ? b.profit : b.totalProfit || b.profit || 0;
      return sortOrder === "desc" ? profitB - profitA : profitA - profitB;
    });

  const totalPages = Math.ceil(filteredDetails.length / MAX_RESTAURANTS);
  const paginatedDetails = filteredDetails.slice(
    (currentPage - 1) * MAX_RESTAURANTS,
    currentPage * MAX_RESTAURANTS
  );

  return (
    <AdminLayout>
      <div className="profit-manager">
        <h2>Quản lý lợi nhuận</h2>
        {message && <p className={`message ${message.includes("thành công") ? "success" : "error"}`}>{message}</p>}

        <div className="view-selector">
          <label htmlFor="viewType">Chọn chế độ xem: </label>
          <select id="viewType" value={viewType} onChange={handleViewChange} disabled={loading}>
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
                onChange={({ year, month }) => setYearMonth(`${year}-${month.toString().padStart(2, "0")}`)}
                disabled={loading}
              />
              <button onClick={loadMonthlyProfits} disabled={loading}>
                Tìm kiếm
              </button>
            </>
          )}
          {viewType === "range" && (
            <>
              <MonthPicker
                value={parseMonthString(startMonth)}
                onChange={({ year, month }) => setStartMonth(`${year}-${month.toString().padStart(2, "0")}`)}
                disabled={loading}
              />
              <MonthPicker
                value={parseMonthString(endMonth)}
                onChange={({ year, month }) => setEndMonth(`${year}-${month.toString().padStart(2, "0")}`)}
                disabled={loading}
              />
              <button onClick={loadRangeProfits} disabled={loading}>
                Tìm kiếm
              </button>
            </>
          )}
        </div>

        <div className="pagination-container">
          <input
            type="text"
            placeholder="Lọc theo tên nhà hàng"
            value={filterName}
            onChange={handleFilterChange}
            className="filter-input"
          />
          <select value={sortOrder} onChange={handleSortChange} className="sort-select">
            <option value="desc">Sắp xếp: Lợi nhuận giảm dần</option>
            <option value="asc">Sắp xếp: Lợi nhuận tăng dần</option>
          </select>
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : currentProfits && typeof currentProfits.totalProfit === "number" ? (
          <div className="profit-section">
            <h3>
              {viewType === "monthly"
                ? "Lợi nhuận theo tháng"
                : viewType === "total"
                ? "Tổng lợi nhuận từ khi tham gia"
                : "Lợi nhuận theo khoảng thời gian"}
            </h3>
            <p className="highlight-total">Tổng lợi nhuận: {currentProfits.totalProfit.toLocaleString()} VND</p>
            <b className="highlight-total">Tổng phí nền tảng: {totalPlatformFee.toLocaleString()} VND</b>

            {/* Bảng dữ liệu */}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên nhà hàng</th>
                  <th>Tổng khách</th>
                  <th>Giá tiền</th>
                  <th>Tổng đơn hàng</th>
                  <th>Lợi nhuận</th>
                  <th>Tỷ lệ (%)</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDetails.map((item) => (
                  <tr key={item.restaurantName}>
                    <td>{item.restaurantName}</td>
                    <td>{item.totalGuests}</td>
                    <td className="highlight-fee">{(item.feePerGuest || 0).toLocaleString()} VND</td>
                    <td>{item.totalOrders}</td>
                    <td>
                      {(viewType === "monthly" ? item.profit : item.totalProfit || item.profit || 0).toLocaleString()} VND
                    </td>
                    <td>
                      {currentProfits.totalProfit
                        ? (
                            ((viewType === "monthly" ? item.profit : item.totalProfit || item.profit) /
                              currentProfits.totalProfit) *
                            100
                          ).toFixed(2)
                        : "0.00"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Phân trang */}
            {filteredDetails.length > MAX_RESTAURANTS && (
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Trang sau
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Không có dữ liệu lợi nhuận để hiển thị.</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProfitManager;