import axios from "../config/axios";

// CUSTOMER - tạo đơn hàng
export const createOrder = async (restaurantId, orderData) => {
  return await axios.post(`/customers/orders/restaurant/${restaurantId}`, orderData);
};

// CUSTOMER - danh sách đơn hàng
export const getCustomerOrders = async () => {
  return await axios.get("/customers/orders");
};

export const getCustomerOrdersByRestaurant = async (restaurantId) => {
  return await axios.get(`/customers/orders/restaurant/${restaurantId}`);
};

export const getCustomerOrdersByStatuses = async (statuses) => {
  return await axios.get("/customers/orders/status", {
    params: { status: statuses },
  });
};

export const cancelOrder = async (orderId) => {
  return await axios.put(`/customers/orders/cancel/${orderId}`);
};

// OWNER - đơn hàng
export const getOrderDetail = async (orderId) => {
  return await axios.get(`/owner/orders/${orderId}`);
};

export const getOwnerOrdersByStatuses = async (restaurantId, statuses) => {
  return await axios.get(`/owner/restaurant/${restaurantId}/orders`, {
    params: { status: statuses },
  });
};

export const updateOrderStatus = async (orderId, status) => {
  return await axios.put(`/owner/orders/${orderId}/status`, status);
};
