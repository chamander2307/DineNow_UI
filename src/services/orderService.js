import axios from "../config/axios";

// ========== CUSTOMER ==========

export const createOrder = async (restaurantId, orderData) => {
  try {
    const response = await axios.post(`/api/customers/orders/restaurant/${restaurantId}`, orderData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};

export const getCustomerOrders = async () => {
  try {
    const response = await axios.get("/api/customers/orders");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng của khách:", error);
    throw error;
  }
};

export const getCustomerOrdersByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/customers/orders/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo nhà hàng:", error);
    throw error;
  }
};

export const getCustomerOrdersByStatuses = async (statuses) => {
  try {
    const response = await axios.get("/api/customers/orders/status", {
      params: { status: statuses },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lọc đơn hàng theo trạng thái:", error);
    throw error;
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await axios.put(`/api/customers/orders/cancel/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi hủy đơn hàng:", error);
    throw error;
  }
};

// ========== OWNER ==========

export const getOrderDetail = async (orderId) => {
  try {
    const response = await axios.get(`/api/owner/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    throw error;
  }
};

export const getAllOwnerOrdersByStatuses = async (statusList) => {
  try {
    const response = await axios.get(`/api/owner/orders`, {
      params: { status: statusList },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw error;
  }
};

export const getOwnerOrdersByRestaurant = async (restaurantId, statusList) => {
  try {
    const response = await axios.get(`/api/owner/restaurant/${restaurantId}/orders`, {
      params: { status: statusList },
      paramsSerializer: (params) => {
        return params.status.map((s) => `status=${s}`).join("&");
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng theo nhà hàng:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status, reason = null) => {
  try {
    const data = reason ? { reason } : {};
    const response = await axios.put(`/api/owner/orders/${orderId}/status`, data, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    throw error;
  }
};

export const approveOrder = async (orderId) => {
  try {
    return await updateOrderStatus(orderId, "CONFIRMED");
  } catch (error) {
    console.error("Lỗi khi phê duyệt đơn hàng:", error);
    throw error;
  }
};

export const fetchOrdersByStatusAndRestaurant = getOwnerOrdersByRestaurant;