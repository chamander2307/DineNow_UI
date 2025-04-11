import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/Auth.css';

const ForgotPassword = () => {
  return (
    <div className="auth">
      <form className="auth__form">
        <h2 className="auth__title">Quên mật khẩu</h2>

        <input type="email" placeholder="Nhập email để khôi phục" className="auth__input" />
        <button type="submit" className="auth__button">Gửi mã khôi phục</button>

        <div className="auth__extra">
          <Link to="/login" className="auth__link">Quay lại đăng nhập</Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
