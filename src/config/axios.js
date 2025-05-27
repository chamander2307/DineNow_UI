import axios from "axios";
import { refreshToken } from "../utils/authRefresh";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  console.log(`Processing queue: ${failedQueue.length} requests`);
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
  if (!token) {
    console.log("No token provided");
    return true;
  }
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("Token payload:", payload);
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    console.log(`Token expiration check: exp=${payload.exp}, currentTime=${currentTime}, isExpired=${isExpired}`);
    return isExpired;
  } catch (e) {
    console.error("Error decoding token:", e.message);
    return true;
  }
};

instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  console.log(`Request to ${config.url}, has token: ${!!token}`);

  if (!token) {
    console.log(`No token found for request: ${config.url}`);
    return config;
  }

  if (!isTokenExpired(token)) {
    console.log(`Using valid token for request: ${config.url}`);
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  }

  if (!isRefreshing) {
    isRefreshing = true;
    console.log(`Token expired, refreshing for request: ${config.url}`);
    try {
      const data = await refreshToken();
      const newToken = data?.accessToken;
      if (!newToken) {
        throw new Error("No new access token received");
      }
      localStorage.setItem("accessToken", newToken);
      console.log("Token refreshed successfully:", newToken);
      processQueue(null, newToken);
      config.headers["Authorization"] = `Bearer ${newToken}`;
      return config;
    } catch (error) {
      console.error("Refresh token failed:", error.message);
      processQueue(error, null);
      localStorage.removeItem("accessToken");
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
      throw error;
    } finally {
      isRefreshing = false;
      console.log("Token refresh completed, isRefreshing:", isRefreshing);
    }
  }

  console.log(`Queueing request while refreshing: ${config.url}`);
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
    console.log(`Response error for ${originalRequest.url}:`, {
      status: error.response?.status,
      data: error.response?.data,
      retry: originalRequest._retry,
    });

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        console.log("Retrying with refreshed token...");
        try {
          const data = await refreshToken();
          const newToken = data?.accessToken;
          if (!newToken) {
            throw new Error("No new access token received");
          }
          localStorage.setItem("accessToken", newToken);
          console.log("Token refreshed for retry:", newToken);
          processQueue(null, newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (e) {
          console.error("Refresh token failed on retry:", e.message);
          processQueue(e, null);
          localStorage.removeItem("accessToken");
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
          return Promise.reject(e);
        } finally {
          isRefreshing = false;
          console.log("Token refresh completed, isRefreshing:", isRefreshing);
        }
      }

      console.log(`Queueing retry request: ${originalRequest.url}`);
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