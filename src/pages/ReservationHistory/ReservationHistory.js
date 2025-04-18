import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/ReservationHistory.css';

import restaurant1 from '../../assets/img/restaurant1.jpg';
// Giả lập dữ liệu đơn đặt bàn
const mockReservations = [
  {
    id: 1,
    restaurant: {
      image: restaurant1,
      name: 'Nhà hàng Phở Việt',
      address: '123 Đường Láng, Hà Nội',
    },
    status: 'Đã xác nhận',
    date: '2025-04-20',
  },
  {
    id: 2,
    restaurant: {
      image: restaurant1,
      name: 'Quán Bún Bò Huế',
      address: '456 Nguyễn Trãi, TP.HCM',
    },
    status: 'Đang chờ',
    date: '2025-04-22',
  },
  {
    id: 3,
    restaurant: {
      image: restaurant1,
      name: 'Sushi Nhật Bản',
      address: '789 Hai Bà Trưng, Đà Nẵng',
    },
    status: 'Đã hủy',
    date: '2025-04-18',
  },
];

const ReservationHistory = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    // Giả lập lấy dữ liệu đơn đặt bàn
    setReservations(mockReservations);
  }, []);

  return (
    <div className="reservation-history-container">
      <h2>Lịch sử đặt bàn</h2>
      {reservations.length > 0 ? (
        <table className="reservation-table">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên nhà hàng</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>
                  <img
                    src={reservation.restaurant.image}
                    alt={reservation.restaurant.name}
                    className="restaurant-images"
                  />
                </td>
                <td>{reservation.restaurant.name}</td>
                <td>{reservation.restaurant.address}</td>
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