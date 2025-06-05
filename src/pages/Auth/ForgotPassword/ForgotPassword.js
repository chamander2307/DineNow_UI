import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/auth/AuthLayout";
import "../../../assets/styles/home/Login.css";
import {
  sendForgotOTP,
  verifyResetOTP,
  resetPassword,
} from "../../../services/authService";
import httpStatusMessages from "../../../constants/httpStatusMessages";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await sendForgotOTP(email);
      if (response?.data === true) {
        alert("Mã OTP đã được gửi đến email của bạn.");
        setStep(2);
      } else {
        setError(httpStatusMessages[response?.data] || "Không thể gửi mã OTP. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Gửi OTP thất bại:", err);
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 404:
            setError(httpStatusMessages[404] || "Email không tồn tại trong hệ thống.");
            break;
          case 429:
            setError(httpStatusMessages[429] || "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.");
            break;
          case 500:
            setError(httpStatusMessages[500] || "Lỗi máy chủ. Vui lòng thử lại sau.");
            break;
          default:
            setError(httpStatusMessages[status] || err.response.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại.");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError("Vui lòng nhập đúng 6 chữ số OTP.");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyResetOTP({ email, otp });
      if (response?.data === true) {
        alert("Xác thực OTP thành công.");
        setStep(3);
      } else {
        setError(httpStatusMessages[response?.data] || "Xác thực OTP thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Xác thực OTP thất bại:", err);
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 400:
            setError(httpStatusMessages[400] || "Mã OTP không hợp lệ.");
            break;
          case 410:
            setError(httpStatusMessages[410] || "Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
            break;
          case 404:
            setError(httpStatusMessages[404] || "Không tìm thấy yêu cầu đặt lại mật khẩu.");
            break;
          default:
            setError(httpStatusMessages[status] || err.response.data?.message || "Xác thực OTP thất bại. Vui lòng thử lại.");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(httpStatusMessages[410] || "Mật khẩu phải dài ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      setLoading(false);
      return;
    }

    try {
      const response = await resetPassword({ email, newPassword: password });
      if (response?.status === 200 || response?.success) {
        alert("Đổi mật khẩu thành công. Mời bạn đăng nhập.");
        navigate("/login");
      } else {
        setError(httpStatusMessages[response?.status] || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Đổi mật khẩu thất bại:", err);
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 400:
            setError(httpStatusMessages[400] || "Dữ liệu không hợp lệ.");
            break;
          case 410:
            setError(httpStatusMessages[410] || "Phiên đặt lại mật khẩu đã hết hạn. Vui lòng thực hiện lại từ đầu.");
            break;
          case 500:
            setError(httpStatusMessages[500] || "Lỗi máy chủ. Vui lòng thử lại sau.");
            break;
          default:
            setError(httpStatusMessages[status] || err.response.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại.");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
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
          <button type="submit" className="auth__button" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi mã OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="auth__form fade-step" onSubmit={handleOtpSubmit}>
          <input type="email" className="auth__input" value={email} disabled />
          <input
            type="text"
            className="auth__input"
            placeholder="Nhập mã OTP (6 chữ số)"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            required
          />
          <button type="submit" className="auth__button" disabled={loading}>
            {loading ? "Đang xác thực..." : "Xác thực OTP"}
          </button>
          <button
            type="button"
            className="auth__link"
            onClick={() => setStep(1)}
            disabled={loading}
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
          <button type="submit" className="auth__button" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;