import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/userService';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { setUser, setIsLogin } = useContext(UserContext);

  // ✅ Khi component này được render, ta bắt đầu xử lý token từ Google
  useEffect(() => {
    // Lấy token từ query param sau khi Google redirect về, ví dụ: ?token=abc123
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    // Nếu có token thì tiếp tục xử lý đăng nhập
    if (token) {
      // ✅ Lưu token vào localStorage để sử dụng cho các API tiếp theo
      localStorage.setItem("accessToken", token);

      // ✅ Gọi API lấy thông tin user tương ứng với token này
      getUserProfile().then(profile => {
        // Cập nhật user vào context toàn cục (đã đăng nhập)
        setUser(profile);
        setIsLogin(true);

        // ✅ Điều hướng người dùng về trang chủ
        navigate("/");
      });
    } else {
      // ❌ Nếu không có token (truy cập lỗi), quay về trang đăng nhập
      navigate("/login");
    }
  }, [navigate, setUser, setIsLogin]);

  // Trong lúc đang xử lý thì hiện thông báo tạm
  return <p>Đang xử lý đăng nhập Google...</p>;
};

export default OAuth2RedirectHandler;
