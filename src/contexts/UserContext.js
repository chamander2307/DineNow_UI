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
        console.log("No token found, user not logged in");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching user profile...");
        const profile = await getUserProfile();
        console.log("Profile fetched:", profile);
        setUser(profile);
        setIsLogin(true);
      } catch (err) {
        console.error("Error fetching profile:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
        });
        localStorage.removeItem("accessToken");
        setUser(null);
        setIsLogin(false);
        window.location.href = "/login";
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