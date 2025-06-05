import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/styles/home/Login.css";
import Logo from "../../../components/basicComponents/Logo";
import { login, googleLogin } from "../../../services/authService";
import { getUserProfile } from "../../../services/userService";
import { UserContext } from "../../../contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import httpStatusMessages from "../../../constants/httpStatusMessages";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái loading
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ email, password });
      console.log("Login API response:", res);

      const token = res?.data?.accessToken;
      if (res?.status === 200 || res?.success) {
        localStorage.setItem("accessToken", token);
        const profile = await getUserProfile();
        console.log("Thông tin người dùng:", profile);
        setUser(profile);
        setIsLogin(true);
        navigate("/");
      } else {
        const status = res?.status;
        switch (status) {
          case 418:
            setError(httpStatusMessages[418] || "Tài khoản chưa xác thực. Đang chuyển hướng...");
            setTimeout(() => {
              navigate(`/verify-email?email=${encodeURIComponent(email)}`);
            }, 1500);
            break;
          case 401:
            setError(httpStatusMessages[401] || "Email không hợp lệ.");
            break;
          case 409:
            setError(httpStatusMessages[409] || "Email hoặc mật khẩu không đúng.");
            break;
          case 405:
            setError(httpStatusMessages[405] || "Yêu cầu xác thực. Vui lòng kiểm tra email.");
            break;
          case 413:
            setError(httpStatusMessages[413] || "Tài khoản đã bị khoá.");
            break;
          case 500:
            setError(httpStatusMessages[500] || "Lỗi máy chủ. Vui lòng thử lại sau.");
            break;
          default:
            setError(httpStatusMessages[status] || res?.data?.message || "Đăng nhập thất bại.");
        }
      }
    } catch (err) {
      console.error("Chi tiết lỗi:", err);
      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 418:
            setError(httpStatusMessages[418] || "Tài khoản chưa xác thực. Đang chuyển hướng...");
            setTimeout(() => {
              navigate(`/verify-email?email=${encodeURIComponent(email)}`);
            }, 1500);
            break;
          case 401:
            setError(httpStatusMessages[401] || "Email không hợp lệ.");
            break;
          case 409:
            setError(httpStatusMessages[409] || "Email hoặc mật khẩu không đúng.");
            break;
          case 405:
            setError(httpStatusMessages[405] || "Yêu cầu xác thực. Vui lòng kiểm tra email.");
            break;
          case 413:
            setError(httpStatusMessages[413] || "Tài khoản đã bị khoá.");
            break;
          case 500:
            setError(httpStatusMessages[500] || "Lỗi máy chủ. Vui lòng thử lại sau.");
            break;
          default:
            setError(httpStatusMessages[status] || err.response.data?.message || "Đăng nhập thất bại.");
        }
      } else {
        setError("Lỗi kết nối. Vui lòng kiểm tra internet và thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      const { credential } = credentialResponse;
      const decoded = jwtDecode(credential);
      console.log("Google decoded token:", decoded);

      const res = await googleLogin({ idToken: credential });
      const token = res?.data?.accessToken;
      if (res?.status === 200 || res?.success) {
        localStorage.setItem("accessToken", token);
        const profile = await getUserProfile();
        setUser(profile);
        setIsLogin(true);
        navigate("/");
      } else {
        setError(httpStatusMessages[res?.status] || res?.data?.message || "Đăng nhập Google thất bại.");
      }
    } catch (err) {
      console.error("Google login failed:", err);
      if (err.response) {
        const status = err.response.status;
        setError(httpStatusMessages[status] || err.response.data?.message || "Đăng nhập Google thất bại.");
      } else {
        setError("Lỗi kết nối. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
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
            Đặt bàn & thưởng thức ẩm thực dễ dàng cùng DineNow
          </p>

          <form className="auth__form" onSubmit={handleLogin}>
            {error && <div className="auth__error">{error}</div>}

            <div className="input-icon">
              <i className="fa fa-envelope" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div style={{ marginTop: "15px" }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.log("Google Login Failed");
                  setError(httpStatusMessages[500] || "Đăng nhập Google thất bại.");
                }}
                disabled={loading}
              />
            </div>

            <div className="auth__extra">
              <Link to="/forgot-password">Quên mật khẩu?</Link>
              <span> | </span>
              <Link to="/register">Đăng ký</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;