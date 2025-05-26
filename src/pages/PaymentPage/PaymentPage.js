import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Cần cài đặt: npm install react-toastify
import '../../assets/styles/Restaurant/PaymentPage.css';
import { createPaymentUrl } from '../../services/paymentService';
import { getCustomerOrderDetail } from '../../services/orderService';
import restaurant1 from '../../assets/img/restaurant1.jpg';

const mockOrderDefaults = {
  reservationTime: '2025-05-23T14:30:00Z',
  numberOfPeople: 4,
  numberOfChild: 2,
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);

  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const paymentStatus = queryParams.get('paymentStatus') || null;

  const totalPrice = order?.dishes?.length
    ? order.dishes.reduce((total, item) => {
        const price = Number(item.price) || 0;
        return total + price * (item.quantity || 0);
      }, 0)
    : 0;

  useEffect(() => {
    const status = queryParams.get('paymentStatus');
    if (status) {
      if (status === 'SUCCESS') {
        toast.success('Thanh toán thành công! Cảm ơn bạn đã đặt bàn.');
        navigate('/reservation-history');
      } else if (status === 'FAILED') {
        toast.error('Thanh toán thất bại. Vui lòng thử lại.');
        navigate('/');
      } else {
        toast.error('Trạng thái thanh toán không hợp lệ.');
        navigate('/');
      }
    }
  }, [navigate, queryParams]);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError('');
      try {
        if (!id || isNaN(id)) {
          throw new Error('Mã đơn hàng không hợp lệ');
        }
        const response = await getCustomerOrderDetail(id, {
          signal: abortController.signal,
        });
        const data = response.data;

        setOrder({
          id: data.id || '',
          reservationTime: data.reservationTime || mockOrderDefaults.reservationTime,
          numberOfPeople: data.numberOfPeople ?? mockOrderDefaults.numberOfPeople,
          numberOfChild: data.numberOfChild ?? mockOrderDefaults.numberOfChild,
          dishes: Array.isArray(data.menuItems)
            ? data.menuItems.map(item => ({
                id: item.menuItemId || '',
                name: item.menuItemName || 'Không xác định',
                quantity: Number(item.quantity) || 0,
                price: Number(item.menuItemPrice) || 0,
              }))
            : [],
        });

        setRestaurant({
          name: data.restaurant?.name || 'Nhà hàng không xác định',
          address: data.restaurant?.address || 'Chưa có địa chỉ',
          image: data.restaurant?.thumbnailUrl || restaurant1,
        });
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(
          err.response?.status === 404
            ? 'Không tìm thấy đơn hàng.'
            : err.response?.status === 403
            ? 'Bạn không có quyền truy cập đơn hàng này.'
            : 'Lỗi khi tải thông tin đơn hàng: ' + (err.message || 'Không xác định')
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    return () => abortController.abort();
  }, [id]);

  useEffect(() => {
    if (paymentStatus) {
      if (paymentStatus === 'SUCCESS') {
        toast.success('Thanh toán thành công! Cảm ơn bạn đã đặt bàn.');
        navigate('/reservation-history');
      } else if (paymentStatus === 'FAILED') {
        toast.error('Thanh toán thất bại. Vui lòng thử lại.');
        navigate('/');
      } else {
        toast.warn('Trạng thái thanh toán không hợp lệ.');
        navigate('/');
      }
    }
  }, [paymentStatus, navigate]);

  const handlePayment = async () => {
    setPaymentLoading(true);
    setError('');
    try {
      console.log('Gọi API với orderId:', orderId);
      const paymentUrl = await createPaymentUrl(orderId);
      console.log('URL thanh toán:', paymentUrl);
      if (typeof paymentUrl !== 'string' || !paymentUrl.includes('vnpayment.vn')) {
        throw new Error('URL thanh toán không hợp lệ.');
      }
      window.location.href = paymentUrl;
    } catch (err) {
      setError('Lỗi khi tạo liên kết thanh toán: ' + err.message);
      setTimeout(() => setError(''), 5000);
    } finally {
      setPaymentLoading(false);
    }
  };

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
        <button onClick={() => window.location.reload()} className="retry-btn">
          Thử lại
        </button>
        <button onClick={() => navigate('/')} className="back-btn">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  if (!order?.dishes?.length || !restaurant?.name) {
    return (
      <div className="payment-page">
        <h2>Dữ liệu đơn hàng không đầy đủ</h2>
        <button onClick={() => navigate('/')} className="back-btn">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="payment-page">
      {paymentLoading && (
        <div className="loading-overlay">
          <div className="spinner">Đang xử lý thanh toán...</div>
        </div>
      )}
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
                <span className="item-quantity">{item.quantity} x {item.price.toLocaleString('vi-VN')} VNĐ</span>
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