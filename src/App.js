// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Header';
import Footer from './components/Footer';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import RestaurantSearch from './pages/Search/RestaurantSearch';
import TermsAndPolicy from './pages/Term/TermsAndPolicy';
import RestaurantDetail from './pages/RestaurantDetail/RestaurantDetail';

import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/restaurant/:id" element={<RestaurantDetail />} />
            <Route path="/restaurant-search" element={<RestaurantSearch />} />
            <Route path="/terms-and-policy" element={<TermsAndPolicy />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
