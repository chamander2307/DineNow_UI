import axios from "../config/axios";

// ========== OWNER: Menu Item ==========

export const fetchMainCategories = async () => {
  try {
    console.log("Sending GET request to /api/main-categories...");
    const response = await axios.get("/api/main-categories");
    console.log("Response từ fetchMainCategories:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục chính:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const createMenuItem = async (restaurantId, data) => {
  try {
    console.log(`Sending POST request to /api/owner/restaurants/${restaurantId}/menu...`);
    console.log("Request data:", [...data.entries()]);
    console.log("Axios config:", axios.defaults);
    const response = await axios.post(`/api/owner/restaurants/${restaurantId}/menu`, data);
    console.log("Create menu item response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo món ăn:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    throw error;
  }
};

export const updateMenuItem = async (menuItemId, data) => {
  try {
    console.log(`Sending PUT request to /api/owner/menu-items/${menuItemId}...`);
    console.log("Request data:", [...data.entries()]);
    const response = await axios.put(`/api/owner/menu-items/${menuItemId}`, data);
    console.log("Update menu item response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật món ăn:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const deleteMenuItem = async (menuItemId) => {
  try {
    console.log(`Sending DELETE request to /api/owner/menu-items/${menuItemId}...`);
    const response = await axios.delete(`/api/owner/menu-items/${menuItemId}`);
    console.log("Delete menu item response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa món ăn:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const updateMenuItemAvailability = async (menuItemId, available) => {
  try {
    console.log(`Sending PUT request to /api/owner/menu-items/${menuItemId}/available...`);
    console.log("Params:", { available });
    const response = await axios.put(`/api/owner/menu-items/${menuItemId}/available`, null, {
      params: { available },
    });
    console.log("Update availability response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái món ăn:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const getFullMenuByOwner = async (restaurantId) => {
  try {
    console.log(`Sending GET request to /api/owner/menu-items/${restaurantId}...`);
    const response = await axios.get(`/api/owner/menu-items/${restaurantId}`);
    console.log("Get full menu response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const fetchMenuItemsByRestaurant = async (restaurantId) => {
  try {
    console.log(`Sending GET request to /api/owner/menu-items/${restaurantId}...`);
    const response = await axios.get(`/api/owner/menu-items/${restaurantId}`);
    console.log("Response từ fetchMenuItemsByRestaurant:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// ========== PUBLIC: Menu Item ==========

export const getPublicMenuByRestaurant = async (restaurantId) => {
  try {
    console.log(`Sending GET request to /api/restaurants/${restaurantId}/menu...`);
    const response = await axios.get(`/api/restaurants/${restaurantId}/menu`);
    console.log("Get public menu response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy menu công khai:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const fetchMenuItems = async (page = 0, size = 20) => {
  try {
    console.log(`Sending GET request to /api/menu-items with params:`, { page, size });
    const response = await axios.get("/api/menu-items", {
      params: { page, size },
    });
    console.log("Fetch menu items response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const fetchMenuItemByIdPublic = async (menuItemId) => {
  try {
    console.log(`Sending GET request to /api/menu-items/${menuItemId}...`);
    const response = await axios.get(`/api/menu-items/${menuItemId}`);
    console.log("Fetch public menu item response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết món ăn công khai:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const fetchMenuItemsByMainCategory = async (mainCategoryId, page = 0, size = 20) => {
  try {
    console.log(`Sending GET request to /api/menu-items/main-category/${mainCategoryId} with params:`, { page, size });
    const response = await axios.get(`/api/menu-items/main-category/${mainCategoryId}`, {
      params: { page, size },
    });
    console.log("Fetch menu items by main category response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn theo danh mục chính:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const fetchMenuItemsByCategory = async (categoryId, page = 0, size = 20) => {
  try {
    console.log(`Sending GET request to /api/menu-items/category/${categoryId} with params:`, { page, size });
    const response = await axios.get(`/api/menu-items/category/${categoryId}`, {
      params: { page, size },
    });
    console.log("Fetch menu items by category response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn theo danh mục:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const fetchFeaturedMenuItems = async () => {
  try {
    console.log("Sending GET request to /api/menu-items/featured...");
    const response = await axios.get("/api/menu-items/featured");
    console.log("Fetch featured menu items response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn nổi bật:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const filterMenuItems = async (filterData, page = 0, size = 20) => {
  try {
    console.log(`Sending POST request to /api/menu-items/filter with params:`, { page, size });
    console.log("Filter data:", filterData);
    const response = await axios.post(`/api/menu-items/filter`, filterData, {
      params: { page, size },
    });
    console.log("Filter menu items response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lọc danh sách món ăn:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};