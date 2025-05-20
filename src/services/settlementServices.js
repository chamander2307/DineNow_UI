import axios from "../config/axios";

// Lấy danh sách tất cả nhà hàng cần tất toán
export const fetchAllSettlements = async () => {
  try {
    const res = await axios.get('/api/admin/settlement/unsettled');
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất toán:", error);
    throw error;
  }
};

// Lấy chi tiết tất toán của nhà hàng
export const fetchSettlementsDetails = async (restaurantId) => {
  try {
    const res = await axios.get(`/api/admin/settlement/summary/${restaurantId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết tất toán:", error);
    throw error;
  }
};

// Tạo thông tin đã thanh toán cho nhà hàng
export const createSettlements = async (settlementData) => {
  try {
    const res = await axios.post('/api/admin/settlement/confirm', settlementData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tạo thông tin thanh toán:", error);
    throw error;
  }
};

// Lấy danh sách nhà hàng đã tất toán theo quý
export const fetchSettledSettlements = async (year, month, periodIndex) => {
  try {
    const res = await axios.get(`/api/admin/settlement/settled?year=${year}&month=${month}&periodIndex=${periodIndex}`);
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đã tất toán:", error);
    throw error;
  }
};