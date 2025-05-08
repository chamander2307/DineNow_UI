import React, { useEffect, useState } from "react";
import {
  fetchAdminOrders,
  fetchAdminOrdersByStatus,
  fetchAdminOrderDetails,
} from "../../services/adminService";
import AdminLayout from "./AdminLayout";
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
      setOrders(res);
    } catch {
      setMessage("Không thể tải đơn hàng");
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const detail = await fetchAdminOrderDetails(orderId);
      setSelectedOrder(detail);
    } catch {
      setMessage("Không thể tải chi tiết đơn hàng");
    }
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
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="CANCELED">Đã huỷ</option>
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
            {orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.customerName}</td>
                <td>{o.restaurantName}</td>
                <td>{o.totalPrice?.toLocaleString()} đ</td>
                <td>{o.status}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => viewOrderDetails(o.id)}>Xem</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedOrder && (
          <div className="order-detail-popup">
            <h3>Chi tiết đơn hàng #{selectedOrder.id}</h3>
            <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
            <p><strong>Nhà hàng:</strong> {selectedOrder.restaurantName}</p>
            <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
            <p><strong>Thời gian:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Món ăn:</strong></p>
            <ul>
              {selectedOrder.items?.map((item, i) => (
                <li key={i}>
                  {item.name} × {item.quantity} ({item.price?.toLocaleString()} đ)
                </li>
              ))}
            </ul>
            <p><strong>Tổng cộng:</strong> {selectedOrder.totalPrice?.toLocaleString()} đ</p>
            <button onClick={() => setSelectedOrder(null)}>Đóng</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrderManager;
