import axios from "../config/axios";

// ========== CUSTOMER ==========

// Tạo đơn hàng mới
export const createOrder = async (restaurantId, orderData) => {
  return await axios.post(`/api/customers/orders/restaurant/${restaurantId}`, orderData);
};

// Lấy tất cả đơn hàng của người dùng
export const getCustomerOrders = async () => {
  return await axios.get("/api/customers/orders");
};

// Lấy đơn hàng theo nhà hàng
export const getCustomerOrdersByRestaurant = async (restaurantId) => {
  return await axios.get(`/api/customers/orders/restaurant/${restaurantId}`);
};

// Lọc đơn hàng theo trạng thái
export const getCustomerOrdersByStatuses = async (statuses) => {
  return await axios.get("/api/customers/orders/status", {
    params: { status: statuses },
  });
};

// Huỷ đơn hàng
export const cancelOrder = async (orderId) => {
  return await axios.put(`/api/customers/orders/cancel/${orderId}`);
};

// ========== OWNER ==========

// Lấy chi tiết đơn hàng
export const getOrderDetail = async (orderId) => {
  return await axios.get(`/api/owner/orders/${orderId}`);
};

// Lấy đơn hàng theo trạng thái và nhà hàng
export const getOwnerOrdersByStatuses = async (restaurantId, statuses) => {
  return await axios.get(`/api/owner/restaurant/${restaurantId}/orders`, {
    params: { status: statuses },
  });
};

// Cập nhật trạng thái đơn hàng (CONFIRMED, PAID, FAILED, v.v.)
export const updateOrderStatus = async (orderId, status) => {
  return await axios.put(`/api/owner/orders/${orderId}/status`, null, {
    params: { status },
  });
};

// Duyệt đơn hàng (alias tiện dụng)
export const approveOrder = async (orderId) => {
  return await updateOrderStatus(orderId, "CONFIRMED");
};

// Alias: để tương thích tên hàm cũ đang dùng trong giao diện
export const fetchOrdersByStatusAndRestaurant = getOwnerOrdersByStatuses;
