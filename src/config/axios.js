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
  let token = localStorage.getItem("accessToken");

  if (token && !isTokenExpired(token)) {
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  }

  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const data = await refreshToken();
      token = data?.accessToken;
      localStorage.setItem("accessToken", token);
      processQueue(null, token);
    } catch (error) {
      processQueue(error, null);
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw error;
    } finally {
      isRefreshing = false;
    }
  }

  return new Promise((resolve, reject) => {
    failedQueue.push({
      resolve: (token) => {
        config.headers["Authorization"] = `Bearer ${token}`;
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
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const data = await refreshToken();
          const token = data?.accessToken;
          localStorage.setItem("accessToken", token);
          processQueue(null, token);
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
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

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
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