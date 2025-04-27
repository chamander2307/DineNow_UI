import axios from "../config/axios"
// (1) Tạo món ăn mới cho nhà hàng
export const createMenuItem = (restaurantId, formData) => {
  return axios.post(`/api/owner/restaurants/${restaurantId}/menu`, formData);
};

// (2) Lấy danh sách món ăn đang phục vụ của nhà hàng (available = true)
export const getAvailableMenuByRestaurant = (restaurantId) => {
  return axios.get(`/api/restaurants/${restaurantId}/menu`);
};

// (3) Lấy tất cả món ăn đang phục vụ (phân trang)
export const getAllMenuItems = (page = 0, size = 20) => {
  return axios.get(`/api/menu-items?page=${page}&size=${size}`);
};

// (4) Cập nhật thông tin món ăn (dạng form-data)
export const updateMenuItem = (menuItemId, formData) => {
  return axios.put(`/api/owner/menu-items/${menuItemId}`, formData);
};

// (5) Xoá món ăn khỏi thực đơn
export const deleteMenuItem = (menuItemId) => {
  return axios.delete(`/api/owner/menu-items/${menuItemId}`);
};

// (6) Lấy chi tiết món ăn theo ID
export const getMenuItemDetail = (menuItemId) => {
  return axios.get(`/api/menu-items/${menuItemId}`);
};

// (7) Lấy danh sách món ăn của nhà hàng (gồm cả unavailable)
export const getFullMenuByOwner = (restaurantId) => {
  return axios.get(`/api/owner/menu-items/${restaurantId}`);
};

// (8) Cập nhật trạng thái phục vụ (available) của món ăn
export const updateMenuItemAvailability = (menuItemId, available) => {
  return axios.put(`/api/owner/menu-items/${menuItemId}/available?available=${available}`);
};
