import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/Restaurant/PaymentPage.css';
import { createOrder } from '../../services/orderService';
import restaurant1 from '../../assets/img/restaurant1.jpg';

// Dữ liệu giả lập (dùng khi không có dữ liệu từ link)
const mockRestaurant = {
  name: 'Nhà hàng B',
  address: '456 Đường Ẩm Thực, TP. HCM',
  image: restaurant1,
};

const mockOrder = {
  id: '12345',
  reservationTime: '2025-05-23T14:30:00Z',
  numberOfPeople: 4,
  numberOfChild: 2,
  note: 'Bàn gần cửa sổ',
  dishes: [
    { id: '4', name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, quantity: 1 },
    { id: '5', name: 'Cơm Thố Gà + Ốp La', price: 37000, quantity: 1 },
    { id: '7', name: 'Coca Cola', price: 11000, quantity: 1 },
  ],
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ query params hoặc state (giả định từ link email)
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId') || mockOrder.id;

  // State để lưu thông tin đơn hàng
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(mockRestaurant);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Tính tổng tiền
  const totalPrice = order?.dishes?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  // Lấy thông tin đơn hàng từ API (giả định)
  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // Giả định gọi API để lấy thông tin đơn hàng dựa trên orderId
        // const response = await getOrderDetails(orderId);
        // const data = response.data;

        // Dữ liệu giả lập thay thế cho API
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

        // Giả định thông tin nhà hàng được lấy từ API
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
      // Gọi API để xác nhận thanh toán (giả định)
      const orderData = {
        orderId: order.id,
        reservationTime: order.reservationTime,
        numberOfPeople: order.numberOfPeople,
        numberOfChild: order.numberOfChild,
        numberPhone: '0386299573',
        orderItems: order.dishes.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(restaurant.id || 1, orderData); // Giả định restaurant.id nếu không có

      alert('Thanh toán thành công! Cảm ơn bạn đã đặt bàn.');
      navigate('/reservation-history');
    } catch (err) {
      setError('Lỗi khi thực hiện thanh toán: ' + err.message);
      console.error('Lỗi khi thanh toán:', err);
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
      <div className="payment-left">
        <h2>Thông tin đơn hàng #{order.id}</h2>
        <div className="restaurant-info">
          <h3>{restaurant.name}</h3>
          <p><strong>Địa chỉ:</strong> {restaurant.address}</p>
          <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
        </div>
        <h3>Các món đã chọn</h3>
        <ul className="selected-items">
          {order.dishes.map((item) => (
            <li key={item.id} className="selected-item">
              <div className="item-details">
                <span>{item.name}</span>
                <span>{item.quantity} x {(item.price || 0).toLocaleString('vi-VN')} VNĐ</span>
                <span>{((item.price || 0) * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="total-price">
          <h3>Tổng tiền: {totalPrice.toLocaleString('vi-VN')} VNĐ</h3>
        </div>
      </div>

      <div className="payment-right">
        {error && <div className="alert alert-danger">{error}</div>}
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
      </div>
    </div>
  );
};

export default PaymentPage;