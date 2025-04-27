import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/styles/home/Login.css";
import Logo from "../../../components/basicComponents/Logo";
import { login, googleLogin } from "../../../services/authService";
import { getUserProfile } from "../../../services/userService";
import { UserContext } from "../../../contexts/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password });
      console.log("Login API response:", res);

      // Nếu status là lỗi (401, 418, ...) → ném lỗi thủ công để chuyển sang catch
      if (res?.status && res.status !== 200) {
        throw { response: res };
      }

      const accessToken = res?.data?.accessToken;
      if (!accessToken) {
        throw new Error("Phản hồi không chứa accessToken");
      }

      localStorage.setItem("accessToken", accessToken);

      const profile = await getUserProfile();
      setUser(profile);
      setIsLogin(true);

      console.log("Đăng nhập thành công");
      navigate("/");
    } catch (err) {
      console.error("Chi tiết lỗi:", err);

      const status = err?.response?.status;
      const message = err?.response?.data?.message;

      if (status === 418) {
        setError("Tài khoản chưa xác thực. Đang chuyển hướng...");
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        }, 1500);
        return;
      }

      switch (status) {
        case 401:
          setError("Email không hợp lệ.");
          break;
        case 409:
          setError("Email hoặc mật khẩu không đúng.");
          break;
        case 405:
          setError("Yêu cầu xác thực. Vui lòng kiểm tra email.");
          break;
        case 413:
          setError("Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên.");
          break;
        case 500:
          setError("Lỗi máy chủ. Vui lòng thử lại sau.");
          break;
        default:
          setError(message || "Đăng nhập thất bại.");
      }
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
            <button type="submit">Đăng nhập</button>
            <div style={{ marginTop: "15px" }}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const { credential } = credentialResponse;
                    const decoded = jwtDecode(credential);
                    const res = await googleLogin({ idToken: credential });
                    const accessToken = res?.data?.accessToken;
                    if (!accessToken) throw new Error("Google login failed");
                    localStorage.setItem("accessToken", accessToken);
                    const profile = await getUserProfile();
                    setUser(profile);
                    setIsLogin(true);
                    navigate("/");
                  } catch (err) {
                    console.error("Google login failed:", err);
                    setError("Đăng nhập Google thất bại.");
                  }
                }}
                onError={() => {
                  console.log("Google Login Failed");
                  setError("Đăng nhập Google thất bại.");
                }}
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
