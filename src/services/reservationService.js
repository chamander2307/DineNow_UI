import axios from "../config/axios";

// ========== OWNER ==========

// Lấy danh sách đặt bàn theo nhà hàng (do OWNER sở hữu)
export const fetchOwnerReservations = async (restaurantId) => {
  try {
    const response = await axios.get("/api/owner/reservations", {
      params: { restaurantId },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt bàn:", error);
    throw error;
  }
};

// Cập nhật trạng thái đặt bàn (ACCEPTED / REJECTED / COMPLETED / ...)
export const updateReservationStatus = async (id, status, reason = null) => {
  try {
    const data = reason ? { reason } : {};
    const response = await axios.put(`/api/owner/reservations/${id}/status`, data, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đặt bàn:", error);
    throw error;
  }
};