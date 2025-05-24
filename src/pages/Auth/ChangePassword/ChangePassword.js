import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/auth/AuthLayout";
import "../../../assets/styles/home/Login.css";
import {
  sendForgotOTP,
  verifyResetOTP,
  resetPassword,
} from "../../../services/authService";
import { UserContext } from "../../../contexts/UserContext";

const ChangePassword = () => {
  const { user } = useContext(UserContext);
  const email = user?.email;
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await sendForgotOTP(email);
      alert("Mã OTP đã được gửi đến email của bạn");
      setStep(2);
    } catch (err) {
      alert("Gửi mã OTP thất bại");
      console.error(err);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyResetOTP({ email, otp });
      alert("Xác thực OTP thành công");
      setStep(3);
    } catch (err) {
      alert("Xác thực OTP thất bại");
      console.error(err);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    try {
      await resetPassword({ email, newPassword: password });
      alert("Đổi mật khẩu thành công");
      navigate("/profile");
    } catch (err) {
      alert("Đổi mật khẩu thất bại");
      console.error(err);
    }
  };

  return (
    <AuthLayout title="Đổi Mật Khẩu">
      {step === 1 && (
        <form className="auth__form fade-step" onSubmit={handleSendOTP}>
          <input
            type="email"
            className="auth__input"
            value={email}
            disabled
          />
          <button type="submit" className="auth__button">
            Gửi mã OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="auth__form fade-step" onSubmit={handleVerifyOTP}>
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
            Gửi lại mã
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

export default ChangePassword;
