import axios from '../config/axios';

// Tạo món ăn mới cho nhà hàng (OWNER)
export const createMenuItem = async (restaurantId, formData) => {
  return await axios.post(`/owner/restaurants/${restaurantId}/menu`, formData);
};

// Cập nhật món ăn theo ID
export const updateMenuItem = async (menuItemId, formData) => {
  return await axios.put(`/owner/menu-items/${menuItemId}`, formData);
};

// Xoá món ăn theo ID
export const deleteMenuItem = async (menuItemId) => {
  return await axios.delete(`/owner/menu-items/${menuItemId}`);
};

// Lấy danh sách món ăn của 1 nhà hàng do OWNER sở hữu
export const getFullMenuByOwner = async (restaurantId) => {
  return await axios.get(`/owner/menu-items/${restaurantId}`);
};

// Cập nhật trạng thái phục vụ (còn món / hết món)
export const updateMenuItemAvailability = async (menuItemId, available) => {
  return await axios.put(`/owner/menu-items/${menuItemId}/available`, null, {
    params: { available },
  });
};
