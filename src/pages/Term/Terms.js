import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/TermsAndPolicy.css';

const Terms = () => {
  return (
    <div className="terms-container">
      <h1>Điều khoản sử dụng</h1>

      <div className="terms-section">
        <h2>1. Chấp nhận điều khoản</h2>
        <p>
          Bằng cách sử dụng DineNow, bạn đồng ý tuân thủ các điều khoản và điều kiện được liệt kê dưới đây. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
        </p>
      </div>

      <div className="terms-section">
        <h2>2. Sử dụng dịch vụ</h2>
        <p>Bạn đồng ý:</p>
        <ul>
          <li>Không sử dụng DineNow cho bất kỳ mục đích bất hợp pháp nào.</li>
          <li>Cung cấp thông tin chính xác khi đăng ký và đặt bàn.</li>
          <li>Không gây gián đoạn hoặc làm hại hệ thống của DineNow.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>3. Trách nhiệm của DineNow</h2>
        <p>
          DineNow chỉ đóng vai trò là nền tảng kết nối giữa người dùng và nhà hàng. Chúng tôi không chịu trách nhiệm về chất lượng dịch vụ của nhà hàng hoặc bất kỳ tranh chấp nào phát sinh giữa bạn và nhà hàng.
        </p>
      </div>

      <div className="terms-section">
        <h2>4. Thay đổi điều khoản</h2>
        <p>
          Chúng tôi có quyền thay đổi điều khoản sử dụng này bất kỳ lúc nào. Các thay đổi sẽ được thông báo qua email hoặc trên trang web của chúng tôi.
        </p>
      </div>

      <div className="terms-section">
        <h2>5. Liên hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@dinenow.com">support@dinenow.com</a> hoặc số điện thoại: 0123 456 789.
        </p>
      </div>

      <div className="back-to-home">
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default Terms;