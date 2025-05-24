import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/Restaurant/PaymentPage.css';
import { createOrder } from '../../services/orderService';

import restaurant1 from '../../assets/img/restaurant1.jpg';

// Dữ liệu giả lập
const mockRestaurant = {
  name: 'Nhà hàng B',
  address: '456 Đường Ẩm Thực, TP. HCM',
  image: restaurant1,
};

const mockSelectedItems = [
  { id: '4', name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, quantity: 1 },
  { id: '5', name: 'Cơm Thố Gà + Ốp La', price: 37000, quantity: 1 },
  { id: '7', name: 'Coca Cola', price: 11000, quantity: 1 },
];

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy dữ liệu từ state
  const { selectedItems: initialItemsData = [{ restaurant: mockRestaurant, dishes: mockSelectedItems }] } = location.state || {};

  // Lấy restaurant và dishes từ selectedItems
  const restaurant = initialItemsData[0]?.restaurant || mockRestaurant;
  const initialItems = initialItemsData[0]?.dishes.map(item => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: parseFloat(item.price) || 0, // Đảm bảo price là số, mặc định là 0 nếu không có
  })) || mockSelectedItems;

  // State để quản lý danh sách món ăn đã chọn
  const [selectedItems, setSelectedItems] = useState(initialItems);

  // Tính tổng tiền dựa trên số lượng
  const totalPrice = selectedItems.reduce((total, item) => total + ((parseFloat(item.price) || 0) * item.quantity), 0);

  // State để quản lý thông tin đặt chỗ
  const [numberOfAdults, setNumberOfAdults] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('VNPay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id ? { ...item, quantity: parseInt(newQuantity) } : item
      )
    );
  };

  // Xử lý xóa món ăn
  const handleRemoveItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  // Xử lý thanh toán
  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!numberOfAdults && !numberOfChildren) {
      setError('Vui lòng nhập số người lớn hoặc số trẻ em!');
      setLoading(false);
      return;
    }
    if (!date || !time) {
      setError('Vui lòng nhập đầy đủ thông tin đặt chỗ (ngày đến, giờ đến)!');
      setLoading(false);
      return;
    }

    const adults = parseInt(numberOfAdults) || 0;
    const children = parseInt(numberOfChildren) || 0;
    if (adults + children === 0) {
      setError('Vui lòng nhập ít nhất một người (người lớn hoặc trẻ em)!');
      setLoading(false);
      return;
    }

    try {
      const reservationDateTime = new Date(`${date}T${time}`).toISOString();
      const orderData = {
        reservationTime: reservationDateTime,
        numberOfPeople: adults,
        numberOfChild: children,
        numberPhone: '0386299573',
        note: note || '',
        orderItems: selectedItems.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(restaurant.id, orderData);

      const savedCart = JSON.parse(sessionStorage.getItem('cart')) || {};
      delete savedCart[restaurant.id];
      sessionStorage.setItem('cart', JSON.stringify(savedCart));

      alert('Đơn hàng đã được gửi đến nhà hàng thành công!');
      navigate('/');
    } catch (err) {
      setError('Lỗi khi gửi đơn hàng: ' + err.message);
      console.error('Lỗi khi thanh toán:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-left">
        <h2>Thông tin đơn hàng</h2>
        <div className="restaurant-info">
          <h3>{restaurant.name}</h3>
          <img src={restaurant.image} alt={restaurant.name} className="restaurant-image" />
        </div>
        <h3>Các món đã chọn</h3>
        <ul className="selected-items">
          {selectedItems.map((item) => (
            <li key={item.id} className="selected-item">
              <div className="item-details">
                <span>{item.name}</span>
                <span>{((parseFloat(item.price) || 0) * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="item-actions">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                  min="1"
                  className="quantity-input"
                />
                <button
                  className="remove-btn111"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Xóa
                </button>
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
        <form onSubmit={handlePayment} className="payment-form">
          <div className="booking-info">
            <h3>Thông tin đặt chỗ</h3>
            <div className="form-group">
              <label>Số người lớn: <span className="required">*</span></label>
              <input
                type="number"
                value={numberOfAdults}
                onChange={(e) => setNumberOfAdults(e.target.value)}
                min="0"
                required={!(parseInt(numberOfChildren) > 0)}
              />
            </div>
            <div className="form-group">
              <label>Số trẻ em: <span className="required">*</span></label>
              <input
                type="number"
                value={numberOfChildren}
                onChange={(e) => setNumberOfChildren(e.target.value)}
                min="0"
                required={!(parseInt(numberOfAdults) > 0)}
              />
            </div>
            <div className="form-group">
              <label>Ngày đến: <span className="required">*</span></label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className="form-group">
              <label>Giờ đến: <span className="required">*</span></label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                step="900"
              />
            </div>
          </div>

          <div className="payment-info">
            <h3>Thanh toán</h3>
            <p>Tổng tiền: <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span></p>
            <div className="payment-method">
              <label>Hình thức thanh toán: VNPAY</label>
            </div>
          </div>

          <button type="submit" className="payment-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Thanh toán'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;