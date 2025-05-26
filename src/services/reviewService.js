import axios from "../config/axios";

// Lấy danh sách đánh giá món ăn (OWNER)
export const fetchMenuItemReviews = async (menuItemId, page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `/api/owner/reviews/menu-item/${menuItemId}`,
      {
        params: { page, size },
      }
    );
    const data = response?.data?.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      "Lỗi khi lấy đánh giá món ăn:",
      error?.response?.data?.message || error.message
    );
    return [];
  }
};

// Lấy tất cả đánh giá món ăn (PUBLIC)
export const fetchAllMenuItemReviews = async (menuItemId, page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `/api/reviews/menu-items/${menuItemId}/all`,
      {
        params: { page, size },
      }
    );
    const data = response?.data?.data;
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      "Lỗi khi lấy tất cả đánh giá món ăn:",
      error?.response?.data?.message || error.message
    );
    return [];
  }
};

// Thêm đánh giá món ăn
export const addMenuItemReview = async (menuItemId, reviewData) => {
  try {
    console.log('Dữ liệu gửi đi:', reviewData);
    const response = await axios.post(
      `/api/customer/reviews/menu-items/${menuItemId}/add`,
      reviewData
    );
    console.log('Phản hồi từ API:', response?.data);
    return response?.data?.data || null;
  } catch (error) {
    console.error(
      "Lỗi khi thêm đánh giá món ăn:",
      error?.response?.data?.message || error.message
    );
    return null;
  }
};


// Lấy danh sách đánh giá nhà hàng (OWNER hoặc PUBLIC)
export const fetchRestaurantReviews = async (
  restaurantId,
  page = 0,
  size = 10
) => {
  try {
    const response = await axios.get(
      `/api/reviews/restaurant/${restaurantId}/all`,
      {
        params: { page, size },
      }
    );
    const data = response?.data?.data;
    // Đảm bảo trả về mảng nếu dữ liệu không đúng định dạng
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      "Lỗi khi lấy đánh giá nhà hàng:",
      error?.response?.data?.message || error.message
    );
    return [];
  }
};

// Thêm đánh giá nhà hàng
export const addRestaurantReview = async (restaurantId, reviewData) => {
  try {
    const response = await axios.post(
      `/api/customer/reviews/restaurant/${restaurantId}/add`,
      reviewData
    );
    return response?.data?.data || null;
  } catch (error) {
    console.error(
      "Lỗi khi thêm đánh giá nhà hàng:",
      error?.response?.data?.message || error.message
    );
    return null;
  }
};