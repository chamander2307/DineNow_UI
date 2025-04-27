import axios from "../config/axios";

// ========== OWNER ==========

// Tạo nhà hàng mới
export const createRestaurant = async (formData) => {
  return await axios.post("/owner/restaurants", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Cập nhật nhà hàng
export const updateRestaurant = async (id, formData) => {
  return await axios.put(`/owner/restaurants/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Lấy danh sách nhà hàng của chủ sở hữu
export const fetchRestaurantsByOwner = async () => {
  return await axios.get("/owner/restaurants");
};

// ========== CUSTOMER / GUEST ==========

export const fetchAllRestaurants = async (page = 0, size = 20) => {
  return await axios.get("/restaurants", {
    params: { page, size },
  });
};

export const fetchRestaurantById = async (id) => {
  return await axios.get(`/restaurants/${id}`);
};

export const searchRestaurants = async ({ province = "", restaurantName = "", page = 0, size = 10 }) => {
  return await axios.get("/restaurants/search", {
    params: { province, restaurantName, page, size },
  });
};

// ========== ADMIN ==========

export const deleteRestaurant = async (id) => {
  return await axios.delete(`/admin/restaurants/${id}`);
};

export const approveRestaurant = async (id, status) => {
  return await axios.put(`/admin/restaurants/${id}/status`, null, {
    params: { status },
  });
};
