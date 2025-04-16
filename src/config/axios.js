// src/config/axios.js
import axios from "axios";
import { refreshToken } from "../services/authService";
import httpStatusMessages from "../constants/httpStatusMessages";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Gắn accessToken nếu có trước khi gửi request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("🔐 Gửi token:", config.headers["Authorization"]);
  } else {
    console.warn("⚠️ Không có accessToken trong localStorage");
  }
  return config;
});

// ✅ Xử lý khi gặp lỗi phản hồi
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (!err.response) {
      console.error("❌ Không nhận được phản hồi từ server:", err);
      alert("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      return Promise.reject(err);
    }

    const status = err.response.status;
    const message = err.response?.data?.message || "Không rõ nguyên nhân";

    console.warn(`⚠️ Response Error ${status}: ${message}`);
    console.log("➡️ Request headers:", originalRequest.headers);

    // ✅ Nếu accessToken hết hạn → gọi refreshToken (bắt cả 401 & 403)
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("🔄 Bắt đầu gọi refreshToken()");
        const data = await refreshToken();
        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        console.log("✅ Đã refresh accessToken:", newAccessToken);
        return instance(originalRequest); // retry request gốc
      } catch (e) {
        console.error("❌ Refresh token thất bại:", e.response?.data || e.message);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }

    // ✅ Hiển thị lỗi dựa trên mã lỗi đã định nghĩa
    alert(httpStatusMessages[status] || `Lỗi ${status}: ${message}`);
    return Promise.reject(err);
  }
);

export default instance;
