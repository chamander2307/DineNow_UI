import { Routes, Route } from "react-router-dom";

// Trang chính
import Home from "../pages/Home/Home";

// Auth
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import ResetPasswordFlow from "../pages/Auth/ForgotPassword/ForgotPassword";
import VerifyEmail from "../pages/Auth/VerifyEmail/VerifyEmail";
import OAuth2RedirectHandler from "../pages/Auth/OAuth2RedirectHandler";
import ChangePassword from "../pages/Auth/ChangePassword/ChangePassword";

// Người dùng
import Profile from "../pages/Profile/Profile";
import FavoriteRestaurants from "../pages/FavoriteRestaurants/FavoriteRestaurants";
import ReservationHistory from "../pages/ReservationHistory/ReservationHistory";
import ReservationDetail from "../pages/ReservationDetail/ReservationDetail";

// Nhà hàng & món ăn
import RestaurantList from "../pages/RestaurantList/RestaurantList";
import RestaurantDetail from "../pages/RestaurantDetail/RestaurantDetail";
import RestaurantReviewForm from "../components/Restaurants/RestaurantReviewForm";
import DishDetail from "../pages/DishDetail/DishDetail";
import AllDishes from "../pages/AllDishes/AllDishes";

// Chính sách & Thanh toán
import PolicyPage from "../pages/Policy/PolicyPage";
import PaymentPage from "../pages/PaymentPage/PaymentPage";

// Quản trị (admin + owner)
import RestaurantManager from "../pages/Admin/RestaurantManager";
import RestaurantMyList from "../pages/Owner/RestaurantMyList";
import MenuItemMyList from "../pages/Owner/MenuItemMyList";
import CartPage from "../pages/CartPage/CartPage";
import RestaurantTypeManager from "../pages/Admin/RestaurantTypeManager";
import UserManager from "../pages/Admin/UserManager";
import Page404 from "../components/basicComponents/Page404";
const AppRoutes = () => {
  return (
    <Routes>
      {/* Trang chính */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ResetPasswordFlow />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

      {/* Người dùng */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/favorite-restaurants" element={<FavoriteRestaurants />} />
      <Route path="/reservation-history" element={<ReservationHistory />} />
      <Route path="/reservation/:id" element={<ReservationDetail />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/cart" element={<CartPage />} />

      {/* Nhà hàng & món ăn */}
      <Route path="/restaurant-list" element={<RestaurantList />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/restaurant/:id/review" element={<RestaurantReviewForm />} />
      <Route path="/dish/:id" element={<DishDetail />} />
      <Route path="/all-dishes" element={<AllDishes />} />

      {/* Chính sách & Thanh toán */}
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/payment" element={<PaymentPage />} />

      {/* Quản trị */}
      <Route path="/admin/restaurants" element={<RestaurantManager />} />
      <Route path="/admin/restaurant-types" element={<RestaurantTypeManager />} />
      <Route path="/admin/users" element={<UserManager />} />
      <Route path="/owner/restaurants" element={<RestaurantMyList />} />
      <Route path="/owner/menu-items" element={<MenuItemMyList />} />
      <Route path="/reservation/:id" element={<ReservationDetail />} />
      
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default AppRoutes;
