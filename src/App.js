// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login/Login';
import Register from './pages/Auth/Register/Register';
import ResetPasswordFlow from './pages/Auth/ForgotPassword/ForgotPassword';
import Profile from './pages/Profile/Profile';
import PolicyPage from './pages/Policy/PolicyPage';
import RestaurantList from './pages/RestaurantList/RestaurantList';
import VerifyEmail from './pages/Auth/VerifyEmail/VerifyEmail'; 

function AppContent() {

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ResetPasswordFlow />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/restaurant-list" element={<RestaurantList />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
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
