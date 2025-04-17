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
import RestaurantDetail from "../pages/RestaurantDetail/RestaurantDetail";
import RestaurantReviewForm from "../components/RestaurantReviewForm";
import FavoriteRestaurants from "../pages/FavoriteRestaurants/FavoriteRestaurants";
import DishDetail from "../pages/DishDetail/DishDetail";

import PaymentPage from "../pages/PaymentPage/PaymentPage";
import Page404 from "../components/Page404";

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

      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/restaurant/:id/review" element={<RestaurantReviewForm />} />
      <Route path="/favorite-restaurants" element={<FavoriteRestaurants />} />

      <Route path="/dish/:id" element={<DishDetail />} />

      <Route path="/payment" element={<PaymentPage />} />
      
      <Route path="*" element={<Page404/>} />
    </Routes>
  );
};

export default AppRoutes;
