import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../assets/styles/Restaurant/OrderPage.css';
import { getCustomerOrderDetail, createOrder } from '../../services/orderService';
import restaurant1 from '../../assets/img/restaurant1.jpg';

const ReOrderPage = () => {
  const { id } = useParams(); // Lấy orderId từ URL (ví dụ: /re-order/3)
  const navigate = useNavigate();

  // Di chuyển tất cả các Hook useState lên đầu component
  const [selectedItems, setSelectedItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [numberOfAdults, setNumberOfAdults] = useState('');
  const [numberOfChildren, setNumberOfChildren] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('VNPay');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const orderId = id || 3; // Sử dụng id từ URL hoặc mặc định là 3
        const response = await getCustomerOrderDetail(orderId);
        const orderData = response.data;

        setRestaurant({
          id: orderData.restaurant.id,
          name: orderData.restaurant.name,
          address: orderData.restaurant.address,
          image: orderData.restaurant.thumbnailUrl || restaurant1,
        });

        setSelectedItems(
          orderData.menuItems.map(item => ({
            id: item.menuItemId,
            name: item.menuItemName,
            quantity: item.quantity,
            price: parseFloat(item.menuItemPrice) || 0,
          }))
        );
      } catch (err) {
        setError('Không thể tải thông tin đơn hàng. Vui lòng thử lại.');
        console.error('Lỗi khi lấy chi tiết đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // Nếu đang tải, hiển thị thông báo
  if (loading) {
    return (
      <div className="order-page">
        <div className="error-container">
          <h2>Đang tải...</h2>
        </div>
      </div>
    );
  }

  // Nếu có lỗi hoặc không có dữ liệu, hiển thị thông báo
  if (error || !restaurant) {
    return (
      <div className="order-page">
        <div className="error-container">
          <h2>Không tìm thấy thông tin đơn hàng để đặt lại</h2>
          <p>{error || 'Vui lòng quay lại lịch sử đặt bàn để chọn đơn hàng.'}</p>
          <button onClick={() => navigate('/reservation-history')} className="back-btn">
            Quay lại lịch sử đặt bàn
          </button>
        </div>
      </div>
    );
  }

  // Tính tổng tiền dựa trên số lượng
  const totalPrice = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

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

  // Xử lý thanh toán (đặt lại)
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

      alert('Đơn hàng đã được đặt lại thành công!');
      navigate('/reservation-history');
    } catch (err) {
      setError('Lỗi khi đặt lại đơn hàng: ' + err.message);
      console.error('Lỗi khi thanh toán:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-page">
      <div className="content-container">
        <div className="order-left">
          <h2>Thông tin đơn hàng</h2>
          <div className="restaurant-info">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="restaurant-image1111"
              onError={(e) => {
                console.log(`Không load được ảnh nhà hàng ${restaurant.name} từ URL: ${restaurant.image}`);
                e.target.src = restaurant1;
              }}
            />
            <h3>{restaurant.name}</h3>
          </div>
          <h3>Các món đã chọn</h3>
          {selectedItems.length > 0 ? (
            <table className="selected-items-table">
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name">{item.name}</td>
                    <td className="item-actions">
                      <div className="price-quantity-remove">
                        <span className="price">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Chưa có món ăn nào được chọn.</p>
          )}
          <div className="total-price">
            <h3>Tổng tiền: <span className="price">{totalPrice.toLocaleString('vi-VN')} VNĐ</span></h3>
          </div>
        </div>

        <div className="order-right">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handlePayment} className="order-form">
            <div className="booking-info">
              <h3>Thông tin đặt lại</h3>
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
              <p>Tổng tiền: <span className="price">{totalPrice.toLocaleString('vi-VN')} VNĐ</span></p>
              <div className="payment-method">
                <label>Hình thức thanh toán: VNPay</label>
              </div>
            </div>

            <button type="submit" className="payment-btn" disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Đặt lại'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReOrderPage;