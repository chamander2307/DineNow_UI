import React, { createContext, useEffect, useState } from "react";
import { getUserProfile } from "../services/userService";
import { refreshToken } from "../utils/authRefresh";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found, user not logged in");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user profile...");
        const profile = await getUserProfile();
        setUser(profile);
        setIsLogin(true);
      } catch (err) {
        console.error("Error fetching profile:", err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log("Token may be expired, attempting to refresh...");
          try {
            await refreshToken();
            const profile = await getUserProfile();
            setUser(profile);
            setIsLogin(true);
          } catch (refreshErr) {
            console.error("Refresh token failed:", refreshErr.message);
            localStorage.removeItem("accessToken");
            setUser(null);
            setIsLogin(false);
            window.location.href = "/login";
          }
        } else {
          console.error("Non-auth error, logging out:", err.message);
          localStorage.removeItem("accessToken");
          setUser(null);
          setIsLogin(false);
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const logout = () => {
    console.log("Logging out user");
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