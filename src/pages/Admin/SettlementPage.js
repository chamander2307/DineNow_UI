import React, { useState, useEffect } from 'react';
import { fetchAllSettlements, fetchSettlementsDetails, createSettlements } from '../../services/settlementServices';
import AdminLayout from './AdminLayout';
import '../../assets/styles/admin/SettlementPage.css'; 

const SettlementPage = () => {
  const [filters, setFilters] = useState({ year: 2025, month: 5, periodIndex: 2 });
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchAllSettlements();
        setRestaurants(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Lỗi tải danh sách nhà hàng:', error);
        setError('Không thể tải danh sách nhà hàng. Vui lòng thử lại.');
        setRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadRestaurants();
  }, []);

  const handleSettle = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  if (isLoading) return <AdminLayout><div>Đang tải...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="settlement-page">
        <h1>Đối Soát và Thanh Toán</h1>
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
          <button>Áp dụng</button>
        </div>
        {error && <div className="error">{error}</div>}
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
      <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      {error && <div className="error">{error}</div>}
      <button onClick={onClose}>Hủy</button>
      <button onClick={handleConfirm}>Xác Nhận</button>
    </div>
  );
};

export default SettlementPage;