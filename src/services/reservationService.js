import axios from "../config/axios";

// ========== OWNER ==========

// Lấy danh sách đặt bàn theo nhà hàng (do OWNER sở hữu)
export const fetchOwnerReservations = async (restaurantId) => {
  return await axios.get("/api/owner/reservations", {
    params: { restaurantId }
  });
};

// Cập nhật trạng thái đặt bàn (ACCEPTED / REJECTED / COMPLETED / ...)
export const updateReservationStatus = async (id, status) => {
  return await axios.put(`/api/owner/reservations/${id}/status`, null, {
    params: { status }
  });
};

export const fetchReservationsByRestaurant = async (restaurantId) => {
    // Giả lập gọi API sau 300ms
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            data: [
              {
                id: 1,
                customerName: "Nguyễn Văn A",
                phone: "0912345678",
                time: "2025-05-04 18:30",
                peopleCount: 4,
                note: "Có trẻ nhỏ",
                status: "Đang chờ",
              },
              {
                id: 2,
                customerName: "Trần Thị B",
                phone: "0901234567",
                time: "2025-05-05 19:00",
                peopleCount: 2,
                note: "",
                status: "Đã xác nhận",
              },
            ],
          },
        });
      }, 300);
    });
  };