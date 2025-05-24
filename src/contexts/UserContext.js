import React, { createContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getUserProfile();
        setUser(profile);
        setIsLogin(true);
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
        localStorage.removeItem("accessToken");
        setUser(null);
        setIsLogin(false);
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
    window.location.href = "/login";
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