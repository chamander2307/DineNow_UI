import axios from "axios";
import { refreshToken } from "../services/authService";
import httpStatusMessages from "../constants/httpStatusMessages";

// ================== CẤU HÌNH AXIOS ==================
const instance = axios.create({

  baseURL: "http://localhost:8080",
  withCredentials: true,       
});

// ----------------- REQUEST INTERCEPTOR --------------
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Bỏ qua gắn token với URL /uploads/
  if (token && !config.url.includes("/uploads/") && !config.url.includes("/auth/refresh-token")) {
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

    // Không có phản hồi từ server
    if (!err.response) {
      alert("Không thể kết nối tới máy chủ.");
      return Promise.reject(err);
    }

    const { status } = err.response;
    const message = err.response.data?.message || "Lỗi không xác định";

    // Thử refresh token khi 401 / 403 và chưa thử lại
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await refreshToken();                // gọi API /api/auth/refresh-token
        const newAccessToken = data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return instance(originalRequest);                 // gửi lại request cũ
      } catch (e) {
        localStorage.removeItem("accessToken");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(e);
      }
    }

    alert(httpStatusMessages[status] || `Lỗi ${status}: ${message}`);
    return Promise.reject(err);
  }
);

export default instance;
