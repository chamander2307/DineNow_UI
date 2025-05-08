import axios from "../config/axios";

// Lấy thống kê doanh thu theo nhà hàng (OWNER)
export const fetchRevenueStatsByRestaurant = async (restaurantId) => {
  const res = await axios.get(`/api/owner/restaurants/${restaurantId}/revenue`);
  return res.data.data;
};