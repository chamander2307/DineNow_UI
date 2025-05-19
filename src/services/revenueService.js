import axios from "../config/axios";

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
//revernue admin
export const fetchAdminMonthlyRevenue = async (month) => {
  try {
    const response = await axios.get(`/api/admin/revenues/restaurants/monthly`, { params: { month } });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu theo tháng (admin):", error);
    throw error;
  }
};

export const fetchAdminTotalRevenue = async () => {
  try {
    const response = await axios.get(`/api/admin/revenues/restaurants/total`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy tổng doanh thu (admin):", error);
    throw error;
  }
};

export const fetchAdminRevenueInRange = async (startMonth, endMonth) => {
  try {
    const response = await axios.get(`/api/admin/revenues/restaurants/monthly/range`, {
      params: { startMonth, endMonth },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy doanh thu trong khoảng thời gian (admin):", error);
    throw error;
  }
};