import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../assets/styles/ReservationDetail.css';

import restaurant1 from '../../assets/img/restaurant1.jpg';
// Giả lập dữ liệu chi tiết đơn đặt bàn
const mockReservationDetail = {
  id: 1,
  restaurant: {
    thumbnail: restaurant1,
    name: 'Nhà hàng Phở Việt',
    address: '123 Đường Láng, Hà Nội',
  },
  dishes: [
    {
      id: 1,
      image: restaurant1,
      name: 'Phở Bò Tái',
      quantity: 2,
      price: 60000,
    },
    {
      id: 2,
      image: restaurant1,
      name: 'Nước Sâm',
      quantity: 3,
      price: 15000,
    },
  ],
  totalAmount: 165000,
  payments: [
    {
      method: 'VNPay',
      amount: 100000,
      status: 'Thành công',
    },
    {
      method: 'Thanh toán trực tiếp',
      amount: 65000,
      status: 'Thành công',
    },
  ],
  date: '2025-04-20',
  time: '18:00',
  guests: 4,
};

const ReservationDetail = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    // Giả lập lấy dữ liệu chi tiết đơn đặt bàn
    // Ở đây có thể gọi API thực tế: fetch(`http://your-api/reservations/${id}`)
    const fetchedReservation = { ...mockReservationDetail, id };
    setReservation(fetchedReservation);
  }, [id]);

  if (!reservation) {
    return (
      <div className="reservation-detail-container">
        <h2>Đang tải...</h2>
      </div>
    );
  }

  return (
    <div className="reservation-detail-container">
      <h2>Chi tiết đơn đặt bàn #{reservation.id}</h2>

      {/* Thông tin nhà hàng */}
      <div className="restaurant-info">
        <img
          src={reservation.restaurant.thumbnail}
          alt={reservation.restaurant.name}
          className="restaurant-thumbnail"
        />
        <div className="restaurant-details">
          <h3>{reservation.restaurant.name}</h3>
          <p><strong>Địa chỉ:</strong> {reservation.restaurant.address}</p>
          <p><strong>Ngày đặt:</strong> {reservation.date}</p>
          <p><strong>Giờ đặt:</strong> {reservation.time}</p>
          <p><strong>Số khách:</strong> {reservation.guests}</p>
        </div>
      </div>

      {/* Danh sách món ăn đã đặt */}
      <div className="dishes-section">
        <h3>Danh sách món ăn đã đặt</h3>
        {reservation.dishes.length > 0 ? (
          <table className="dishes-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên món</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {reservation.dishes.map((dish) => (
                <tr key={dish.id}>
                  <td>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="dish-imagess"
                    />
                  </td>
                  <td>{dish.name}</td>
                  <td>{dish.quantity}</td>
                  <td>{dish.price.toLocaleString('vi-VN')} VNĐ</td>
                  <td>{(dish.quantity * dish.price).toLocaleString('vi-VN')} VNĐ</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có món ăn nào được đặt.</p>
        )}
      </div>

      {/* Thông tin thanh toán dạng bảng */}
      <div className="payment-section">
        <h3>Thông tin thanh toán</h3>
        <p><strong>Tổng tiền:</strong> {reservation.totalAmount.toLocaleString('vi-VN')} VNĐ</p>
        {reservation.payments && reservation.payments.length > 0 ? (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Hình thức thanh toán</th>
                <th>Số tiền thanh toán</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {reservation.payments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.method}</td>
                  <td>{payment.amount.toLocaleString('vi-VN')} VNĐ</td>
                  <td>
                    <span className={`payment-status ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có thông tin thanh toán.</p>
        )}
      </div>

      {/* Nút quay lại */}
      <Link to="/reservation-history" className="back-btn">
        Quay lại
      </Link>
    </div>
  );
};

export default ReservationDetail;