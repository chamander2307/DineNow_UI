import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ResetPasswordFlow from "../pages/Auth/ForgotPassword/ForgotPassword";
import Profile from "../pages/Profile/Profile";
import PolicyPage from "../pages/Policy/PolicyPage";
import RestaurantList from "../pages/RestaurantList/RestaurantList";
import VerifyEmail from "../pages/Auth/VerifyEmail/VerifyEmail";
import OAuth2RedirectHandler from "../pages/Auth/OAuth2RedirectHandler";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ResetPasswordFlow />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/restaurant-list" element={<RestaurantList />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
    </Routes>
  );
};

export default AppRoutes;
