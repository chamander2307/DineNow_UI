import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/styles/home/Login.css";
import Logo from "../../../components/basicComponents/Logo";
import { register } from "../../../services/authService";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getErrorMessage = (status, email, phone) => {
    switch (status) {
      case 400: // BAD_REQUEST
        return "Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin nhập vào.";
      case 406: // EXIST_EMAIL
        return `Email ${email} đã được sử dụng.`;
      case 407: // EXIST_PHONE
        return `Số điện thoại ${phone} đã được sử dụng.`;
      case 410: // INVALID_INPUT
        return "Dữ liệu đầu vào không hợp lệ.";
      case 415: // EMAIL_ERROR
        return "Lỗi khi gửi email xác thực. Vui lòng thử lại sau.";
      case 416: // ALREADY_EXISTS
        return "Tài khoản đã tồn tại.";
      case 500: // INTERNAL_SERVER_ERROR or RUNTIME_EXCEPTION
        return "Lỗi máy chủ. Vui lòng thử lại sau.";
      default:
        return "Đăng ký thất bại. Vui lòng thử lại.";
    }
  };

  const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  const phoneRegex = /^0\d{9}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!phoneRegex.test(phone)) {
    setError("Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0.");
    return;
  }

  if (!passwordRegex.test(password)) {
    setError("Mật khẩu phải dài ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
    return;
  }

  if (password !== confirmPassword) {
    setError("Mật khẩu nhập lại không khớp.");
    return;
  }

  try {
    const res = await register({ fullName, email, password, phone });
    const { status, message } = res;

    if (status === 201) {
      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } else {
      setError(getErrorMessage(status, email, phone) || message);
    }
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    setError("Đăng ký thất bại. Vui lòng thử lại.");
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
            {error && <div className="auth__error">{error}</div>}

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