import axios from "../config/axios";

// Lấy danh sách đánh giá theo nhà hàng (OWNER)
export const fetchReviewsByRestaurant = async (restaurantId) => {
  const res = await axios.get(`/api/owner/restaurants/${restaurantId}/reviews`);
  return res.data.data;
};
export const fetchMenuItemReviews = async (menuItemId, page = 0, size = 10) => {
  const res = await axios.get(`/api/reviews/menu-items/${menuItemId}/all`, {
    params: { page, size },
  });
  return res.data.data;
};

export const addMenuItemReview = async (menuItemId, reviewData) => {
  const res = await axios.post(`/api/reviews/menu-items/${menuItemId}/add`, reviewData);
  return res.data.data;
};

export const fetchRestaurantReviews = async (restaurantId, page = 0, size = 10) => {
  const res = await axios.get(`/api/reviews/restaurant/${restaurantId}/all`, {
    params: { page, size },
  });
  return res.data.data;
};

export const addRestaurantReview = async (restaurantId, reviewData) => {
  const res = await axios.post(`/api/reviews/restaurant/${restaurantId}/add`, reviewData);
  return res.data.data;
};

export const fetchOwnerMenuItemReviews = async (menuItemId, page = 0, size = 10) => {
  const res = await axios.get(`/api/owner/reviews/menu-item/${menuItemId}`, {
    params: { page, size },
  });
  return res.data.data;
};
