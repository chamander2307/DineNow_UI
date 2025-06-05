import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../assets/styles/home/Login.css";
import Logo from "../../../components/basicComponents/Logo";
import OtpInput from "../../../components/auth/OTPinput";
import { verifyAccountOTP, sendVerifyOTP } from "../../../services/authService";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const email = query.get("email") || "";

  const [otp, setOtp] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    const sendInitialOTP = async () => {
      if (!email) {
        setError("Không tìm thấy thông tin email. Vui lòng đăng ký lại.");
        return;
      }

      try {
        const response = await sendVerifyOTP({ email });
        if (response?.status === 200 || response?.success) {
          console.log("OTP đã được gửi tự động khi vào trang");
        } else {
          setError("Không thể gửi mã OTP. Vui lòng thử gửi lại.");
        }
      } catch (err) {
        console.error("Lỗi gửi OTP tự động:", err);
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
              setError("Có lỗi xảy ra khi gửi mã OTP. Vui lòng thử gửi lại.");
          }
        } else {
          setError("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
        }
      }
    };

    sendInitialOTP();
  }, [email]);

  // ...existing code...
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp || otp.length !== 6) {
      setError("Vui lòng nhập đúng 6 chữ số OTP.");
      setLoading(false);
      return;
    }

    try {
      const response = await verifyAccountOTP({ email, otp });

      // Debug: Log response để kiểm tra
      console.log("Verify response:", response);

      // Kiểm tra chính xác điều kiện thành công
      if (response?.status === 200 && response?.success !== false) {
        alert("Xác thực thành công! Mời bạn đăng nhập.");
        navigate("/login");
      } else {
        const status = response?.status;
        const message = response?.message;

        switch (status) {
          case 404:
            setError("Không tìm thấy người dùng hoặc mã OTP không hợp lệ.");
            break;
          case 400:
            setError("Mã OTP không hợp lệ.");
            break;
          case 410:
            setError("Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
            break;
          case 409:
            setError("Tài khoản đã được xác thực trước đó.");
            setTimeout(() => navigate("/login"), 2000);
            break;
          default:
            setError(message || "Xác thực thất bại. Vui lòng kiểm tra lại mã OTP.");
        }
      }
    } catch (err) {
      console.error("Lỗi xác thực OTP:", err);
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data?.message;

        switch (status) {
          case 404:
            setError("Không tìm thấy người dùng. Vui lòng đăng ký lại.");
            break;
          case 400:
            setError("Mã OTP không hợp lệ.");
            break;
          case 410:
            setError("Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.");
            break;
          case 409:
            setError("Tài khoản đã được xác thực trước đó.");
            setTimeout(() => navigate("/login"), 2000);
            break;
          default:
            setError(message || "Xác thực thất bại. Vui lòng thử lại.");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setResendLoading(true);
    setResendSuccess(false);

    try {
      const response = await sendVerifyOTP({ email });
      if (response?.status === 200 || response?.success) {
        setResendSuccess(true);
        setOtp("");
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setError("Không thể gửi lại OTP. Vui lòng thử lại sau.");
      }
    } catch (err) {
      console.error("Lỗi gửi lại OTP:", err);
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 404:
            setError("Email không tồn tại trong hệ thống.");
            break;
          case 429:
            setError("Bạn đã gửi quá nhiều yêu cầu. Vui lòng đợi một chút rồi thử lại.");
            break;
          case 409:
            setError("Tài khoản đã được xác thực. Không cần gửi lại OTP.");
            setTimeout(() => navigate("/login"), 2000);
            break;
          case 500:
            setError("Lỗi máy chủ. Vui lòng thử lại sau.");
            break;
          default:
            setError("Có lỗi xảy ra khi gửi lại OTP. Vui lòng thử lại.");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  // Kiểm tra email hợp lệ
  if (!email) {
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
            <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
              Không tìm thấy thông tin email. Vui lòng đăng ký lại.
            </div>
            <button
              onClick={() => navigate("/register")}
              className="auth__button"
              style={{ marginTop: '20px' }}
            >
              Quay lại đăng ký
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="auth__slogan">
            Nhập mã OTP đã gửi đến email <strong>{email}</strong>
          </p>

          {error && (
            <div style={{
              color: 'red',
              textAlign: 'center',
              marginBottom: '15px',
              padding: '10px',
              background: '#ffebee',
              borderRadius: '4px',
              border: '1px solid #ffcdd2'
            }}>
              {error}
            </div>
          )}

          <OtpInput
            value={otp}
            onChange={setOtp}
            onSubmit={handleVerify}
            title="Xác Thực Tài Khoản"
            disabled={loading}
          />

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button
              onClick={handleResendOTP}
              className="auth__resend-btn"
              disabled={resendLoading || loading}
            >
              {resendLoading ? "Đang gửi..." : "Gửi lại mã OTP"}
            </button>

            {resendSuccess && (
              <p style={{
                color: "green",
                marginTop: "8px",
                padding: '8px',
                background: '#e8f5e8',
                borderRadius: '4px'
              }}>
                ✅ OTP đã được gửi lại thành công!
              </p>
            )}
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => navigate("/register")}
              className="auth__link"
              disabled={loading || resendLoading}
            >
              Quay lại đăng ký
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;