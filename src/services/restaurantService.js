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
    const response = await axios.get(`/api/restaurants/${restaurantId}/menu`); // Giả định endpoint giống fetchSimpleMenuByRestaurant
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

// Lấy danh sách cấp độ nhà hàng (mock data)
export const fetchRestaurantTiers = async () => {
  try {
    const mockTiers = [
      {
        id: 1,
        name: "Cơ bản",
        price: 5000,
        description: "Gói cơ bản cho nhà hàng mới",
      },
      {
        id: 2,
        name: "Phổ thông",
        price: 10000,
        description: "Gói phù hợp với đa số",
      },
      {
        id: 3,
        name: "Cao cấp",
        price: 20000,
        description: "Ưu tiên hiển thị, nhiều tiện ích",
      },
      {
        id: 4,
        name: "VIP",
        price: 30000,
        description: "Dành cho nhà hàng cao cấp",
      },
      {
        id: 5,
        name: "Premium+",
        price: 50000,
        description: "Tối đa hóa tiếp cận khách hàng",
      },
    ];
    return mockTiers;
  } catch (error) {
    console.error(
      "Lỗi khi lấy danh sách cấp độ nhà hàng:",
      error.response?.data || error.message
    );
    throw error;
  }
};
