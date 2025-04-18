import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/basicComponents/Header';
import Footer from './components/basicComponents/Footer';
import AppRoutes from './routes/AppRoutes';

function AppContent() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
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
