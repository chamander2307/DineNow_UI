import axios from '../config/axios';

//  Lấy danh sách tất cả nhà hàng (có phân trang)
export const fetchAllRestaurants = async (page = 0, size = 20) => {
  // 💡 Dùng để hiển thị danh sách nhà hàng ở trang chính hoặc trong danh sách gợi ý
  return await axios.get(`/api/restaurants`, {
    params: { page, size }
  });
};

// Lấy thông tin chi tiết của 1 nhà hàng theo ID
export const fetchRestaurantById = async (restaurantId) => {
  //  Dùng để hiển thị trang chi tiết của nhà hàng khi người dùng click vào
  return await axios.get(`/api/restaurants/${restaurantId}`);
};

// Tìm kiếm nhà hàng theo điều kiện (filter nâng cao)
export const searchRestaurants = async (searchData, page = 0, size = 10) => {
  //  Dùng khi người dùng lọc nhà hàng theo khu vực, loại món ăn, điểm đánh giá, v.v.
  return await axios.post(`/api/restaurants/search?page=${page}&size=${size}`, searchData);
};

//  Lấy menu (món ăn) của nhà hàng theo ID
export const fetchMenuOfRestaurant = async (restaurantId) => {
  // Dùng trong trang chi tiết nhà hàng để hiển thị danh sách món ăn khả dụng
  return await axios.get(`/api/restaurants/${restaurantId}/menu`);
};
// Dành cho OWNER
export const createRestaurant = async (formData) => {
    return await axios.post('/api/owner/restaurants', formData);
  };
  
  export const updateRestaurant = async (restaurantId, formData) => {
    return await axios.put(`/api/owner/restaurants/${restaurantId}`, formData);
  };
  // Duyệt nhà hàng (ADMIN)
export const approveRestaurant = async (restaurantId) => {
  return await axios.put(`/api/admin/restaurants/${restaurantId}/approve`);
};

// Xoá nhà hàng (ADMIN)
export const deleteRestaurant = async (restaurantId) => {
  return await axios.delete(`/api/admin/restaurants/${restaurantId}`);
};
