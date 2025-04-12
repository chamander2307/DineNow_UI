import React, { useEffect,useRef, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import '../assets/styles/Navbar.css';
import LogoIcon from '../assets/img/DineNow_2.svg';


const Header = () => {
  const[isLogin,setIsLogin] = useState(false);
  const[showDropdown,setShowDropdown] = useState(false);
  const[userName,setUserName] = useState('');
  const navigate = useNavigate();
  const dropDownRef=useRef();

  useEffect(()=>{
    const accessToken = localStorage.getItem('accessToken');
    const name = localStorage.getItem('userName');
    if(accessToken && name){
      setIsLogin(true);
      setUserName(name);
    }
  },[]);
  useEffect(()=>{
    const handleClickOutside = (e)=>{
      if(dropDownRef.current && !dropDownRef.current.contains(e.target)){
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown',handleClickOutside);
    return()=>document.removeEventListener('mousedown',handleClickOutside);
  }, []);
  const handleLogout = () =>{
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    setShowDropdown(false);
    setIsLogin(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src={LogoIcon} alt="Logo" className="logo-img"/>
          <span className="logo-text">DineNow</span>
        </Link>
        <nav className="nav">
          <Link to="/">Trang Chủ</Link>
          <Link to="/search">Tìm Kiếm</Link>
          { isLogin ? ( 
            <div className="user-menu" ref={dropDownRef}>
              <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
                <img src="https://genk.mediacdn.vn/139269124445442048/2023/12/6/naruto-6-5448-1701839899156-1701839899299913130408.jpg" alt="avatar" className="avatar" />
                <span className="username">{userName}</span>
              </div>
              {showDropdown&&(
                <div className="dropdown-menu">
                  <Link to="/profile">Tài Khoản Của Tôi</Link>
                  <Link to="/orders">Đơn Đặt</Link>
                  <button onClick={handleLogout}>Đăng Xuất</button>
                </div>
              )}
            </div>
          ) : (
          <>
          <Link to="/login">Đăng Nhập</Link>
          <Link to="/register">Đăng Ký</Link>
          </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
