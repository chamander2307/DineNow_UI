import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import OwnerLayout from "./OwnerLayout";
import {
  getOwnerOrdersByRestaurant,
  updateOrderStatus,
} from "../../services/orderService";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";

Modal.setAppElement("#root");

const OwnerReservationList = () => {
  const [orders, setOrders] = useState([]);
  const [restaurantMap, setRestaurantMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState(null);

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    if (Object.keys(restaurantMap).length > 0) {
      loadAllPendingOrders();
    }
  }, [restaurantMap]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      const restaurants = res?.data || [];
      const map = restaurants.reduce(
        (acc, r) => ({ ...acc, [r.id]: r.name }),
        {}
      );
      setRestaurantMap(map);
    } catch (err) {
      alert("Không thể tải danh sách nhà hàng.");
    }
  };

  const loadAllPendingOrders = async () => {
    setLoading(true);
    try {
      const restaurantRes = await fetchRestaurantsByOwner();
      const restaurantList = restaurantRes?.data || [];
      const pendingOrders = [];

      for (const restaurant of restaurantList) {
        const res = await getOwnerOrdersByRestaurant(restaurant.id, [
          "PENDING",
        ]);
        const orders = Array.isArray(res.data)
          ? res.data.map((order) => ({ ...order, restaurantId: restaurant.id }))
          : [];
        pendingOrders.push(...orders);
      }

      setOrders(pendingOrders);
    } catch (err) {
      alert("Không thể tải danh sách đặt bàn.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Xác nhận duyệt đặt bàn này?")) return;
    try {
      await updateOrderStatus(id, "CONFIRMED");
      alert("Duyệt đặt bàn thành công.");
      await loadAllPendingOrders();
    } catch (err) {
      alert(
        "Không thể duyệt đặt bàn: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const openRejectModal = (id) => {
    setRejectOrderId(id);
    setIsRejecting(true);
  };

  const handleCancel = async () => {
    if (!rejectionReason.trim()) {
      alert("Vui lòng nhập lý do hủy.");
      return;
    }
    if (!window.confirm("Xác nhận hủy đặt bàn này?")) return;
    try {
      await updateOrderStatus(rejectOrderId, "CANCELLED", rejectionReason);
      alert("Hủy đặt bàn thành công.");
      setIsRejecting(false);
      setRejectionReason("");
      await loadAllPendingOrders();
    } catch (err) {
      alert(
        "Không thể hủy đặt bàn: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Đặt bàn chờ xác nhận</h2>
        {loading && <p>Đang tải...</p>}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Nhà hàng</th>
            <th>Số người lớn</th>
            <th>Số trẻ em</th>
            <th>Thời gian đặt bàn</th>
            <th>Tổng tiền</th>
            <th>Món ăn</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && !loading ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                Không có đặt bàn nào.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{restaurantMap[order.restaurantId] || "Không có"}</td>
                <td>
                  {order.reservationSimpleResponse?.numberOfPeople || "-"}
                </td>
                <td>{order.reservationSimpleResponse?.numberOfChild || "-"}</td>
                <td>
                  {order.reservationSimpleResponse?.reservationTime
                    ? new Date(
                        order.reservationSimpleResponse.reservationTime
                      ).toLocaleString()
                    : "-"}
                </td>
                <td>
                  {order.totalPrice
                    ? order.totalPrice.toLocaleString() + " đ"
                    : "-"}
                </td>
                <td>
                  {order.menuItems?.length > 0 ? (
                    <ul>
                      {order.menuItems.map((item) => (
                        <li key={item.menuItemId}>
                          {item.menuItemName} (x{item.quantity}):{" "}
                          {item.totalPrice?.toLocaleString()} đ
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "Không có món"
                  )}
                </td>
                <td>
                  {order.status === "PENDING"
                    ? "Chờ xác nhận"
                    : "Không xác định"}
                </td>
                <td>
                  <button
                    onClick={() => handleApprove(order.id)}
                    className="approve-button"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => openRejectModal(order.id)}
                    className="reject-button"
                  >
                    Hủy
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {isRejecting && (
        <Modal
          isOpen={isRejecting}
          onRequestClose={() => setIsRejecting(false)}
          className="ReactModal__Content"
          overlayClassName="ReactModal__Overlay"
        >
          <div className="modal-header">
            <h2>Lý do hủy đặt bàn</h2>
            <button className="close-btn" onClick={() => setIsRejecting(false)}>
              ✕
            </button>
          </div>
          <div className="modal-content">
            <div className="form-group">
              <label>Lý do hủy</label>
              <textarea
                className="form-input"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Nhập lý do..."
              />
            </div>
          </div>
          <div className="modal-buttons">
            <button className="submit-btn" onClick={handleCancel}>
              Xác nhận
            </button>
            <button
              className="cancel-btn"
              onClick={() => setIsRejecting(false)}
            >
              Đóng
            </button>
          </div>
        </Modal>
      )}
    </OwnerLayout>
  );
};

export default OwnerReservationList;
