import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import '../../assets/styles/Restaurant/ReservationDetail.css';
import { getCustomerOrders, cancelOrder } from '../../services/orderService';
import { createPaymentUrl } from '../../services/paymentService';
import restaurant1 from '../../assets/img/restaurant1.jpg';

// Hàm định dạng ngày và giờ
const formatDate = (dateString) => {
  if (!dateString) return 'Chưa xác định';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatTime = (timeString) => {
  if (!timeString) return 'Chưa xác định';
  const date = new Date(timeString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ReservationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(queryParams.get('paymentStatus') || null);
  const [latestPayment, setLatestPayment] = useState(null);

  const fetchReservationDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomerOrders();
      console.log('Raw API Response:', response);

      const data = response.data || [];
      if (!data.length) {
        throw new Error('Không tìm thấy đơn đặt bàn');
      }

      const order = data.find(item => item.id === parseInt(id));
      if (!order) {
        throw new Error('Không tìm thấy đơn đặt bàn với ID này');
      }

      const mappedReservation = {
        id: order.id,
        totalAmount: order.totalPrice || 0,
        status: order.status || 'Không xác định',
        dishes: (order.menuItems || []).map(item => ({
          id: item.menuItemId || '',
          name: item.menuItemName || 'Món không xác định',
          price: item.menuItemPrice || 0,
          quantity: item.quantity || 0,
          image: item.menuItemImageUrl || restaurant1,
        })),
        restaurant: {
          thumbnail: order.restaurants?.thumbnailUrl ? order.restaurants.thumbnailUrl : restaurant1,
          name: order.restaurants?.name || 'Nhà hàng không xác định',
          address: order.restaurants?.address || 'Chưa có địa chỉ',
        },
        date: order.reservationSimpleResponse?.reservationTime,
        time: order.reservationSimpleResponse?.reservationTime,
        guests: (order.reservationSimpleResponse?.numberOfPeople || 0) + (order.reservationSimpleResponse?.numberOfChild || 0),
        payments: order.payments || [], // Quay lại sử dụng payments từ getCustomerOrders
        numberOfAdults: order.reservationSimpleResponse?.numberOfPeople || 0,
        numberOfChildren: order.reservationSimpleResponse?.numberOfChild || 0,
        note: order.note || '',
      };

      setReservation(mappedReservation);
      console.log('Reservation Data:', mappedReservation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservationDetail();
  }, [id]);

  useEffect(() => {
    console.log('Payment Status from URL:', paymentStatus);
    if (paymentStatus) {
      if (paymentStatus === 'SUCCESS') {
        alert('Thanh toán thành công! Cảm ơn bạn đã đặt bàn.');
        setLatestPayment({
          method: 'VNPAY',
          amount: reservation?.totalAmount || 0,
          status: 'SUCCESS',
          transaction_id: queryParams.get('transaction_id') || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        fetchReservationDetail();
      } else if (paymentStatus === 'FAILED') {
        alert('Thanh toán thất bại. Vui lòng thử lại.');
        setLatestPayment({
          method: 'VNPAY',
          amount: reservation?.totalAmount || 0,
          status: 'FAILED',
          transaction_id: queryParams.get('transaction_id') || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        fetchReservationDetail();
      }
      setPaymentStatus(null);
    }
  }, [paymentStatus, reservation?.totalAmount]);

  const handleCancelOrder = async () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      setCancelLoading(true);
      try {
        const response = await cancelOrder(id);
        if (response.data === true || (response.data && response.data.data === true)) {
          alert('Hủy đơn hàng thành công!');
          navigate('/reservation-history');
        } else {
          throw new Error('Không thể hủy đơn hàng. Đơn hàng đã được xác nhận hoặc có lỗi xảy ra.');
        }
      } catch (err) {
        alert(`Lỗi khi hủy đơn hàng: ${err.message}`);
      } finally {
        setCancelLoading(false);
      }
    }
  };

  const handleRebook = () => {
    if (reservation && (reservation.status === 'FAILED' || reservation.status === 'CANCELLED')) {
      const rebookData = {
        selectedItems: reservation.dishes.map(dish => ({
          id: dish.id,
          name: dish.name,
          quantity: dish.quantity,
          price: dish.price,
        })),
        restaurant: {
          name: reservation.restaurant.name,
          address: reservation.restaurant.address,
          image: reservation.restaurant.thumbnail || restaurant1,
        },
      };
      navigate('/order', { state: { isRebook: true, ...rebookData } });
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    setError('');

    try {
      const paymentUrl = await createPaymentUrl(id);
      console.log('Payment URL:', paymentUrl);
      window.location.href = paymentUrl;
    } catch (err) {
      setError('Lỗi khi tạo liên kết thanh toán: ' + err.message);
      console.error('Lỗi khi tạo thanh toán:', err);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="reservation-detail-container">
        <h2>Đang tải...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reservation-detail-container">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <Link to="/reservation-history" className="back-btn">
          Quay lại
        </Link>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="reservation-detail-container">
        <h2>Không tìm thấy đơn đặt bàn</h2>
        <Link to="/reservation-history" className="back-btn">
          Quay lại
        </Link>
      </div>
    );
  }

  return (
    <div className="reservation-detail-container">
      <h2>Chi tiết đơn đặt bàn #{reservation.id}</h2>

      {/* Thông tin nhà hàng */}
      <div className="restaurant-info">
        <img
          src={reservation.restaurant.thumbnail || restaurant1}
          alt={reservation.restaurant.name || 'Nhà hàng'}
          className="restaurant-thumbnail"
          onError={(e) => { e.target.src = restaurant1; }}
        />
        <div className="restaurant-details">
          <h3>{reservation.restaurant.name}</h3>
          <p><strong>Địa chỉ:</strong> {reservation.restaurant.address}</p>
          <p><strong>Ngày đặt:</strong> {formatDate(reservation.date)}</p>
          <p><strong>Giờ đặt:</strong> {formatTime(reservation.time)}</p>
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
                      src={dish.image || restaurant1}
                      alt={dish.name || 'Món ăn'}
                      className="dish-imagess"
                      onError={(e) => { e.target.src = restaurant1; }}
                    />
                  </td>
                  <td>{dish.name}</td>
                  <td>{dish.quantity}</td>
                  <td>{(dish.price || 0).toLocaleString('vi-VN')} VNĐ</td>
                  <td>{((dish.quantity || 0) * (dish.price || 0)).toLocaleString('vi-VN')} VNĐ</td>
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
        <p><strong>Tổng tiền:</strong> {(reservation.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</p>
        {(reservation.payments.length > 0 || latestPayment) && (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Hình thức thanh toán</th>
                <th>Số tiền thanh toán</th>
                <th>Transaction ID</th>
                <th>Trạng thái</th>
                <th>Thời gian tạo</th>
                <th>Thời gian cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {reservation.payments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.method || 'Chưa xác định'}</td>
                  <td>{(payment.amount || 0).toLocaleString('vi-VN')} VNĐ</td>
                  <td>{payment.transaction_id || 'Chưa có'}</td>
                  <td>
                    <span className={`payment-status ${payment.status?.toLowerCase() || ''}`}>
                      {payment.status || 'Chưa xác định'}
                    </span>
                  </td>
                  <td>{formatDate(payment.created_at) + ' ' + formatTime(payment.created_at)}</td>
                  <td>{formatDate(payment.updated_at) + ' ' + formatTime(payment.updated_at)}</td>
                </tr>
              ))}
              {latestPayment && (
                <tr>
                  <td>{latestPayment.method}</td>
                  <td>{latestPayment.amount.toLocaleString('vi-VN')} VNĐ</td>
                  <td>{latestPayment.transaction_id || 'Chưa có'}</td>
                  <td>
                    <span className={`payment-status ${latestPayment.status.toLowerCase()}`}>
                      {latestPayment.status}
                    </span>
                  </td>
                  <td>{formatDate(latestPayment.created_at) + ' ' + formatTime(latestPayment.created_at)}</td>
                  <td>{formatDate(latestPayment.updated_at) + ' ' + formatTime(latestPayment.updated_at)}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {!reservation.payments.length && !latestPayment && (
          <p>Chưa có thông tin thanh toán.</p>
        )}
      </div>

      {/* Nút hủy, thanh toán, đặt lại và quay lại */}
      <div className="button-section">
        {reservation.status === 'PENDING' && (
          <>
            <button
              onClick={handleCancelOrder}
              className="cancel-btn111"
              disabled={cancelLoading}
            >
              {cancelLoading ? 'Đang hủy...' : 'Hủy đơn hàng'}
            </button>
            {!reservation.payments.some(payment => payment.status === 'SUCCESS') && (
              <button
                onClick={handlePayment}
                className="payment-btn"
                disabled={paymentLoading}
              >
                {paymentLoading ? 'Đang xử lý...' : 'Thanh toán'}
              </button>
            )}
          </>
        )}
        {(reservation.status === 'FAILED' || reservation.status === 'CANCELLED') && (
          <button
            onClick={handleRebook}
            className="rebook-btn"
          >
            Đặt bàn lại
          </button>
        )}
        <Link to="/reservation-history" className="back-btn111">
          Quay lại
        </Link>
      </div>
    </div>
  );
};

export default ReservationDetail;