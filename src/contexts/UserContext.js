import React, { createContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ tránh flash

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLogin(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getUserProfile();
      setUser(userData);
      setIsLogin(true);
    } catch (err) {
      console.error("❌ Lỗi lấy thông tin user:", err);
      setUser(null);
      setIsLogin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsLogin(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ isLogin, user, setUser, setIsLogin, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
