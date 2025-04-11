import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/Navbar.css';

const Header = () => {
    return (
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">DineNow</Link>
          <nav className="nav">
            <Link to="/">Trang Chủ</Link>
            <Link to="/restaurant-search">Tìm Kiếm</Link>
            <Link to="/login">Đăng Nhập</Link>
            <Link to="/register">Đăng Ký</Link>
          </nav>
        </div>
      </header>
    );
  };

export default Header;