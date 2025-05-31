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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      let data = [];
      if (statusFilter) {
        const response = await fetchAdminOrdersByStatus(statusFilter, 0, 10);
        data = Array.isArray(response.data) ? response.data : [];
      } else {
        data = await fetchAdminOrders(0, 10); // Cái này đã trả về mảng rồi
      }

      console.log("Orders data:", data);
      setOrders(data);
      setMessage(data.length === 0 ? "Không có đơn hàng" : "");
    } catch (error) {
      console.error("Error loading orders:", error);
      setMessage("Không thể tải đơn hàng");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };


  const viewOrderDetails = async (orderId) => {
    setIsLoading(true);
    try {
      const order = await fetchAdminOrderDetails(orderId);
      console.log("Order details:", order); // Debug order
      setSelectedOrder(order || null);
    } catch (error) {
      console.error("Error loading order details:", error);
      setMessage("Không thể tải chi tiết đơn hàng");
      setSelectedOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setMessage(""); // Clear any error message
  };

  const statusText = {
    PENDING: "Chờ xử lý",
    CONFIRMED: "Đã xác nhận",
    PAID: "Đã thanh toán",
    CANCELLED: "Đã hủy",
    FAILED: "Thất bại",
    COMPLETED: "Hoàn tất",
  };


  return (
    <AdminLayout>
      <div className="admin-order-manager">
        <h2>Quản lý đơn hàng</h2>

        {message && <p className="message">{message}</p>}
        {isLoading && <p>Đang tải...</p>}

        <div className="filter-section">
          <label>Trạng thái:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="CONFIRMED">Đã xác nhận</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="CANCELLED">Đã huỷ</option>
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
                  <td>{statusText[o.status] || o.status || "N/A"}</td>
                  <td>
                    {o.reservation?.reservationTime
                      ? new Date(o.reservation.reservationTime).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                      : "N/A"}
                  </td>
                  <td>
                    <button onClick={() => viewOrderDetails(o.id)} disabled={isLoading}>
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">{isLoading ? "Đang tải..." : "Không có đơn hàng"}</td>
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