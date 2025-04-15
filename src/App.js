import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

import RestaurantSearch from './pages/Search/RestaurantSearch';
import RestaurantDetail from './pages/RestaurantDetail/RestaurantDetail';
import RestaurantReviewForm from './components/RestaurantReviewForm';

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
<<<<<<< HEAD
        <AppRoutes />
=======
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ResetPasswordFlow />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          <Route path="/restaurant-list" element={<RestaurantList />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/restaurant-search" element={<RestaurantSearch />} />
          <Route path="/restaurant/:id/review" element={<RestaurantReviewForm />} />
        </Routes>
>>>>>>> 3282316359acf1c1c0b9ad33d2a839668cf1b01b
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
