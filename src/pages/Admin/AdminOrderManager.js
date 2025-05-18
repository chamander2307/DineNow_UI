import React, { useEffect, useState } from "react";
import {
  fetchAdminOrders,
  fetchAdminOrdersByStatus,
  fetchAdminOrderDetails,
} from "../../services/adminService";
import AdminLayout from "./AdminLayout";
import OrderDetailModal from "../../components/admin/OrderDetailModal";
import "../../assets/styles/admin/AdminOrderManager.css";

const AdminOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      const res = statusFilter
        ? await fetchAdminOrdersByStatus(statusFilter)
        : await fetchAdminOrders();
      console.log("API response:", res); // Debug dữ liệu
      const data = Array.isArray(res) ? res : [];
      setOrders(data);
      setMessage(data.length === 0 ? "Không có đơn hàng" : "");
    } catch (error) {
      console.error("Error loading orders:", error);
      setMessage("Không thể tải đơn hàng");
      setOrders([]);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const detail = await fetchAdminOrderDetails(orderId);
      console.log("Order details:", detail); // Debug chi tiết
      setSelectedOrder(detail || null);
    } catch (error) {
      console.error("Error loading order details:", error);
      setMessage("Không thể tải chi tiết đơn hàng");
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  return (
    <AdminLayout>
      <div className="admin-order-manager">
        <h2>Quản lý đơn hàng</h2>

        {message && <p className="message">{message}</p>}

        <div className="filter-section">
          <label>Trạng thái:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="APPROVED">Đã xác nhận</option>
            <option value="REJECTED">Bị từ chối</option>
            <option value="FAILED">Thất bại</option>
            <option value="COMPLETED">Hoàn tất</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Khách hàng</th>
              <th>Nhà hàng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thời gian</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id || "N/A"}</td>
                  <td>{o.reservation?.customerName || "N/A"}</td>
                  <td>{o.reservation?.restaurantName || "N/A"}</td>
                  <td>{o.totalPrice ? o.totalPrice.toLocaleString() : "0"} đ</td>
                  <td>{o.status || "N/A"}</td>
                  <td>
                    {o.reservation?.reservationTime
                      ? new Date(o.reservation.reservationTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    <button onClick={() => viewOrderDetails(o.id)}>Xem</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Không có đơn hàng</td>
              </tr>
            )}
          </tbody>
        </table>

        <OrderDetailModal
          isOpen={!!selectedOrder}
          onClose={closeOrderDetails}
          order={selectedOrder}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminOrderManager;