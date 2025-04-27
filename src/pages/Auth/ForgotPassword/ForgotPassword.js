import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/auth/AuthLayout";
import "../../../assets/styles/home/Login.css";
import {sendForgotOTP,resetPassword,verifyResetOTP} from "../../../services/authService";
const ResetPasswordFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async(e) => {
    e.preventDefault();
    try{
      await sendForgotOTP(email);
      alert("Mã OTP đã được gửi đến email của bạn");
      setStep(2);
    }catch(err){
      alert("Gửi mã OTP thất bại");
      console.error(err);
    }
  };

  const handleOtpSubmit = async(e) => {
    e.preventDefault();
    try{
      await verifyResetOTP({ email, otp });
      alert("Xác thực OTP thành công");
      setStep(3);
    }catch(err){
      alert("Xác thực OTP thất bại");
      console.error(err);
    }
  };

  const handleResetSubmit = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    try{
      await resetPassword({ email, newPassword: password });
      alert("Đổi mật khẩu thành công");
      navigate("/login");
    }catch(err){
      alert("Đổi mật khẩu thất bại");
      console.error(err);
    }
  };

  return (
    <AuthLayout title="Khôi Phục Mật Khẩu">
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
            Xác thực
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

export default ResetPasswordFlow;
