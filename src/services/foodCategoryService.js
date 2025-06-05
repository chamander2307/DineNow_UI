import axios from '../config/axios';
import httpStatusMessages from '../constants/httpStatusMessages';

// Hàm xử lý lỗi trả về theo status
const handleResponse = (response) => {
  const resData = response.data;
  const statusCode = resData.status || response.status || 500;

  if (statusCode !== 200 && statusCode !== 201 && statusCode !== 204) {
    const message = resData.message || httpStatusMessages[statusCode] || 'Lỗi không xác định';
    const error = new Error(message);
    error.response = { status: statusCode, data: resData };
    throw error;
  }

  return resData.data;
};

// Lấy danh sách Food Category của nhà hàng
export const getFoodCategoriesByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/owner/food-categories/${restaurantId}`);
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Thêm mới Food Category cho nhà hàng
export const createFoodCategory = async (restaurantId, foodCategoryData) => {
  try {
    const response = await axios.post(`/api/owner/food-categories/${restaurantId}`, foodCategoryData);
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Cập nhật Food Category
export const updateFoodCategory = async (foodCategoryId, foodCategoryData) => {
  try {
    const response = await axios.put(`/api/owner/food-categories/${foodCategoryId}`, foodCategoryData);
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Xoá Food Category
export const deleteFoodCategory = async (foodCategoryId) => {
  try {
    const response = await axios.delete(`/api/owner/food-categories/${foodCategoryId}`);
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};
