import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Auth.css';

const Login = () => {
  return (
    <div className="auth">
      <form className="auth__form">
        <h2 className="auth__title">Đăng nhập</h2>

        <input type="email" placeholder="Email" className="auth__input" />
        <input type="password" placeholder="Mật khẩu" className="auth__input" />

        <button type="submit" className="auth__button">Đăng nhập</button>

        <div className="auth__extra">
          <Link to="/forgot-password" className="auth__link">Quên mật khẩu?</Link>
          <span>Chưa có tài khoản? <Link to="/register" className="auth__link">Đăng ký</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Login;
