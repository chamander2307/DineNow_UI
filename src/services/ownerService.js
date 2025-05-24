import axios from "../config/axios";

// Lấy dữ liệu dashboard owner
export const fetchOwnerDashboardData = async () => {
  try {
    const response = await axios.get("/api/owner/dashboard");
    console.log("Response từ fetchOwnerDashboardData:", response.data);
    return response.data.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu dashboard owner:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};