import axios from "axios";
import { refreshToken } from "../services/authService";
import httpStatusMessages from "../constants/httpStatusMessages";

// ================== CẤU HÌNH AXIOS ==================
const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,       // Bật gửi cookie theo mặc định
});

// ----------------- REQUEST INTERCEPTOR --------------
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Thêm token vào header
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("Gửi token:", config.headers["Authorization"]);
  }

  return config;
});

// ----------------- RESPONSE INTERCEPTOR -------------
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Kiểm tra nếu là lỗi 401 hoặc 403 (không có quyền)
    if ((err.response.status === 401 || err.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Thử làm mới token...");
        const data = await refreshToken();
        const newAccessToken = data.accessToken;

        if (newAccessToken) {
          console.log("Token mới:", newAccessToken);
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest); // Thực hiện lại yêu cầu cũ
        } else {
          throw new Error("Không thể làm mới token.");
        }
      } catch (e) {
        console.error("Lỗi khi làm mới token:", e);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    // Hiển thị thông báo lỗi
    alert(httpStatusMessages[err.response.status] || `Lỗi ${err.response.status}: ${err.message}`);
    return Promise.reject(err);
  }
);

export default instance;
