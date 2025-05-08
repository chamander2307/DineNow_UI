import axios from "../config/axios";

// ========== OWNER: Menu Item ==========

// Tạo món ăn mới cho nhà hàng cụ thể
export const createMenuItem = async (restaurantId, data) => {
  return await axios.post(`/api/owner/restaurants/${restaurantId}/menu`, data);
};

// Cập nhật món ăn
export const updateMenuItem = async (menuItemId, data) => {
  return await axios.put(`/api/owner/menu-items/${menuItemId}`, data);
};

// Xoá món ăn
export const deleteMenuItem = async (menuItemId) => {
  return await axios.delete(`/api/owner/menu-items/${menuItemId}`);
};

// Cập nhật trạng thái còn bán (available)
export const updateMenuItemAvailability = async (menuItemId, available) => {
  return await axios.put(`/api/owner/menu-items/${menuItemId}/available`, null, {
    params: { available },
  });
};

// Lấy tất cả món ăn của 1 nhà hàng do OWNER sở hữu
export const getFullMenuByOwner = async (restaurantId) => {
  return await axios.get(`/api/owner/restaurants/${restaurantId}/menu`);
};

// Lấy chi tiết 1 món ăn
export const fetchMenuItemById = async (menuItemId) => {
  return await axios.get(`/api/owner/menu-items/${menuItemId}`);
};

// ========== PUBLIC: Menu Item (dành cho khách) ==========

// Lấy danh sách món ăn công khai của nhà hàng (khách xem)
export const getPublicMenuByRestaurant = async (restaurantId) => {
  return await axios.get(`/api/restaurants/${restaurantId}/menu`);
};

// lấy danh sách danh mục món
export const fetchMainCategories = async () => {
  const res = await axios.get('/api/main-categories');
  return res.data.data;
};
