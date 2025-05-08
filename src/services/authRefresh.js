// src/utils/authRefresh.js

export const refreshToken = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/refresh-token", {
        method: "POST",
        credentials: "include", // Giữ cookie nếu cần
      });
  
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Không thể làm mới token");
      }
  
      const data = await res.json();
      return data.data; // Trả về dữ liệu chứa accessToken mới
    } catch (err) {
      console.error("Lỗi khi làm mới token:", err);
      throw err; // Ném lỗi lên để xử lý sau
    }
  };
  