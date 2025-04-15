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

// ✅ Thêm log rõ ràng khi gửi request
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

// ✅ Log toàn bộ phản hồi lỗi nếu có
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
    console.warn(`⚠️ Response Error: ${status}`);
    console.log("➡️ Lý do:", err.response?.data?.message);
    console.log("➡️ Request headers:", originalRequest.headers);

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await refreshToken();
        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        console.log("✅ Đã refresh accessToken:", newAccessToken);
        return instance(originalRequest);
      } catch (e) {
        console.error("❌ Refresh token thất bại:", e);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    alert(httpStatusMessages[status] || "Đã xảy ra lỗi không xác định.");
    return Promise.reject(err);
  }
);

export default instance;
