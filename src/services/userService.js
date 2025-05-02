import axios from '../config/axios';

//  1. Lấy thông tin chi tiết user đang đăng nhập
export const getUserProfile = async () => {
  const res = await axios.get('/users/me');
  return res.data.data; // trả về UserDTO
};

// 2. Cập nhật thông tin người dùng
export const updateUserProfile = async (updateData) => {
  const res = await axios.put('/users/me', updateData);
  return res.data.data; // trả về UserDTO sau cập nhật
};

//Lấy danh sách nhà hàng yêu thích
export const getFavoriteRestaurants = async () => {
  const res = await axios.get('/users/me/favorites');
  return res.data.data; // trả về mảng FavoriteRestaurantResponseDTO
};

// 4. Thêm nhà hàng vào danh sách yêu thích
export const addFavoriteRestaurant = async (restaurantId) => {
  const res = await axios.post(`/users/me/favorites/${restaurantId}`);
  return res.data.data; // trả về thông tin nhà hàng vừa thêm
};

// 5. Xoá nhà hàng khỏi danh sách yêu thích
export const removeFavoriteRestaurant = async (restaurantId) => {
  const res = await axios.delete(`/users/me/favorites/${restaurantId}`);
  return res.data.data; // true nếu xoá thành công
};
