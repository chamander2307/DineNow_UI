import axios from "../config/axios";

// ========== OWNER ==========

// Tạo nhà hàng mới
export const createRestaurant = async (formData) => {
  return await axios.post("/api/owner/restaurants", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Cập nhật nhà hàng
export const updateRestaurant = async (id, formData) => {
  return await axios.put(`/api/owner/restaurants/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// Lấy danh sách nhà hàng của chủ sở hữu
export const fetchRestaurantsByOwner = async () => {
  return await axios.get("/api/owner/restaurants");
};
//câp nhật trạng thái nhà hàng
export const updateOwnerRestaurantStatus = async (restaurantId, status) => {
  return await axios.put(`/api/owner/restaurants/${restaurantId}/status`, null, {
    params: { status },
  });
};

// ========== CUSTOMER / GUEST ==========

// Lấy danh sách nhà hàng đã được duyệt (có phân trang)
export const fetchAllRestaurants = async (page = 0, size = 10) => {
  const res = await axios.get("/api/restaurants", {
    params: { page, size },
  });

  const content = Array.isArray(res.data?.data?.content) ? res.data.data.content : [];
  const totalPages = typeof res.data?.data?.totalPages === "number" ? res.data.data.totalPages : 1;

  return {
    data: {
      content,
      totalPages,
    },
  };
};

// Xem chi tiết nhà hàng
export const fetchRestaurantById = async (id) => {
  return await axios.get(`/api/restaurants/${id}`);
};

// Tìm kiếm nhà hàng theo tên và tỉnh
export const searchRestaurants = async ({
  province = "",
  restaurantName = "",
  page = 0,
  size = 10,
}) => {
  return await axios.get("/api/restaurants/search", {
    params: { province, restaurantName, page, size },
  });
};

// Lấy menu đơn giản theo nhà hàng (public)
export const fetchSimpleMenuByRestaurant = async (restaurantId) => {
  return await axios.get(`/api/restaurants/${restaurantId}/menu`);
};

// ========== ADMIN ==========

// Xoá nhà hàng
export const deleteRestaurant = async (id) => {
  return await axios.delete(`/api/admin/restaurants/${id}`);
};

// Duyệt / từ chối / khoá / mở khoá nhà hàng
export const approveRestaurant = async (id, status) => {
  return await axios.put(`/api/admin/restaurants/${id}/status`, null, {
    params: { status },
  });
};
//public
//lấy danh sách loai nhà hàng
export const fetchRestaurantTypes = async () => {
  const res = await axios.get("/api/restaurant-types");
  return res.data.data;
};
//lấy danh sách cấp độ nhà hàng
const mockTiers = [
  { id: 1, name: "Cơ bản", price: 5000, description: "Gói cơ bản cho nhà hàng mới" },
  { id: 2, name: "Phổ thông", price: 10000, description: "Gói phù hợp với đa số" },
  { id: 3, name: "Cao cấp", price: 20000, description: "Ưu tiên hiển thị, nhiều tiện ích" },
  { id: 4, name: "VIP", price: 30000, description: "Dành cho nhà hàng cao cấp" },
  { id: 5, name: "Premium+", price: 50000, description: "Tối đa hóa tiếp cận khách hàng" },
];

export const fetchRestaurantTiers = async () => {
  return Promise.resolve({ data: { data: mockTiers } });
};