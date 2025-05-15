import React, { useEffect, useState, useContext } from "react";
import Modal from "react-modal";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import {
  getOwnerOrdersByRestaurant,
  updateOrderStatus,
  getOrderDetail,
} from "../../services/orderService";
import { UserContext } from "../../contexts/UserContext";
import OrderDetailModal from "../../components/Owner/OrderDetailModal";

Modal.setAppElement("#root");

const STATUS_GROUPS = [
  { value: "PENDING", label: "Đang chờ xử lý", statuses: ["PENDING"] },
  { value: "confirmed_paid", label: "Đã xác nhận & Đã thanh toán", statuses: ["CONFIRMED", "PAID"] },
  { value: "canceled_failed", label: "Đã hủy & Thất bại", statuses: ["CANCELLED", "FAILED"] },
  { value: "COMPLETED", label: "Đã hoàn thành", statuses: ["COMPLETED"] },
];

const ALLOWED_STATUS_TRANSITIONS = {
  PENDING: ["CANCELLED", "CONFIRMED"],
  PAID: ["COMPLETED"],
};

const STATUS_LABELS = {
  PENDING: "Đang chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  PAID: "Đã thanh toán",
  CANCELLED: "Đã hủy",
  FAILED: "Thất bại",
  COMPLETED: "Đã hoàn thành",
};

const OwnerOrderManager = () => {
  const { user, loading } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [selectedStatusGroup, setSelectedStatusGroup] = useState("PENDING");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (!loading && user?.role === "OWNER") {
      loadRestaurants();
    }
  }, [loading, user]);

  useEffect(() => {
    if (selectedRestaurantId) {
      loadOrdersByStatus();
    }
  }, [selectedStatusGroup, selectedRestaurantId]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      const data = res?.data || [];
      setRestaurants(data);
      if (data.length > 0) {
        setSelectedRestaurantId(data[0].id.toString());
      }
    } catch (err) {
      alert("Không thể tải danh sách nhà hàng.");
    }
  };

const loadOrdersByStatus = async () => {
  setLoadingOrders(true);
  try {
    const selectedStatus = STATUS_GROUPS.find(group => group.value === selectedStatusGroup);
    const statusList = selectedStatus ? selectedStatus.statuses : ["PENDING"];
    const res = await getOwnerOrdersByRestaurant(selectedRestaurantId, statusList);
    setOrders(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    alert("Không thể tải danh sách đơn hàng.");
  } finally {
    setLoadingOrders(false);
  }
};

  const canUpdateStatus = (currentStatus, newStatus) => {
    const allowedStatuses = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    return allowedStatuses.includes(newStatus);
  };

  const handleApprove = async (id, currentStatus) => {
    if (!canUpdateStatus(currentStatus, "CONFIRMED")) {
      alert(`Không thể duyệt đơn hàng từ trạng thái ${STATUS_LABELS[currentStatus]}.`);
      return;
    }
    if (!window.confirm("Xác nhận duyệt đơn hàng này?")) return;
    try {
      await updateOrderStatus(id, "CONFIRMED");
      alert("Duyệt đơn hàng thành công.");
      await loadOrdersByStatus();
    } catch (err) {
      alert("Không thể duyệt đơn hàng: " + (err.response?.data?.message || err.message));
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
    try {
      await updateOrderStatus(rejectOrderId, "CANCELLED", rejectionReason);
      alert("Hủy đơn hàng thành công.");
      setIsRejecting(false);
      setRejectionReason("");
      await loadOrdersByStatus();
    } catch (err) {
      alert("Không thể hủy đơn hàng: " + (err.response?.data?.message || err.message));
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await getOrderDetail(id);
      setSelectedOrder(res || null);
      setIsDetailOpen(true);
    } catch (err) {
      alert("Không thể lấy chi tiết đơn hàng: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <OwnerLayout>
      <div className="manager-header">
        <h2>Quản lý đơn hàng</h2>
        <div style={{ display: "flex", gap: "16px", marginBottom: 16 }}>
          <select
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            disabled={loadingOrders || !restaurants.length}
          >
            <option value="" disabled>Chọn nhà hàng</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatusGroup}
            onChange={(e) => setSelectedStatusGroup(e.target.value)}
            disabled={loadingOrders}
          >
            {STATUS_GROUPS.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadingOrders ? (
        <div className="loading-spinner" style={{ textAlign: "center", padding: "20px" }}>
          <span>Đang tải...</span>
        </div>
      ) : orders.length === 0 ? (
        <p style={{ textAlign: "center", padding: "20px" }}>Không có đơn hàng nào.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Nhà hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              {selectedStatusGroup === "PENDING" && (
                <>
                  <th>Số người</th>
                  <th>Thời gian đặt</th>
                  <th>Món ăn</th>
                </>
              )}
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {selectedStatusGroup === "PENDING"
                    ? order.reservationSimpleResponse?.restaurantName || "Không có"
                    : order.reservation?.restaurantName || "Không có"}
                </td>
                <td>{order.totalPrice ? order.totalPrice.toLocaleString() + " đ" : "-"}</td>
                <td>{STATUS_LABELS[order.status] || "Không xác định"}</td>
                {selectedStatusGroup === "PENDING" && (
                  <>
                    <td>
                      {order.reservationSimpleResponse?.numberOfPeople || 0} người lớn,{" "}
                      {order.reservationSimpleResponse?.numberOfChild || 0} trẻ em
                    </td>
                    <td>
                      {order.reservationSimpleResponse?.reservationTime
                        ? new Date(order.reservationSimpleResponse.reservationTime).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      {order.menuItems?.length > 0 ? order.menuItems.map((item) => (
                        <div key={item.menuItemId}>
                          {item.menuItemName} (x{item.quantity}): {item.totalPrice?.toLocaleString()} đ
                        </div>
                      )) : "Không có món"}
                    </td>
                  </>
                )}
                <td>
                  {order.status === "PENDING" && (
                    <>
                      <button onClick={() => handleApprove(order.id, order.status)}>Duyệt</button>
                      <button onClick={() => openRejectModal(order.id)}>Hủy</button>
                    </>
                  )}
                  {selectedStatusGroup !== "PENDING" && (
                    <button onClick={() => handleViewDetail(order.id)}>Chi tiết</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isRejecting && (
        <Modal
          isOpen={isRejecting}
          onRequestClose={() => setIsRejecting(false)}
          className="ReactModal__Content"
          overlayClassName="ReactModal__Overlay"
        >
          <div className="modal-header">
            <h2>Lý do hủy đơn hàng</h2>
            <button className="close-btn" onClick={() => setIsRejecting(false)}>✕</button>
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
            <button className="submit-btn" onClick={handleCancel}>Xác nhận</button>
            <button className="cancel-btn" onClick={() => setIsRejecting(false)}>Đóng</button>
          </div>
        </Modal>
      )}

      {isDetailOpen && (
        <OrderDetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          order={selectedOrder}
        />
      )}
    </OwnerLayout>
  );
};

export default OwnerOrderManager;