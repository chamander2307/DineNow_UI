import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/styles/Login.css";
import Logo from "../../../components/Logo";
import { login } from "../../../services/authService";
import { getUserProfile } from "../../../services/userService";
import { UserContext } from "../../../contexts/UserContext";

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
      const res = await login({ email, password }); // res = { status, message, data }
      console.log("📦 Login API response:", res);

      const accessToken = res?.data?.accessToken;
      if (!accessToken) {
        const err = new Error();
        err.response = {
          status: 418,
          data: { message: "Tài khoản chưa xác thực." },
        };
        throw err;
      }

      localStorage.setItem("accessToken", accessToken);

      // ✅ cập nhật context
      const profile = await getUserProfile();
      setUser(profile);
      setIsLogin(true);

      console.log("✅ Đăng nhập thành công");
      navigate("/");
    } catch (err) {
      console.error("===> Lỗi đăng nhập:");
      console.error("Status:", err?.response?.status);
      console.error("Message:", err?.response?.data?.message);

      const status = err?.response?.status;
      const serverMessage = err?.response?.data?.message;
      const fallbackMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (status === 418) {
        setError("Tài khoản chưa xác thực. Đang chuyển hướng...");
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        }, 1500);
      } else if (status === 409) {
        setError("Email hoặc mật khẩu không đúng.");
      } else {
        setError(serverMessage || fallbackMessage);
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
