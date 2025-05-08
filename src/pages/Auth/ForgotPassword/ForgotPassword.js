import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/auth/AuthLayout";
import "../../../assets/styles/home/Login.css";
import {
  sendForgotOTP,
  verifyResetOTP,
  resetPassword,
} from "../../../services/authService";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await sendForgotOTP(email);
      alert("Mã OTP đã được gửi đến email của bạn.");
      setStep(2);
    } catch (err) {
      console.error("Gửi OTP thất bại:", err);
      setError("Không thể gửi mã OTP. Vui lòng thử lại.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await verifyResetOTP({ email, otp });
      alert("Xác thực OTP thành công.");
      setStep(3);
    } catch (err) {
      console.error("Xác thực OTP thất bại:", err);
      setError("Mã OTP không đúng hoặc đã hết hạn.");
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp.");
      return;
    }

    try {
      await resetPassword({ email, newPassword: password });
      alert("Đổi mật khẩu thành công. Mời bạn đăng nhập.");
      navigate("/login");
    } catch (err) {
      console.error("Đổi mật khẩu thất bại:", err);
      setError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <AuthLayout title="Khôi Phục Mật Khẩu">
      {error && <div className="auth__error">{error}</div>}

      {step === 1 && (
        <form className="auth__form fade-step" onSubmit={handleEmailSubmit}>
          <input
            type="email"
            className="auth__input"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="auth__button">
            Gửi mã OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="auth__form fade-step" onSubmit={handleOtpSubmit}>
          <input type="email" className="auth__input" value={email} disabled />
          <input
            type="text"
            className="auth__input"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <button type="submit" className="auth__button">
            Xác thực OTP
          </button>
          <button
            type="button"
            className="auth__link"
            onClick={() => setStep(1)}
          >
            Đổi email
          </button>
        </form>
      )}

      {step === 3 && (
        <form className="auth__form fade-step" onSubmit={handleResetSubmit}>
          <input
            type="password"
            className="auth__input"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="auth__input"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth__button">
            Đổi mật khẩu
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
