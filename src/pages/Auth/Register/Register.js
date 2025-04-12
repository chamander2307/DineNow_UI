import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../../assets/styles/Login.css'; 
import Logo from '../../../components/Logo';
import { register } from '../../../services/authService';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // ==== Kiểm tra client trước khi gọi API ====
    const phoneRegex = /^0\d{9}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!phoneRegex.test(phone)) {
      alert('Số điện thoại phải có đúng 10 số và bắt đầu bằng 0');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert('Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, thường, số và ký tự đặc biệt');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu nhập lại không khớp');
      return;
    }

    try {
      await register({ fullName, email, password, phone });
      alert('Đăng ký thành công');
      navigate('/login');
    } catch (err) {
      alert('Đăng ký thất bại');
      console.error(err);
    }
  };

  return (
    <div className="auth auth--split">
      <div className="auth__left">
        <div className="auth__illustration-box"></div>
      </div>

      <div className="auth__right">
        <div className="auth__form-box">
          <div className="auth__logo-wrapper">
            <Logo size={180} />
          </div>
          <p className="auth__slogan">Tạo tài khoản để trải nghiệm DineNow tốt nhất</p>

          <form className="auth__form" onSubmit={handleRegister}>
            <div className="input-icon">
              <i className="fa fa-user" />
              <input
                type="text"
                placeholder="Họ và tên"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="input-icon">
              <i className="fa fa-envelope" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-icon">
              <i className="fa fa-phone" />
              <input
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="input-icon">
              <i className="fa fa-lock" />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-icon">
              <i className="fa fa-lock" />
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Tạo tài khoản</button>
            <div className="auth__extra">
              <span>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
