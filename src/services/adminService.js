import axios from '../config/axios';

// ========== ADMIN: Quản lý User ==========

// Lấy danh sách tất cả người dùng
export const fetchAllUsers = async () => {
  const res = await axios.get('/admin/users');
  return res.data.data;
};

// ========== ADMIN: Quản lý Restaurant Type ==========

// Lấy danh sách loại nhà hàng
export const fetchRestaurantTypes = async () => {
  const res = await axios.get('/admin/restaurant-types');
  return res.data.data;
};

// Tạo mới loại nhà hàng
export const createRestaurantType = async (formData) => {
  return await axios.post('/admin/restaurant-types', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Cập nhật loại nhà hàng
export const updateRestaurantType = async (restaurantTypeId, formData) => {
  return await axios.put(`/admin/restaurant-types/${restaurantTypeId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Xoá loại nhà hàng
export const deleteRestaurantType = async (restaurantTypeId) => {
  return await axios.delete(`/admin/restaurant-types/${restaurantTypeId}`);
};
// Tạo owner mới
export const createOwner = async (data) => {
  return await axios.post("/admin/users/owner", data);
};

// Duyệt/trạng thái nhà hàng
export const approveRestaurant = async (restaurantId) => {
  return await axios.put(`/admin/restaurants/approve/${restaurantId}`);
};

export const rejectRestaurant = async (restaurantId) => {
  return await axios.put(`/admin/restaurants/reject/${restaurantId}`);
};

export const blockRestaurant = async (restaurantId) => {
  return await axios.put(`/admin/restaurants/block/${restaurantId}`);
};

export const unblockRestaurant = async (restaurantId) => {
  return await axios.put(`/admin/restaurants/unblock/${restaurantId}`);
};

// Lấy danh sách nhà hàng theo trạng thái
export const getPendingRestaurants = async (page = 0, size = 20) => {
  return await axios.get("/admin/restaurants/pending", { params: { page, size } });
};

export const getApprovedRestaurants = async (page = 0, size = 20) => {
  return await axios.get("/admin/restaurants/approved", { params: { page, size } });
};

export const getRejectedRestaurants = async (page = 0, size = 20) => {
  return await axios.get("/admin/restaurants/rejected", { params: { page, size } });
};

export const getBlockedRestaurants = async (page = 0, size = 20) => {
  return await axios.get("/admin/restaurants/blocked", { params: { page, size } });
};

// Main Categories
export const fetchMainCategories = async () => {
  return await axios.get("/admin/main-categories");
};

export const createMainCategory = async (data) => {
  return await axios.post("/admin/main-categories", data);
};

export const updateMainCategory = async (id, data) => {
  return await axios.put(`/admin/main-categories/${id}`, data);
};

export const deleteMainCategory = async (id) => {
  return await axios.delete(`/admin/main-categories/${id}`);
};
