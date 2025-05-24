import axios from '../config/axios';

// Lấy danh sách Food Category của nhà hàng
export const getFoodCategoriesByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/owner/food-categories/${restaurantId}`);
    console.log("Response từ getFoodCategoriesByRestaurant:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục món ăn:", error);
    throw error;
  }
};

// Thêm mới Food Category cho nhà hàng
export const createFoodCategory = async (restaurantId, foodCategoryData) => {
  try {
    const response = await axios.post(`/api/owner/food-categories/${restaurantId}`, foodCategoryData);
    console.log("Response từ createFoodCategory:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo Food Category:", error);
    throw error;
  }
};

// Cập nhật Food Category
export const updateFoodCategory = async (foodCategoryId, foodCategoryData) => {
  try {
    const response = await axios.put(`/api/owner/food-categories/${foodCategoryId}`, foodCategoryData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật Food Category:", error);
    throw error;
  }
};

// Xoá Food Category
export const deleteFoodCategory = async (foodCategoryId) => {
  try {
    const response = await axios.delete(`/api/owner/food-categories/${foodCategoryId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa Food Category:", error);
    throw error;
  }
};
