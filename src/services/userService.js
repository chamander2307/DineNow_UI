import axios from '../config/axios';

// Lấy thông tin người dùng hiện tại
export const getUserProfile = async () => {
  try {
    const response = await axios.get('/api/users/me');
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (updateData) => {
  try {
    const response = await axios.put('/api/users/me', updateData);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    throw error;
  }
};

// Lấy danh sách nhà hàng yêu thích
export const getFavoriteRestaurants = async () => {
  try {
    const response = await axios.get('/api/users/me/favorites');
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà hàng yêu thích:", error);
    throw error;
  }
};

// Thêm nhà hàng vào danh sách yêu thích
export const addFavoriteRestaurant = async (restaurantId) => {
  try {
    const response = await axios.post(`/api/users/me/favorites/${restaurantId}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi thêm nhà hàng yêu thích:", error);
    throw error;
  }
};

// Xoá nhà hàng khỏi danh sách yêu thích
export const removeFavoriteRestaurant = async (restaurantId) => {
  try {
    const response = await axios.delete(`/api/users/me/favorites/${restaurantId}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi xóa nhà hàng yêu thích:", error);
    throw error;
  }
};