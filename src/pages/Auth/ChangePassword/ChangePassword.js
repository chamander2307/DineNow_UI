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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await sendForgotOTP(email);
      if (response?.status === 200 || response?.success) {
        alert("Mã OTP đã được gửi đến email của bạn");
        setStep(2);
      } else {
        setError("Gửi mã OTP thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi gửi OTP:", err);
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 404:
            setError("Email không tồn tại trong hệ thống.");
            break;
          case 429:
            setError("Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.");
            break;
          case 500:
            setError("Lỗi máy chủ. Vui lòng thử lại sau.");
            break;
          default:
            setError("Gửi mã OTP thất bại. Vui lòng thử lại.");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
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
        alert("Xác thực OTP thành công");
        setStep(3);
      } else {
        setError("Xác thực OTP thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi xác thực OTP:", err);
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 400:
            setError("Mã OTP không hợp lệ.");
            break;
          case 410:
            setError("Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
            break;
          case 404:
            setError("Không tìm thấy yêu cầu đặt lại mật khẩu.");
            break;
          default:
            setError("Xác thực OTP thất bại. Vui lòng thử lại.");
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
      setError("Mật khẩu phải dài ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
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
        alert("Đổi mật khẩu thành công");
        navigate("/profile");
      } else {
        setError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 400:
            setError("Dữ liệu không hợp lệ.");
            break;
          case 410:
            setError("Phiên đặt lại mật khẩu đã hết hạn. Vui lòng thực hiện lại từ đầu.");
            break;
          case 500:
            setError("Lỗi máy chủ. Vui lòng thử lại sau.");
            break;
          default:
            setError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra email trước khi render
  if (!email) {
    return (
      <AuthLayout title="Đổi Mật Khẩu">
        <div className="error-message">
          Không tìm thấy thông tin email. Vui lòng đăng nhập lại.
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Đổi Mật Khẩu">
      {error && <div className="error-message" style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}
      
      {step === 1 && (
        <form className="auth__form fade-step" onSubmit={handleSendOTP}>
          <input
            type="email"
            className="auth__input"
            value={email}
            disabled
          />
          <button type="submit" className="auth__button" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi mã OTP"}
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="auth__form fade-step" onSubmit={handleVerifyOTP}>
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
            {loading ? "Đang xác thực..." : "Xác thực"}
          </button>
          <button
            type="button"
            className="auth__link"
            onClick={() => {setStep(1); setError(""); setOtp("");}}
            disabled={loading}
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
          <button type="submit" className="auth__button" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ChangePassword;