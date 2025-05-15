import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Restaurant/ReservationHistory.css';
import { getCustomerOrders } from '../../services/orderService';

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm định dạng ngày thành dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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
            name: order.reservationSimpleResponse?.restaurantName || 'Không xác định',
          },
          status: order.status || 'Không xác định',
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

  if (loading) return <div className="text-center">Đang tải...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;

  return (
    <div className="reservation-history-container">
      <h2>Lịch sử đặt bàn</h2>
      {reservations.length > 0 ? (
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
            {reservations.map((reservation) => (
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
        <p>Chưa có đơn đặt bàn nào.</p>
      )}
    </div>
  );
};

export default ReservationHistory;