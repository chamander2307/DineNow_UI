import axios from "../config/axios";

// ========== ADMIN: Quản lý Người dùng ==========

export const fetchAllUsers = async () => {
  try {
    const res = await axios.get("/api/admin/users");
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    throw error;
  }
};

export const createOwner = async (data) => {
  try {
    const res = await axios.post("/api/admin/users/owner", data);
    return res.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Lỗi khi tạo tài khoản Owner";
    console.error("Lỗi khi tạo tài khoản Owner:", errorMessage);
    throw new Error(errorMessage);
  }
};

export const getUserDetails = async (userId) => {
  try {
    const res = await axios.get(`/api/admin/users/${userId}`);
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết người dùng:", error);
    throw error;
  }
};

// ========== ADMIN: Quản lý Loại Nhà Hàng ==========

export const createRestaurantType = async (formData) => {
  try {
    const res = await axios.post("/api/admin/restaurant-types", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo loại nhà hàng:", error);
    throw error;
  }
};

export const updateRestaurantType = async (restaurantTypeId, formData) => {
  try {
    const res = await axios.put(
      `/api/admin/restaurant-types/${restaurantTypeId}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật loại nhà hàng:", error);
    throw error;
  }
};

export const deleteRestaurantType = async (restaurantTypeId) => {
  try {
    const res = await axios.delete(
      `/api/admin/restaurant-types/${restaurantTypeId}`
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa loại nhà hàng:", error);
    throw error;
  }
};

// ========== ADMIN: Quản lý Nhà Hàng ==========

export const fetchAllRestaurants = async (page = 0, size = 20, status = "") => {
  try {
    const params = new URLSearchParams({ page, size });
    if (status) params.append("status", status);
    const res = await axios.get(`/api/admin/restaurants?${params.toString()}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà hàng:", error);
    throw error;
  }
};

export const updateRestaurantStatus = async (restaurantId, newStatus) => {
  try {
    const res = await axios.put(
      `/api/admin/restaurants/${restaurantId}?status=${newStatus}`
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái nhà hàng:", error);
    throw error;
  }
};

export const fetchRestaurantById = async (restaurantId) => {
  try {
    const res = await axios.get(`/api/admin/restaurants/${restaurantId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết nhà hàng:", error);
    throw error;
  }
};

// ========== ADMIN: Quản lý Danh Mục Chính ==========

export const fetchAllMainCategories = async () => {
  try {
    const res = await axios.get("/api/admin/main-categories");
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách danh mục chính:", error);
    throw error;
  }
};

export const createMainCategory = async (data) => {
  try {
    const res = await axios.post("/api/admin/main-categories", data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo danh mục chính:", error);
    throw error;
  }
};

export const updateMainCategory = async (id, data) => {
  try {
    const res = await axios.put(`/api/admin/main-categories/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục chính:", error);
    throw error;
  }
};

export const deleteMainCategory = async (id) => {
  try {
    const res = await axios.delete(`/api/admin/main-categories/${id}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa danh mục chính:", error);
    throw error;
  }
};

// ========== ADMIN: Quản lý Đơn hàng ==========

export const fetchAdminOrders = async (page = 0, size = 10) => {
  try {
    const res = await axios.get("/api/admin/orders", {
      params: { page, size },
    });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw error;
  }
};

export const fetchAdminOrdersByStatus = async (status, page = 0, size = 10) => {
  try {
    const res = await axios.get("/api/admin/orders/status", {
      params: { status, page, size },
    });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lọc đơn hàng theo trạng thái:", error);
    throw error;
  }
};

export const fetchAdminOrderDetails = async (orderId) => {
  try {
    const res = await axios.get(`/api/admin/orders/${orderId}`);
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    throw error;
  }
};

// ========== ADMIN: Dashboard ==========

export const fetchAdminDashboardData = async () => {
  try {
    const res = await axios.get("/api/admin/dashboard");
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard admin:", error);
    throw error;
  }
};
//========== ADMIN: Profits ==========
export const fetchMonthlyRestaurantProfits = async (yearMonth) => {
  try {
    const res = await axios.get(
      `/api/admin/profits/restaurants/monthly?yearMonth=${yearMonth}`
    );
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê lợi nhuận nhà hàng theo tháng:", error);
    throw error;
  }
};
export const fetchTotalRestaurantProfits = async () => {
  try {
    const res = await axios.get("/api/admin/profits/restaurants/total");
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê lợi nhuận nhà hàng theo năm:", error);
    throw error;
  }
};

export const fetchRangeRestaurantProfits = async (startMonth, endMonth) => {
  try {
    const res = await axios.get(
      `/api/admin/profits/restaurants/monthly/range?startMonth=${startMonth}&endMonth=${endMonth}`
    );
    console.log("fetchRangeRestaurantProfits response:", res.data);
    return res.data.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy thống kê lợi nhuận nhà hàng theo khoảng thời gian:",
      error
    );
    throw error;
  }
};
