import axios from '../config/axios';

// ========== ADMIN: Quản lý Người dùng ==========

// Lấy danh sách tất cả người dùng
export const fetchAllUsers = async () => {
  const res = await axios.get('/api/admin/users');
  return res.data.data;
};

// Tạo mới tài khoản Owner
export const createOwner = async (data) => {
  return await axios.post('/api/admin/users/owner', data);
};

// Lấy thông tin chi tiết người dùng theo ID
export const getUserDetails = async (userId) => {
  const res = await axios.get(`/api/admin/users/${userId}`);
  return res.data.data;
};

// ========== ADMIN: Quản lý Loại Nhà Hàng (Restaurant Type) ==========

// Tạo mới loại nhà hàng
export const createRestaurantType = async (formData) => {
  return await axios.post('/api/admin/restaurant-types', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Cập nhật loại nhà hàng
export const updateRestaurantType = async (restaurantTypeId, formData) => {
  return await axios.put(`/api/admin/restaurant-types/${restaurantTypeId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Xoá loại nhà hàng
export const deleteRestaurantType = async (restaurantTypeId) => {
  return await axios.delete(`/api/admin/restaurant-types/${restaurantTypeId}`);
};

// ========== ADMIN: Quản lý Nhà Hàng ==========

// Lấy danh sách tất cả nhà hàng (có phân trang và lọc trạng thái)
export const fetchAllRestaurants = async (page = 0, size = 20, status = "") => {
  const params = new URLSearchParams({ page, size });
  if (status) params.append("status", status);
  return await axios.get(`/api/admin/restaurants?${params.toString()}`);
};

// Cập nhật trạng thái nhà hàng
export const updateRestaurantStatus = async (restaurantId, newStatus) => {
  return await axios.put(`/api/admin/restaurants/${restaurantId}/status`, null, {
    params: { status: newStatus },
  });
};

// Lấy chi tiết nhà hàng theo ID
export const fetchRestaurantById = async (restaurantId) => {
  return await axios.get(`/api/admin/restaurants/${restaurantId}`);
};

// Xoá nhà hàng
export const deleteRestaurant = async (restaurantId) => {
  return await axios.delete(`/api/admin/restaurants/${restaurantId}`);
};

// ========== ADMIN: Quản lý Danh Mục Chính (Main Category) ==========

// Tạo danh mục chính
export const createMainCategory = async (data) => {
  return await axios.post('/api/admin/main-categories', data);
};

// Cập nhật danh mục chính
export const updateMainCategory = async (id, data) => {
  return await axios.put(`/api/admin/main-categories/${id}`, data);
};

// Xoá danh mục chính
export const deleteMainCategory = async (id) => {
  return await axios.delete(`/api/admin/main-categories/${id}`);
};

// ========== ADMIN: Quản lý Đơn hàng ==========

// Lấy tất cả đơn hàng (có phân trang)
export const fetchAdminOrders = async (page = 0, size = 10) => {
  const res = await axios.get('/api/admin/orders', {
    params: { page, size },
  });
  return res.data.data;
};

// Lọc đơn hàng theo trạng thái
export const fetchAdminOrdersByStatus = async (status, page = 0, size = 10) => {
  const res = await axios.get('/api/admin/orders/status', {
    params: { status, page, size },
  });
  return res.data.data;
};

// Lấy chi tiết đơn hàng theo ID
export const fetchAdminOrderDetails = async (orderId) => {
  const res = await axios.get(`/api/admin/orders/${orderId}`);
  return res.data.data;
};
