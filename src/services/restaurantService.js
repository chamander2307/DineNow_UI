import axios from "../config/axios";

// ========== OWNER ==========

// Tạo nhà hàng mới
export const createRestaurant = async (formData) => {
  try {
    const response = await axios.post("/api/owner/restaurants", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật nhà hàng
export const updateRestaurant = async (id, formData) => {
  try {
    const response = await axios.put(`/api/owner/restaurants/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy danh sách nhà hàng của chủ sở hữu
export const fetchRestaurantsByOwner = async () => {
  try {
    const response = await axios.get("/api/owner/restaurants");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà hàng của chủ sở hữu:", error.response?.data || error.message);
    throw error;
  }
};

// Cập nhật trạng thái nhà hàng
export const updateOwnerRestaurantStatus = async (restaurantId, status) => {
  try {
    const response = await axios.put(`/api/owner/restaurants/${restaurantId}/status`, null, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// ========== CUSTOMER / GUEST ==========

// Lấy danh sách nhà hàng đã được duyệt (có phân trang)
export const fetchAllRestaurants = async (page = 0, size = 10) => {
  try {
    const response = await axios.get("/api/restaurants", {
      params: { page, size },
    });
    const content = Array.isArray(response.data?.data) ? response.data.data : [];
    const totalPages = typeof response.data?.data?.totalPages === "number" ? response.data.data.totalPages : 1;
    return { data: { content, totalPages } };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy danh sách nhà hàng nổi bật
export const fetchListOfFeaturedRestaurants = async () => {
  try {
    const response = await axios.get("/api/restaurants/featured");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà hàng nổi bật:", error.response?.data || error.message);
    throw error;
  }
};

// Tìm kiếm nhà hàng theo tên và tỉnh
export const searchRestaurants = async ({ province = "", restaurantName = "", page = 0, size = 10 }) => {
  try {
    const response = await axios.post("/api/restaurants/search", { province, restaurantName }, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy menu đơn giản theo nhà hàng (public)
export const fetchSimpleMenuByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/restaurants/${restaurantId}/menu`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy menu công khai:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy menu công khai theo nhà hàng (dùng trong RestaurantCart.js)
export const getPublicMenuByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/restaurants/${restaurantId}/menu`); // Giả định endpoint giống fetchSimpleMenuByRestaurant
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy menu công khai trong giỏ hàng:", error.response?.data || error.message);
    throw error;
  }
};

// ========== ADMIN ==========

// Xoá nhà hàng
export const deleteRestaurant = async (id) => {
  try {
    const response = await axios.delete(`/api/admin/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// Duyệt / từ chối / khóa / mở khóa nhà hàng
export const approveRestaurant = async (id, status) => {
  try {
    const response = await axios.put(`/api/admin/restaurants/${id}/status`, null, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// ========== PUBLIC ==========

// Lấy danh sách loại nhà hàng
export const fetchRestaurantTypes = async () => {
  try {
    const response = await axios.get("/api/restaurant-types");
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách loại nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy danh sách cấp độ nhà hàng (mock data)
export const fetchRestaurantTiers = async () => {
  try {
    const mockTiers = [
      { id: 1, name: "Cơ bản", price: 5000, description: "Gói cơ bản cho nhà hàng mới" },
      { id: 2, name: "Phổ thông", price: 10000, description: "Gói phù hợp với đa số" },
      { id: 3, name: "Cao cấp", price: 20000, description: "Ưu tiên hiển thị, nhiều tiện ích" },
      { id: 4, name: "VIP", price: 30000, description: "Dành cho nhà hàng cao cấp" },
      { id: 5, name: "Premium+", price: 50000, description: "Tối đa hóa tiếp cận khách hàng" },
    ];
    return mockTiers;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách cấp độ nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy chi tiết nhà hàng theo ID
export const fetchRestaurantById = async (id) => {
  try {
    const response = await axios.get(`/api/restaurants/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết nhà hàng:", error.response?.data || error.message);
    throw error;
  }
};