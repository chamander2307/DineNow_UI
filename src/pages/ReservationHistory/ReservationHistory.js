import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Restaurant/ReservationHistory.css';
import { getCustomerOrders } from '../../services/orderService';

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const localizeStatus = (status) => {
    const statusMap = {
      PENDING: 'Đang chờ',
      PAID: 'Đã thanh toán',
      COMPLETED: 'Hoàn thành',
      CONFIRMED: 'Đã xác nhận',
      CANCELLED: 'Đã hủy',
      FAILED: 'Thất bại',
      'Không xác định': 'Không xác định',
    };
    const localized = statusMap[status] || statusMap['Không xác định'];
    console.log(`Localized status for ${status}: ${localized}`); // Debug
    return localized;
  };

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getCustomerOrders();
        console.log('Raw API Response:', response);
        const data = response.data || [];

        console.log('API Response:', data);

        const formattedReservations = data.map(order => ({
          id: order.id,
          restaurant: {
            name: order.restaurants?.name || 'Không xác định',
          },
          status: localizeStatus(order.status || 'Không xác định'),
          date: formatDate(order.reservationSimpleResponse?.reservationTime),
          totalPrice: order.totalPrice || 0,
        }));

        setReservations(formattedReservations);
      } catch (err) {
        setError('Lỗi khi tải lịch sử đặt bàn: ' + err.message);
        console.error('Lỗi khi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const uniqueRestaurants = [
    { name: 'Tất cả', value: '' },
    ...Array.from(new Set(reservations.map(r => r.restaurant.name)))
      .filter(name => name !== 'Không xác định')
      .map(name => ({ name, value: name })),
  ];

  const uniqueStatuses = [
    { name: 'Tất cả', value: '' },
    ...Array.from(new Set(reservations.map(r => r.status)))
      .filter(status => status !== 'Không xác định')
      .map(status => ({ name: status, value: status })),
  ];

  const filteredReservations = reservations.filter(r => {
    const matchesRestaurant = selectedRestaurant ? r.restaurant.name === selectedRestaurant : true;
    const matchesStatus = selectedStatus ? r.status === selectedStatus : true;
    return matchesRestaurant && matchesStatus;
  });

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="reservation-history-container">
      <h2>Lịch sử đặt bàn</h2>
      <div className="filter-section">
        <div className="filter-group">
          <select
            id="restaurantFilter"
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="restaurant-filter"
          >
            {uniqueRestaurants.map((restaurant) => (
              <option key={restaurant.value} value={restaurant.value}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <select
            id="statusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="status-filter"
          >
            {uniqueStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredReservations.length > 0 ? (
        <table className="reservation-table">
          <thead>
            <tr>
              <th>Tên nhà hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.restaurant.name}</td>
                <td>{reservation.date}</td>
                <td>{reservation.totalPrice.toLocaleString('vi-VN')} VNĐ</td>
                <td>
                  <span className={`status ${reservation.status.replace(' ', '-').toLowerCase()}`}>
                    {reservation.status}
                  </span>
                </td>
                <td>
                  <Link to={`/reservation/${reservation.id}`} className="action-btn">
                    Xem chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Chưa có đơn đặt bàn nào phù hợp với bộ lọc.</p>
      )}
    </div>
  );
};

export default ReservationHistory;