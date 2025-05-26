import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/Restaurant/PaymentStatus.css';
import { getCustomerOrderDetail } from '../../services/orderService';
import restaurant1 from '../../assets/img/restaurant1.jpg';

const mockOrderDefaults = {
  reservationTime: '2025-05-23T14:30:00Z',
  numberOfPeople: 4,
  numberOfChild: 2,
};

const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const orderId = id || '12345';
  const paymentStatus = queryParams.get('paymentStatus') || null;

  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const totalPrice = order?.dishes?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getCustomerOrderDetail(orderId);
        const data = response.data;

        setOrder({
          id: data.id,
          reservationTime: data.reservationTime || mockOrderDefaults.reservationTime,
          numberOfPeople: data.numberOfPeople || mockOrderDefaults.numberOfPeople,
          numberOfChild: data.numberOfChild || mockOrderDefaults.numberOfChild,
          dishes: (data.menuItems || []).map(item => ({
            id: item.menuItemId,
            name: item.menuItemName,
            quantity: item.quantity,
            price: parseFloat(item.menuItemPrice) || 0,
          })),
        });

        setRestaurant({
          name: data.restaurant?.name || 'Nhà hàng không xác định',
          address: data.restaurant?.address || 'Chưa có địa chỉ',
          image: data.restaurant?.thumbnailUrl || restaurant1,
        });
      } catch (err) {
        setError('Lỗi khi tải thông tin đơn hàng: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    if (paymentStatus) {
      if (paymentStatus === 'SUCCESS') {
        alert('Thanh toán thành công! Cảm ơn bạn đã đặt bàn.');
      } else if (paymentStatus === 'FAILED') {
        alert('Thanh toán thất bại. Vui lòng thử lại.');
      }
    }
  }, [paymentStatus]);

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

  if (!order || !restaurant || !paymentStatus) {
    return (
      <div className="payment-page">
        <h2>Không tìm thấy thông tin thanh toán hoặc đơn hàng</h2>
        <button onClick={() => navigate('/')} className="back-btn">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-content">
        <h2>Trạng thái thanh toán cho đơn hàng #{order.id}</h2>
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
          <h3>Trạng thái thanh toán</h3>
          <p>Tổng tiền: <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span></p>
          <p>Trạng thái: <strong>{paymentStatus === 'SUCCESS' ? 'Thành công' : 'Thất bại'}</strong></p>
          <div className="payment-method">
            <label>Hình thức thanh toán: VNPAY</label>
          </div>
        </div>
        <button onClick={() => navigate('/reservation-history')} className="back-btn">
          Quay lại lịch sử đặt bàn
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;