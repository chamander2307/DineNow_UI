import axios from "../config/axios";

// Lấy thống kê doanh thu theo nhà hàng (OWNER)
export const fetchRevenueStatsByRestaurant = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/owner/restaurants/${restaurantId}/revenue`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê doanh thu:", error);
    throw error;
  }
};

// Lấy doanh thu theo tháng trong năm (OWNER)
export const fetchMonthlyRevenue = async (restaurantId, year = new Date().getFullYear()) => {
  try {
    const response = await axios.get(`/api/owner/revenue/restaurant/${restaurantId}/monthly`, {
      params: { year },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo tháng:", error);
    throw error;
  }
};

// Lấy doanh thu theo năm (OWNER)
export const fetchYearlyRevenue = async (restaurantId) => {
  try {
    const response = await axios.get(`/api/owner/revenue/restaurant/${restaurantId}/yearly`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo năm:", error);
    throw error;
  }
};

// Lấy doanh thu theo tháng trong khoảng thời gian (OWNER)
export const fetchMonthlyRevenueInRange = async (restaurantId, startDate, endDate) => {
  try {
    const response = await axios.get(`/api/owner/revenue/restaurant/${restaurantId}/monthly/range`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu trong khoảng thời gian:", error);
    throw error;
  }
};