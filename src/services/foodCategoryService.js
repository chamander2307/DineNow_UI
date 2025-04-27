import axios from '../config/axios';

// Thêm mới Food Category cho nhà hàng
export const addFoodCategory = async (restaurantId, foodCategoryData) => {
  return await axios.post(`/owner/food-categories/${restaurantId}`, foodCategoryData);
};

// Cập nhật Food Category
export const updateFoodCategory = async (foodCategoryId, foodCategoryData) => {
  return await axios.put(`/owner/food-categories/${foodCategoryId}`, foodCategoryData);
};

// Xoá Food Category
export const deleteFoodCategory = async (foodCategoryId) => {
  return await axios.delete(`/owner/food-categories/${foodCategoryId}`);
};

// Lấy danh sách Food Category của nhà hàng
export const fetchFoodCategories = async (restaurantId) => {
  return await axios.get(`/owner/food-categories/${restaurantId}`);
};
