import React, { useEffect, useState, useContext } from "react";
import OwnerLayout from "./OwnerLayout";
import { fetchRestaurantsByOwner } from "../../services/restaurantService";
import {
  getOwnerOrdersByStatuses,
  updateOrderStatus,
  cancelOrder,
} from "../../services/orderService";
import { UserContext } from "../../contexts/UserContext";

const STATUS_OPTIONS = [
  { value: "confirmed_paid", label: "Đã xác nhận & Đã thanh toán" },
  { value: "canceled_failed", label: "Đã huỷ & Thất bại" },
  { value: "completed", label: "Hoàn thành" },
];

const OwnerOrderManager = () => {
  const { user, loading } = useContext(UserContext);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && user?.role === "OWNER") {
      loadRestaurants();
    }
  }, [loading, user]);

  useEffect(() => {
    if (selectedRestaurantId || selectedStatus === "") {
      loadOrders();
    }
  }, [selectedRestaurantId, selectedStatus]);

  const loadRestaurants = async () => {
    try {
      const res = await fetchRestaurantsByOwner();
      const data = Array.isArray(res) ? res : [];
      setRestaurants(data);
    } catch (err) {
      console.error("Lỗi tải nhà hàng", err);
    }
  };

  const loadOrders = async () => {
    try {
      const statusList =
        selectedStatus === "confirmed_paid"
          ? ["CONFIRMED", "PAID"]
          : selectedStatus === "canceled_failed"
          ? ["CANCELED", "FAILED"]
          : selectedStatus === "completed"
          ? ["COMPLETED"]
          : ["PENDING"]; // mặc định

      const res = await getOwnerOrdersByStatuses(selectedRestaurantId || null, statusList);
      setOrders(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Lỗi tải đơn hàng", err);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Xác nhận duyệt đơn này?")) return;
    try {
      await updateOrderStatus(id, "CONFIRMED");
      loadOrders();
    } catch (err) {
      console.error("Lỗi duyệt đơn", err);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Huỷ đơn này?")) return;
    try {
      await cancelOrder(id);
      loadOrders();
    } catch (err) {
      console.error("Lỗi huỷ đơn", err);
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
          >
            <option value="">-- Tất cả nhà hàng --</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">-- Chờ xử lý (PENDING) --</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Nhà hàng</th>
            <th>Số lượng món</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8">Không có đơn hàng nào.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerName}</td>
                <td>{order.restaurantName || "-"}</td>
                <td>{order.totalItems}</td>
                <td>{order.totalPrice.toLocaleString()} đ</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === "PENDING" ? (
                    <>
                      <button onClick={() => handleApprove(order.id)}>Duyệt</button>
                      <button onClick={() => handleCancel(order.id)} style={{ marginLeft: 8 }}>
                        Huỷ
                      </button>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </OwnerLayout>
  );
};

export default OwnerOrderManager;
