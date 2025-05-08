import axios from '../config/axios';

// 1. Lấy thông tin người dùng hiện tại
export const getUserProfile = async () => {
  const res = await axios.get('/api/users/me');
  return res.data.data;
};

// 2. Cập nhật thông tin người dùng
export const updateUserProfile = async (updateData) => {
  const res = await axios.put('/api/users/me', updateData);
  return res.data.data;
};

// 3. Lấy danh sách nhà hàng yêu thích
export const getFavoriteRestaurants = async () => {
  const res = await axios.get('/api/users/me/favorites');
  return res.data.data;
};

// 4. Thêm nhà hàng vào danh sách yêu thích
export const addFavoriteRestaurant = async (restaurantId) => {
  const res = await axios.post(`/api/users/me/favorites/${restaurantId}`);
  return res.data.data;
};

// 5. Xoá nhà hàng khỏi danh sách yêu thích
export const removeFavoriteRestaurant = async (restaurantId) => {
  const res = await axios.delete(`/api/users/me/favorites/${restaurantId}`);
  return res.data.data;
};
