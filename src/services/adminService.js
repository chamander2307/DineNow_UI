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
