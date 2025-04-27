import axios from "axios";
import { refreshToken } from "../services/authService";
import httpStatusMessages from "../constants/httpStatusMessages";

// ✅ Tạo instance Axios
const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // Cho phép gửi cookie (nếu dùng refreshToken dạng HttpOnly)
});

// ✅ Interceptor trước khi gửi request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Gắn Authorization nếu có token
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
    console.log("🔐 Gửi token:", config.headers["Authorization"]);
  }

  // ĐỪNG đặt Content-Type mặc định ở đây!
  // Axios sẽ tự đặt:
  // - application/json cho object thường
  // - multipart/form-data khi dùng FormData

  return config;
});

// ✅ Interceptor xử lý response lỗi
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Lỗi không phản hồi
    if (!err.response) {
      console.error("❌ Không có phản hồi từ server:", err);
      alert("Không thể kết nối đến máy chủ.");
      return Promise.reject(err);
    }

    const status = err.response.status;
    const message = err.response?.data?.message || "Không rõ nguyên nhân";

    console.warn(`⚠️ Response Error ${status}: ${message}`);
    console.log("➡️ Request headers:", originalRequest.headers);

    // ✅ Refresh token nếu lỗi 401/403 và chưa thử lại
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Gọi refreshToken()");
        const data = await refreshToken();
        const newAccessToken = data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        console.log("✅ Đã refresh token:", newAccessToken);

        return instance(originalRequest); // Gọi lại request cũ
      } catch (e) {
        console.error("❌ Refresh token thất bại:", e.response?.data || e.message);
        localStorage.removeItem("accessToken");

        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(e);
      }
    }

    // ❌ Nếu là lỗi khác, hiển thị cảnh báo
    alert(httpStatusMessages[status] || `Lỗi ${status}: ${message}`);
    return Promise.reject(err);
  }
);

export default instance;
