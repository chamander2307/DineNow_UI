import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/styles/PaymentPage.css';

import restaurant1 from '../../assets/img/restaurant1.jpg';
// Dữ liệu giả lập (thay thế bằng dữ liệu thực tế từ ứng dụng của bạn)
const mockRestaurant = {
  name: 'Nhà hàng B',
  address: '456 Đường Ẩm Thực, TP. HCM',
  image: restaurant1,
};

// Dữ liệu món ăn đã chọn (giả lập, bổ sung số lượng mặc định)
const mockSelectedItems = [
  { id: '4', name: 'Cơm Thố Heo Giòn Teriyaki', price: 99000, quantity: 1 },
  { id: '5', name: 'Cơm Thố Gà + Ốp La', price: 37000, quantity: 1 },
  { id: '7', name: 'Coca Cola', price: 11000, quantity: 1 },
];

const PaymentPage = () => {
  // Lấy dữ liệu từ useLocation (nếu bạn truyền dữ liệu qua state từ trang trước)
  const location = useLocation();
  const { restaurant = mockRestaurant, selectedItems: initialItems = mockSelectedItems } = location.state || {};

  // State để quản lý danh sách món ăn đã chọn (bao gồm số lượng)
  const [selectedItems, setSelectedItems] = useState(initialItems);

  // Tính tổng tiền dựa trên số lượng
  const totalPrice = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // State để quản lý thông tin đặt chỗ
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('VNPay'); // State cho hình thức thanh toán

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return; // Không cho phép số lượng nhỏ hơn 1
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
  const handlePayment = (e) => {
    e.preventDefault();
    if (!numberOfPeople || !date || !time) {
      alert('Vui lòng nhập đầy đủ thông tin đặt chỗ (số người, ngày đến, giờ đến)!');
      return;
    }

    // Giả lập gọi API thanh toán
    console.log(`Thanh toán bằng ${paymentMethod} với thông tin:`, {
      restaurant,
      selectedItems,
      totalPrice,
      numberOfPeople,
      date,
      time,
      note,
      paymentMethod,
    });
    alert('Đơn hàng đã được gửi đến nhà hàng!');
  };

  return (
    <div className="payment-page">
      {/* Bên trái: Thông tin nhà hàng và món ăn */}
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
                <span>{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
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
                  className="remove-btn"
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

      {/* Bên phải: Form thanh toán */}
      <div className="payment-right">
        <form onSubmit={handlePayment} className="payment-form">
          {/* Thông tin đặt chỗ */}
          <div className="booking-info">
            <h3>Thông tin đặt chỗ</h3>
            <div className="form-group">
              <label>Số người: <span className="required">*</span></label>
              <input
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày đến: <span className="required">*</span></label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Không cho phép chọn ngày trong quá khứ
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
                step="900" // Bước 15 phút
              />
            </div>
            <div className="form-group">
              <label>Ghi chú:</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú (nếu có)..."
                rows="3"
              />
            </div>
          </div>

          {/* Thanh toán */}
          <div className="payment-info">
            <h3>Thanh toán</h3>
            <p>Tổng tiền: <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span></p>
            <div className="payment-method">
              <label>Hình thức thanh toán:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-select"
              >
                <option value="VNPay">VNPay</option>
                <option value="Thanh toán trực tiếp">Thanh toán trực tiếp</option>
              </select>
            </div>
          </div>

          <button type="submit" className="payment-btn">Thanh toán</button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;