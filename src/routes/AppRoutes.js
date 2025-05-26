import { Routes, Route } from "react-router-dom";

// Trang chính
import Home from "../pages/Home/Home";

// Auth
import ChangePassword from "../pages/Auth/ChangePassword/ChangePassword";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import Login from "../pages/Auth/Login/Login";
import OAuth2RedirectHandler from "../pages/Auth/OAuth2RedirectHandler";
import Register from "../pages/Auth/Register/Register";
import VerifyEmail from "../pages/Auth/VerifyEmail/VerifyEmail";

// Người dùng
import CartPage from "../pages/CartPage/CartPage";
import FavoriteRestaurants from "../pages/FavoriteRestaurants/FavoriteRestaurants";
import Profile from "../pages/Profile/Profile";
import ReservationDetail from "../pages/ReservationDetail/ReservationDetail";
import ReservationHistory from "../pages/ReservationHistory/ReservationHistory";

// Nhà hàng & món ăn
import AllDishes from "../pages/AllDishes/AllDishes";
import DishDetail from "../pages/DishDetail/DishDetail";
import RestaurantDetail from "../pages/RestaurantDetail/RestaurantDetail";
import RestaurantList from "../pages/RestaurantList/RestaurantList";
import RestaurantReviewForm from "../components/Restaurants/RestaurantReviewForm";

// Chính sách & Thanh toán
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import PolicyPage from "../pages/Policy/PolicyPage";
import PaymentResult from "../pages/PaymentResult/PaymentResult";
// Quản trị (admin)
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminMainCategoryManager from "../pages/Admin/AdminMainCategoryManager";
import AdminOrderManager from "../pages/Admin/AdminOrderManager";
import AdminProfit from "../pages/Admin/AdminProfit";
import RestaurantManager from "../pages/Admin/RestaurantManager";
import RestaurantTypeManager from "../pages/Admin/RestaurantTypeManager";
import RevenueDashboard from "../pages/Admin/RevenueDashboard";
import SettlementPage from "../pages/Admin/SettlementPage";
import UserManager from "../pages/Admin/UserManager";
import RestaurantTierManager from "../pages/Admin/RestaurantTierManager";
// Quản trị (owner)
import BankAccountManager from "../pages/Owner/BankAccountManager";
import FoodCategoryMyList from "../pages/Owner/FoodCategoryMyList";
import MenuItemMyList from "../pages/Owner/MenuItemMyList";
import OwnerDashboard from "../pages/Owner/OwnerDashboard";
import OwnerMenuItemReviewList from "../pages/Owner/OwnerMenuItemReviewList";
import OwnerOrderManager from "../pages/Owner/OwnerOrderManager";
import OwnerReservationList from "../pages/Owner/OwnerReservationList";
import OwnerRevenueDashboard from "../pages/Owner/OwnerRevenueDashboard";
import OwnerReviewList from "../pages/Owner/OwnerReviewList";
import RestaurantMyList from "../pages/Owner/RestaurantMyList";

// 404
import Page404 from "../components/basicComponents/Page404";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Trang chính */}
      <Route path="/" element={<Home />} />

      {/* Auth */}
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Người dùng */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/favorite-restaurants" element={<FavoriteRestaurants />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reservation-history" element={<ReservationHistory />} />
      <Route path="/reservation/:id" element={<ReservationDetail />} />

      {/* Nhà hàng & món ăn */}
      <Route path="/all-dishes" element={<AllDishes />} />
      <Route path="/dish/:dishId" element={<DishDetail />} />
      <Route path="/restaurant-list" element={<RestaurantList />} />
      <Route path="/restaurant/:id" element={<RestaurantDetail />} />
      <Route path="/restaurant/:id/review" element={<RestaurantReviewForm />} />

      {/* Chính sách & Thanh toán */}
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/policy" element={<PolicyPage />} />
      <Route path="/payment-status" element={<PaymentResult />} />

      {/* Quản trị - Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/main-category" element={<AdminMainCategoryManager />} />
      <Route path="/admin/orders" element={<AdminOrderManager />} />
      <Route path="/admin/profit" element={<AdminProfit />} />
      <Route path="/admin/restaurants" element={<RestaurantManager />} />
      <Route path="/admin/restaurant-types" element={<RestaurantTypeManager />} />
      <Route path="/admin/revenue-dashboard" element={<RevenueDashboard />} />
      <Route path="/admin/settlement" element={<SettlementPage />} />
      <Route path="/admin/users" element={<UserManager />} />
      <Route path="/admin/restaurant-tier" element={<RestaurantTierManager/>}/>

      {/* Quản trị - Owner */}
      <Route path="/owner/bank-account" element={<BankAccountManager />} />
      <Route path="/owner/dashboard" element={<OwnerDashboard />} />
      <Route path="/owner/food-category" element={<FoodCategoryMyList />} />
      <Route path="/owner/menu-item-review" element={<OwnerMenuItemReviewList />} />
      <Route path="/owner/menu-items" element={<MenuItemMyList />} />
      <Route path="/owner/menu-items/:restaurantId" element={<MenuItemMyList />} />
      <Route path="/owner/order" element={<OwnerOrderManager />} />
      <Route path="/owner/reservation" element={<OwnerReservationList />} />
      <Route path="/owner/restaurants" element={<RestaurantMyList />} />
      <Route path="/owner/revenue-dashboard" element={<OwnerRevenueDashboard />} />
      <Route path="/owner/review" element={<OwnerReviewList />} />

      {/* Trang không tìm thấy */}
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
};

export default AppRoutes;