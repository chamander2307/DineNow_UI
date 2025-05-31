import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/Restaurant/ReservationDetail.css';
import { getCustomerOrders, cancelOrder } from '../../services/orderService';
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
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

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
          id: order.restaurants?.id || 1,
        },
        date: order.reservationSimpleResponse?.reservationTime,
        time: order.reservationSimpleResponse?.reservationTime,
        guests: (order.reservationSimpleResponse?.numberOfPeople || 0) + (order.reservationSimpleResponse?.numberOfChild || 0),
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
      navigate(`/re-order/${id}`, { state: { isRebook: true, ...rebookData } });
    }
  };

  const handleReview = (dishId) => {
    navigate(`/restaurant/${reservation.restaurant.id}`, {
      state: { selectedDishId: dishId },
    });
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
        <Link to="/reservation-history" className="back-btn111">
          Quay lại
        </Link>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="reservation-detail-container">
        <h2>Không tìm thấy đơn đặt bàn</h2>
        <Link to="/reservation-history" className="back-btn111">
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
                {reservation.status === 'COMPLETED' && <th>Hành động</th>}
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
                  {reservation.status === 'COMPLETED' && (
                    <td>
                      <button
                        className="review-btn"
                        onClick={() => handleReview(dish.id)}
                      >
                        Đánh giá
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Chưa có món ăn nào được đặt.</p>
        )}
      </div>

      {/* Thông tin thanh toán */}
      <div className="payment-section">
        <h3>Thông tin thanh toán</h3>
        <p><strong>Tổng tiền:</strong> <span className="price">{(reservation.totalAmount || 0).toLocaleString('vi-VN')} VNĐ</span></p>
        <p><strong>Hình thức thanh toán:</strong> VNPay</p>
      </div>

      {/* Nút hủy, đặt lại, quay lại và đánh giá nhà hàng */}
      <div className="button-section">
        {reservation.status === 'PENDING' && (
          <button
            onClick={handleCancelOrder}
            className="cancel-btn111"
            disabled={cancelLoading}
          >
            {cancelLoading ? 'Đang hủy...' : 'Hủy đơn hàng'}
          </button>
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
        {reservation.status === 'COMPLETED' && (
          <Link
            to={`/restaurant/${reservation.restaurant.id}`}
            className="review-btn"
          >
            Đánh giá nhà hàng
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReservationDetail;