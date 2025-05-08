import React, { createContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";
import { refreshToken } from "../services/authService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        setIsLogin(false);
        setLoading(false);
        return;
      }

      try {
        // Kiểm tra token có hợp lệ hay không
        const profile = await getUserProfile();
        setUser(profile);
        setIsLogin(true);
      } catch (err) {
        console.warn("Token không hợp lệ hoặc hết hạn, thử làm mới:", err.message);
        try {
          // Làm mới token nếu token cũ không hợp lệ
          const data = await refreshToken();
          const newAccessToken = data.accessToken;

          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            const profile = await getUserProfile();
            setUser(profile);
            setIsLogin(true);
            console.log("Đăng nhập lại thành công.");
          } else {
            throw new Error("Không thể làm mới token.");
          }
        } catch (refreshErr) {
          console.warn("Không thể làm mới token:", refreshErr.message);
          localStorage.removeItem("accessToken");
          setUser(null);
          setIsLogin(false);
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsLogin(false);
    window.location.href = "/login"; // Điều hướng về trang đăng nhập
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLogin,
        loading,
        setUser,
        setIsLogin,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
