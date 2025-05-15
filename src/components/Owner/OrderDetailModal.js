import React from "react";
import Modal from "react-modal";
import "../../assets/styles/owner/OrderDetailModal.css";

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const statusText = {
    PENDING: "Đang chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PAID: "Đã thanh toán",
    CANCELLED: "Đã hủy",
    FAILED: "Thất bại",
    COMPLETED: "Đã hoàn thành",
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="order-detail-modal">
      <h2>Chi tiết đơn hàng</h2>
      <div className="order-info">
        <p><strong>Mã đơn hàng:</strong> {order.id || "N/A"}</p>
        <p><strong>Trạng thái:</strong> {statusText[order.status] || "Không xác định"}</p>
        <p><strong>Tổng tiền:</strong> {order.totalPrice ? order.totalPrice.toLocaleString() + " đ" : "N/A"}</p>
      </div>

      <h3>Thông tin khách hàng</h3>
      <div className="customer-info">
        <p><strong>Tên khách hàng:</strong> {order.reservation?.customerName || "N/A"}</p>
        <p><strong>Số điện thoại:</strong> {order.reservation?.numberPhone || "N/A"}</p>
        <p><strong>Email:</strong> {order.reservation?.customerEmail || "N/A"}</p>
      </div>

      <h3>Thông tin đặt bàn</h3>
      <div className="reservation-info">
        <p><strong>Số người lớn:</strong> {order.reservation?.numberOfPeople || "0"}</p>
        <p><strong>Số trẻ em:</strong> {order.reservation?.numberOfChild || "0"}</p>
        <p><strong>Nhà hàng:</strong> {order.reservation?.restaurantName || "N/A"}</p>
        <p><strong>Địa chỉ:</strong> {order.reservation?.restaurantAddress || "N/A"}</p>
        <p><strong>Thời gian đặt bàn:</strong> {order.reservation?.reservationTime ? new Date(order.reservation.reservationTime).toLocaleString() : "N/A"}</p>
      </div>

      <h3>Danh sách món ăn</h3>
      <table className="menu-item-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên món</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
          {order.menuItems && order.menuItems.length > 0 ? (
            order.menuItems.map((item) => (
              <tr key={item.menuItemId || item.id}>
                <td>
                  <img
                    src={item.menuItemImageUrl || "/fallback.jpg"}
                    alt={item.menuItemName || "Món ăn"}
                    className="menu-item-image"
                    onError={(e) => { e.target.src = "/fallback.jpg"; }}
                  />
                </td>
                <td>{item.menuItemName || "N/A"}</td>
                <td>{item.menuItemPrice ? item.menuItemPrice.toLocaleString() + " đ" : "N/A"}</td>
                <td>{item.quantity || "0"}</td>
                <td>{item.totalPrice ? item.totalPrice.toLocaleString() + " đ" : "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">Không có món ăn.</td></tr>
          )}
        </tbody>
      </table>

      <button onClick={onClose} className="close-button">Đóng</button>
    </Modal>
  );
};

export default OrderDetailModal;