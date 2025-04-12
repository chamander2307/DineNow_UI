import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import '../../../assets/styles/Login.css';
import Logo from "../../../components/Logo";
import {login} from "../../../services/authService";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) =>{
    e.preventDefault();
    try{
      const data = await login({email,password});
      localStorage.setItem('accessToken',data.accessToken);
      console.log('Đăng nhập thành công');
      navigate('/');
    }catch(err){
      alert('Đăng nhập thất bại');
      console.log(err);
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
            <div className="input-icon">
              <i className="fa fa-envelope" />
              <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}
               required />
            </div>
            <div className="input-icon">
              <i className="fa fa-lock" />
              <input type="password" placeholder="Mật khẩu" value={password} onChange={(e)=>setPassword(e.target.value)}required />
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
