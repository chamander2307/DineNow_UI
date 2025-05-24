// src/config/axios.js
import axios from "axios";
import { refreshToken } from "../utils/authRefresh";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
};

instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");

  // Không có token, bỏ qua làm mới và gửi yêu cầu
  if (!token) {
    return config;
  }

  // Token hợp lệ, thêm header
  if (!isTokenExpired(token)) {
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  }

  // Token hết hạn, làm mới
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const data = await refreshToken();
      const newToken = data?.accessToken;
      if (!newToken) {
        throw new Error("Không nhận được accessToken mới");
      }
      localStorage.setItem("accessToken", newToken);
      processQueue(null, newToken);
      config.headers["Authorization"] = `Bearer ${newToken}`;
      return config;
    } catch (error) {
      processQueue(error, null);
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  // Đang làm mới, xếp hàng yêu cầu
  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (newToken) => {
        config.headers["Authorization"] = `Bearer ${newToken}`;
        resolve(config);
      },
      reject,
    });
  });
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Xử lý lỗi 401 hoặc 403, nhưng chỉ thử làm mới một lần
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const data = await refreshToken();
          const newToken = data?.accessToken;
          if (!newToken) {
            throw new Error("Không nhận được accessToken mới");
          }
          localStorage.setItem("accessToken", newToken);
          processQueue(null, newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (e) {
          processQueue(e, null);
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
        }
      }

      // Đang làm mới, xếp hàng yêu cầu
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(instance(originalRequest));
          },
          reject,
        });
      });
    }

    return Promise.reject(error);
  }
);

export default instance;