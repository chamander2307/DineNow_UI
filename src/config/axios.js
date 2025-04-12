// src/config/axios.js
import axios from "axios";
import { refreshToken } from "../services/authService";
import httpStatusMessages from "../constants/httpStatusMessages";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // mày có thể gọi refreshToken nếu cần
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await refreshToken();
        const newAccessToken = data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        console.log("Đã làm mới access token thành công");
        return instance(originalRequest);
      } catch (e) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    const status = err.response?.status;
    const message =
      httpStatusMessages[status] || "Có lỗi không xác định đã xảy ra";
    alert(message);
    return Promise.reject(err);
  }
);
export default instance;
