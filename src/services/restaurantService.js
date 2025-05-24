import axios from "../config/axios";

// ========== OWNER ==========

export const createRestaurant = async (formData) => {
  try {
    const response = await axios.post("/api/owner/restaurants", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tạo nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateRestaurant = async (id, formData) => {
  try {
    const response = await axios.put(`/api/owner/restaurants/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchRestaurantsByOwner = async () => {
  try {
    const response = await axios.get("/api/owner/restaurants");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách nhà hàng của chủ sở hữu:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateOwnerRestaurantStatus = async (restaurantId, status) => {
  try {
    const response = await axios.put(
      `/api/owner/restaurants/${restaurantId}/status`,
      null,
      {
        params: { status },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ========== CUSTOMER / GUEST ==========

export const fetchAllRestaurants = async (page = 0, size = 10) => {
  try {
    const response = await axios.get("/api/restaurants", {
      params: { page, size },
    });
    const content = Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    const totalPages =
      typeof response.data?.data?.totalPages === "number"
        ? response.data.data.totalPages
        : 1;
    return { data: { content, totalPages } };
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchListOfFeaturedRestaurants = async () => {
  try {
    const response = await axios.get("/api/restaurants/featured");
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách nhà hàng nổi bật:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const searchRestaurants = async ({
  province = "",
  restaurantName = "",
  page = 0,
  size = 10,
}) => {
  try {
    console.log("Gửi yêu cầu searchRestaurants (POST):", {
      province,
      restaurantName,
      page,
      size,
    });
    const response = await axios.post(
      "/api/restaurants/search",
      { province, restaurantName },
      {
        params: { page, size },
      }
    );
    console.log("Phản hồi từ searchRestaurants:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tìm kiếm nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchSimpleMenuByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/restaurants/${restaurantId}/menu`);
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy menu công khai:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy menu công khai theo nhà hàng (dùng trong RestaurantCart.js)
export const getPublicMenuByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/restaurants/${restaurantId}/menu`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy menu công khai trong giỏ hàng:", error.response?.data || error.message);
    throw error;
  }
};

// ========== ADMIN ==========

export const approveRestaurant = async (id, status) => {
  try {
    const response = await axios.put(
      `/api/admin/restaurants/${id}/status`,
      null,
      {
        params: { status },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ========== PUBLIC ==========

export const fetchRestaurantTypes = async () => {
  try {
    const response = await axios.get("/api/restaurant-types");
    return response.data.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách loại nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchRestaurantById = async (id) => {
  try {
    const response = await axios.get(`/api/restaurants/${id}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy chi tiết nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchRestaurantsByTypeId = async (typeId, page = 0, size = 20) => {
  try {
    console.log(
      `Sending GET request to /api/restaurants/type/${typeId} with params:`,
      { page, size }
    );
    const response = await axios.get(`/api/restaurants/type/${typeId}`, {
      params: { page, size },
    });
    console.log("Fetch restaurants by type response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà hàng theo loại:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

export const fetchRestaurantTiers = async () => {
  try {
    const res = await axios.get('/api/owner/restaurant-tiers');
    return res.data.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách cấp độ nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Lấy danh sách hạng nhà hàng (ADMIN)
export const fetchAdminRestaurantTiers = async () => {
  try {
    const res = await axios.get('/api/admin/restaurant-tiers');
    return res.data.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách hạng nhà hàng (ADMIN):",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Tạo mới hạng nhà hàng (ADMIN)
export const createRestaurantTier = async (payload) => {
  try {
    const res = await axios.post('/api/admin/restaurant-tiers', payload);
    return res; // Trả về toàn bộ res
  } catch (error) {
    console.error(
      "Lỗi khi tạo hạng nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Cập nhật hạng nhà hàng (ADMIN)
export const updateRestaurantTier = async (id, payload) => {
  try {
    const res = await axios.put(`/api/admin/restaurant-tiers/${id}`, payload);
    return res; // Trả về toàn bộ res
  } catch (error) {
    console.error(
      `Lỗi khi cập nhật hạng nhà hàng (ID: ${id}):`,
      error.response?.data || error.message
    );
    throw error;
  }
};

// Xóa hạng nhà hàng (ADMIN)
export const deleteRestaurantTier = async (id) => {
  try {
    const res = await axios.delete(`/api/admin/restaurant-tiers/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa hạng nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};