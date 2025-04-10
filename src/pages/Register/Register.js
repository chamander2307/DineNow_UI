import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Auth.css';

const Register = () => {
  return (
    <div className="auth">
      <form className="auth__form">
        <h2 className="auth__title">Đăng ký</h2>

        <input type="text" placeholder="Họ và tên" className="auth__input" />
        <input type="email" placeholder="Email" className="auth__input" />
        <input type="password" placeholder="Mật khẩu" className="auth__input" />

        <button type="submit" className="auth__button">Tạo tài khoản</button>

        <div className="auth__extra">
          <span>Đã có tài khoản? <Link to="/login" className="auth__link">Đăng nhập</Link></span>
        </div>
      </form>
    </div>
  );
};

export default Register;