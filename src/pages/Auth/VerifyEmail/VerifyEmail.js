import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../assets/styles/Login.css";
import Logo from "../../../components/basicComponents/Logo";
import OtpInput from "../../../components/auth/OTPinput";
import { verifyAccountOTP, sendVerifyOTP } from "../../../services/authService";
import { useEffect } from "react";


const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const email = query.get("email") || "";
  const [otp, setOtp] = useState("");
  const [resendSuccess, setResendSuccess] = useState(false);

   useEffect (() => {
    const sendOTP = async () => {
        if (email)
            try {
        await sendVerifyOTP({ email }); // ✅ Gửi mã OTP
        } catch (err) {
        alert("Có lỗi xảy ra khi gửi mã OTP.");
        console.error(err);
        }
    };
    sendOTP();
   }, [email]);
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyAccountOTP({ email, otp });
      alert("✅ Xác thực thành công! Mời bạn đăng nhập.");
      navigate("/login");
    } catch (err) {
      alert("❌ Xác thực thất bại. Vui lòng kiểm tra lại mã OTP.");
      console.error(err);
    }
  };

  const handleResendOTP = async () => {
    try {
      const success = await sendVerifyOTP({ email });
      if (success) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 3000);
      } else {
        alert("Không thể gửi lại OTP. Thử lại sau.");
      }
    } catch (err) {
      alert("Có lỗi xảy ra khi gửi lại OTP.");
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
          <p className="auth__slogan">
            Nhập mã OTP đã gửi đến email <strong>{email}</strong>
          </p>

          <OtpInput
            value={otp}
            onChange={setOtp}
            onSubmit={handleVerify}
            title="Xác Thực Tài Khoản"
          />

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <button onClick={handleResendOTP} className="auth__resend-btn">
              Gửi lại mã OTP
            </button>
            {resendSuccess && (
              <p style={{ color: "green", marginTop: "8px" }}>
                ✅ OTP đã được gửi lại!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
