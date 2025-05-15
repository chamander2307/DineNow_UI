import axios from "../config/axios";

// ========== OWNER: Menu Item ==========

export const fetchMainCategories = async () => {
  try {
    const response = await axios.get("/api/main-categories");
    console.log("Response từ fetchMainCategories:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục chính:", error);
    throw error;
  }
};

export const createMenuItem = async (restaurantId, data) => {
  try {
    const response = await axios.post(`/api/owner/restaurants/${restaurantId}/menu`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo món ăn:", error);
    throw error;
  }
};

export const updateMenuItem = async (menuItemId, data) => {
  try {
    const response = await axios.put(`/api/owner/menu-items/${menuItemId}`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật món ăn:", error);
    throw error;
  }
};

export const deleteMenuItem = async (menuItemId) => {
  try {
    const response = await axios.delete(`/api/owner/menu-items/${menuItemId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error);
    throw error;
  }
};

export const updateMenuItemAvailability = async (menuItemId, available) => {
  try {
    const response = await axios.put(`/api/owner/menu-items/${menuItemId}/available`, null, {
      params: { available },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái món ăn:", error);
    throw error;
  }
};

export const getFullMenuByOwner = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/owner/menu-items/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    throw error;
  }
};

export const fetchMenuItemById = async (menuItemId) => {
  try {
    const response = await axios.get(`/api/owner/menu-items/${menuItemId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết món ăn:", error);
    throw error;
  }
};

// ========== PUBLIC: Menu Item ==========

export const getPublicMenuByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/restaurants/${restaurantId}/menu`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy menu công khai:", error);
    throw error;
  }
};

export const fetchMenuItems = async (page = 0, size = 20) => {
  try {
    const response = await axios.get("/api/menu-items", {
      params: { page, size },
    });
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    throw error;
  }
};
export const fetchMenuItemsByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/owner/menu-items/${restaurantId}`);
    console.log("Response từ fetchMenuItemsByRestaurant:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    throw error;
  }
};