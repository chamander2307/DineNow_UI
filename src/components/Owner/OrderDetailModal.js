import React from "react";
import Modal from "react-modal";
import "../../assets/styles/owner/ModalForm.css";

Modal.setAppElement("#root");

const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  // Định dạng tiền tệ VND
  const formatCurrency = (value) => {
    return value ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value) : "N/A";
  };

  // Định dạng ngày giờ
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // Mapping trạng thái đơn hàng
  const statusText = {
    PENDING: "Đang chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PAID: "Đã thanh toán",
    CANCELLED: "Đã hủy",
    FAILED: "Thất bại",
    COMPLETED: "Đã hoàn thành",
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <div className="modal-header">
        <h2>Chi tiết đơn hàng</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="order-info">
        <p><strong>Mã đơn hàng:</strong> {order.id || "N/A"}</p>
        <p><strong>Trạng thái:</strong> {statusText[order.status] || "Không xác định"}</p>
        <p><strong>Tổng tiền:</strong> {formatCurrency(order.totalPrice)}</p>
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
        <p><strong>Thời gian đặt bàn:</strong> {formatDateTime(order.reservation?.reservationTime)}</p>
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
              <tr key={item.menuItemId}>
                <td>
                  <img
                    src={item.menuItemImageUrl || "/fallback.jpg"}
                    alt={item.menuItemName || "Món ăn"}
                    className="menu-item-image"
                    onError={(e) => { e.target.src = "/fallback.jpg"; }}
                  />
                </td>
                <p>{item.menuItemName || "N/A"}</p>
                <td>{formatCurrency(item.menuItemPrice)}</td>
                <td>{item.quantity || "0"}</td>
                <td>{formatCurrency(item.totalPrice)}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">Không có món ăn.</td></tr>
          )}
        </tbody>
      </table>

      <div className="modal-buttons">
        <button className="cancel-btn" onClick={onClose}>Đóng</button>
      </div>
    </Modal>
  );
};

export default OrderDetailModal;