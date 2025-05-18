import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Header from './components/basicComponents/Header';
import Footer from './components/basicComponents/Footer';
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  const location = useLocation();
  const isAdminOrOwner = location.pathname.startsWith('/admin') || location.pathname.startsWith('/owner');

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <AppRoutes />
      </main>
      {!isAdminOrOwner && <Footer />} {/* Chỉ hiển thị Footer nếu không phải admin/owner */}
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