import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/Restaurant/PaymentPage.css';
import { createPaymentUrl } from '../../services/paymentService';
import restaurant1 from '../../assets/img/restaurant1.jpg';

// Dữ liệu giả lập (dùng khi không có dữ liệu từ API)
const mockRestaurant = {
  name: 'Nhà hàng B',
  address: '456 Đường Ẩm Thực, TP. HCM',
  image: restaurant1,
};

const mockOrder = {
  id: '12345', // Giả định orderId từ email
  reservationTime: '2025-05-23T14:30:00Z', // Đồng bộ với thời gian giao trong email
  numberOfPeople: 4,
  numberOfChild: 2,
  dishes: [
    { id: '4', name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, quantity: 1 },
    { id: '5', name: 'Cơm Thố Gà + Ốp La', price: 37000, quantity: 1 },
    { id: '7', name: 'Coca Cola', price: 11000, quantity: 1 },
  ],
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy orderId từ query params (từ đường dẫn email)
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId') || mockOrder.id;

  // State để lưu thông tin đơn hàng
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(mockRestaurant);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(queryParams.get('paymentStatus') || null); // Khởi tạo từ callback

  // Tính tổng tiền
  const totalPrice = order?.dishes?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  // Lấy thông tin đơn hàng dựa trên orderId
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // Giả định gọi API để lấy thông tin đơn hàng đã xác nhận
        // const response = await getOrderDetails(orderId);
        // const data = response.data;

        // Dữ liệu giả lập thay thế cho API (đơn hàng đã xác nhận)
        const data = mockOrder;

        setOrder({
          id: data.id,
          reservationTime: data.reservationTime,
          numberOfPeople: data.numberOfPeople,
          numberOfChild: data.numberOfChild,
          dishes: data.dishes.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price) || 0,
          })),
        });

        setRestaurant(mockRestaurant);
      } catch (err) {
        setError('Lỗi khi tải thông tin đơn hàng: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Xử lý thanh toán
  const handlePayment = async () => {
    setPaymentLoading(true);
    setError('');

    try {
      const paymentUrl = await createPaymentUrl(orderId);
      window.location.href = paymentUrl; // Điều hướng đến URL thanh toán VNPAY
    } catch (err) {
      setError('Lỗi khi tạo liên kết thanh toán: ' + err);
      console.error('Lỗi khi tạo thanh toán:', err);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Xử lý hiển thị thông báo trạng thái thanh toán
  useEffect(() => {
    if (paymentStatus) {
      if (paymentStatus === 'SUCCESS') {
        alert('Thanh toán thành công! Cảm ơn bạn đã đặt bàn.');
        navigate('/reservation-history');
      } else if (paymentStatus === 'FAILED') {
        alert('Thanh toán thất bại. Vui lòng thử lại.');
        navigate('/');
      }
      setPaymentStatus(null); // Đặt lại để tránh lặp lại
    }
  }, [paymentStatus, navigate]);

  if (loading) {
    return (
      <div className="payment-page">
        <h2>Đang tải thông tin đơn hàng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-page">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-btn">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="payment-page">
        <h2>Không tìm thấy đơn hàng</h2>
        <button onClick={() => navigate('/')} className="back-btn">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-content">
        <h2>Thông tin đơn hàng #{order.id}</h2>
        <div className="restaurant-info">
          <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
          <div className="restaurant-details">
            <h3>{restaurant.name}</h3>
            <p><strong>Địa chỉ:</strong> {restaurant.address}</p>
          </div>
        </div>
        <h3>Các món đã chọn</h3>
        <ul className="selected-items">
          {order.dishes.map((item) => (
            <li key={item.id} className="selected-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity111">{item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ</span>
                <span className="item-total">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="total-price">
          <h3>Tổng tiền: {totalPrice.toLocaleString('vi-VN')} VNĐ</h3>
        </div>
        <div className="booking-info">
          <h3>Thông tin đặt chỗ</h3>
          <p><strong>Ngày đến:</strong> {new Date(order.reservationTime).toLocaleDateString('vi-VN')}</p>
          <p><strong>Giờ đến:</strong> {new Date(order.reservationTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
          <p><strong>Số người lớn:</strong> {order.numberOfPeople}</p>
          <p><strong>Số trẻ em:</strong> {order.numberOfChild}</p>
        </div>
        <div className="payment-info">
          <h3>Thanh toán</h3>
          <p>Tổng tiền: <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span></p>
          <div className="payment-method">
            <label>Hình thức thanh toán: VNPAY</label>
          </div>
        </div>
        <button 
          onClick={handlePayment} 
          className="payment-btn" 
          disabled={paymentLoading}
        >
          {paymentLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
        </button>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
};

export default PaymentPage;