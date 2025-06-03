import React, { useState, useEffect } from 'react';
import { fetchAllSettlements, fetchSettlementsDetails, createSettlements, fetchSettledSettlements } from '../../services/settlementServices';
import AdminLayout from './AdminLayout';
import '../../assets/styles/admin/SettlementPage.css';

const SettlementPage = () => {
  // Hàm lấy filters dựa trên thời gian hiện tại
  const getCurrentFilters = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() trả về 0-11, cần +1
    const currentDay = currentDate.getDate();
    const defaultPeriodIndex = currentDay <= 15 ? 1 : 2;
    return {
      year: currentYear,
      month: currentMonth,
      periodIndex: defaultPeriodIndex,
    };
  };

  const [filters, setFilters] = useState(getCurrentFilters());
  const [restaurants, setRestaurants] = useState([]);
  const [settledRestaurants, setSettledRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('unsettled');

  // Kiểm tra và cập nhật filters mỗi ngày
  useEffect(() => {
    const checkDate = () => {
      const newFilters = getCurrentFilters();
      if (
        newFilters.year !== filters.year ||
        newFilters.month !== filters.month ||
        newFilters.periodIndex !== filters.periodIndex
      ) {
        setFilters(newFilters);
      }
    };

    const interval = setInterval(checkDate, 24 * 60 * 60 * 1000); // Kiểm tra mỗi 24 giờ
    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [filters]);

  // Tải dữ liệu khi viewMode hoặc filters thay đổi
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        if (viewMode === 'unsettled') {
          const response = await fetchAllSettlements();
          setRestaurants(Array.isArray(response) ? response : []);
        } else {
          const response = await fetchSettledSettlements(filters.year, filters.month, filters.periodIndex);
          setSettledRestaurants(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        console.error('Lỗi tải dữ liệu:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
        viewMode === 'unsettled' ? setRestaurants([]) : setSettledRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [viewMode, filters]);

  const handleSettle = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleFilterApply = () => {
    setViewMode(viewMode);
  };

  if (isLoading) return <AdminLayout><div>Đang tải...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="settlement-page">
        <h1>Đối Soát và Thanh Toán</h1>
        <div className="view-toggle">
          <button
            className={viewMode === 'unsettled' ? 'active' : ''}
            onClick={() => setViewMode('unsettled')}
          >
            Chưa tất toán
          </button>
          <button
            className={viewMode === 'settled' ? 'active' : ''}
            onClick={() => setViewMode('settled')}
          >
            Đã tất toán
          </button>
        </div>
        {viewMode === 'settled' && (
          <div className="filters">
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <select
              value={filters.month}
              onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <select
              value={filters.periodIndex}
              onChange={(e) => setFilters({ ...filters, periodIndex: e.target.value })}
            >
              <option value="1">Quý 1 (15 ngày đầu)</option>
              <option value="2">Quý 2 (15 ngày cuối)</option>
            </select>
            <button onClick={handleFilterApply}>Áp dụng</button>
          </div>
        )}
        {error && <div className="error">{error}</div>}
        {viewMode === 'unsettled' ? (
          <table>
            <thead>
              <tr>
                <th>Tên Nhà Hàng</th>
                <th>Địa Chỉ</th>
                <th>SĐT</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.length === 0 ? (
                <tr>
                  <td colSpan="4">Không có nhà hàng nào cần tất toán</td>
                </tr>
              ) : (
                restaurants.map((restaurant) => (
                  <tr key={restaurant.restaurantId}>
                    <td>{restaurant.restaurantName}</td>
                    <td>{restaurant.address}</td>
                    <td>{restaurant.phoneNumber}</td>
                    <td>
                      <button onClick={() => handleSettle(restaurant)}>Quyết toán</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Tên Nhà Hàng</th>
                <th>Địa Chỉ</th>
                <th>Số Tiền</th>
                <th>Ghi Chú</th>
                <th>Ngày Bắt Đầu</th>
                <th>Ngày Kết Thúc</th>
              </tr>
            </thead>
            <tbody>
              {settledRestaurants.length === 0 ? (
                <tr>
                  <td colSpan="6">Không có nhà hàng nào đã tất toán</td>
                </tr>
              ) : (
                settledRestaurants.map((restaurant, index) => (
                  <tr key={index}>
                    <td>{restaurant.restaurantName}</td>
                    <td>{restaurant.address}</td>
                    <td>{restaurant.amount.toLocaleString()} VND</td>
                    <td>{restaurant.note}</td>
                    <td>{restaurant.startDate}</td>
                    <td>{restaurant.endDate}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        {selectedRestaurant && (
          <SettlementModal
            restaurant={selectedRestaurant}
            onClose={() => setSelectedRestaurant(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// SettlementModal giữ nguyên
const SettlementModal = ({ restaurant, onClose }) => {
  const [details, setDetails] = useState(null);
  const [note, setNote] = useState(`Đã thanh toán quý 2 cho nhà hàng ID ${restaurant.restaurantId}`);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setError(null);
        const response = await fetchSettlementsDetails(restaurant.restaurantId);
        setDetails(response.data);
      } catch (error) {
        console.error('Lỗi tải chi tiết tất toán:', error);
        setError('Không thể tải chi tiết tất toán. Vui lòng thử lại.');
      }
    };
    loadDetails();
  }, [restaurant.restaurantId]);

  const handleConfirm = async () => {
    try {
      setError(null);
      await createSettlements({
        restaurantId: restaurant.restaurantId,
        amount: details.amountToSettle,
        note,
      });
      onClose();
    } catch (error) {
      console.error('Lỗi xác nhận tất toán:', error);
      setError('Lỗi khi xác nhận tất toán. Vui lòng thử lại.');
    }
  };

  if (!details && !error) return <div>Đang tải...</div>;
  if (error) return <div className="modal error">{error}</div>;

  return (
    <div className="modal">
      <h2>Quyết Toán cho {details.restaurantName}</h2>
      <p>Ngân Hàng: {details.bankName}</p>
      <p>Chủ Tài Khoản: {details.accountHolderName}</p>
      <p>Số Tài Khoản: {details.accountNumber}</p>
      <p>Số Tiền: {details.amountToSettle.toLocaleString()} VND</p>
      <p>Tổng Đơn Hàng: {details.totalOrders}</p>
      <p>Tổng Doanh Thu: {details.totalRevenue.toLocaleString()} VND</p>
      <p>Phí Nền Tảng: {details.platformFee.toLocaleString()} VND</p>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      {error && <div className="error">{error}</div>}
      <button onClick={onClose}>Hủy</button>
      <button onClick={handleConfirm}>Xác Nhận</button>
    </div>
  );
};

export default SettlementPage;