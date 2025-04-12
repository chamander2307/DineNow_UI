import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/TermsAndPolicy.css'; // Cập nhật đường dẫn CSS

const Support = () => {
  return (
    <div className="terms-container">
      <h1>Hỗ trợ</h1>

      <div className="terms-section">
        <h2>1. Liên hệ với chúng tôi</h2>
        <p>
          Nếu bạn cần hỗ trợ, vui lòng liên hệ với đội ngũ của DineNow qua các kênh sau:
        </p>
        <ul>
          <li>Email: <a href="mailto:support@dinenow.com">support@dinenow.com</a></li>
          <li>Số điện thoại: 0123 456 789 (Giờ làm việc: 8:00 - 22:00)</li>
          <li>Địa chỉ: 123 Đường Ẩm Thực, TP. HCM</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>2. Các câu hỏi thường gặp (FAQ)</h2>
        <p>Dưới đây là một số câu hỏi thường gặp:</p>
        <ul>
          <li>
            <strong>Làm thế nào để đặt bàn?</strong>
            <p>Bạn có thể đặt bàn trực tiếp trên trang chi tiết nhà hàng bằng cách nhấn nút "Đặt bàn ngay".</p>
          </li>
          <li>
            <strong>Làm sao để hủy đặt bàn?</strong>
            <p>Vui lòng liên hệ với nhà hàng hoặc đội ngũ hỗ trợ của chúng tôi để hủy đặt bàn.</p>
          </li>
          <li>
            <strong>Tôi có thể thay đổi thông tin tài khoản không?</strong>
            <p>Có, bạn có thể chỉnh sửa thông tin tài khoản trong phần "Cài đặt" sau khi đăng nhập.</p>
          </li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>3. Hỗ trợ kỹ thuật</h2>
        <p>
          Nếu bạn gặp vấn đề kỹ thuật (ví dụ: lỗi đăng nhập, không thể tải trang), vui lòng gửi email cho chúng tôi tại <a href="mailto:tech@dinenow.com">tech@dinenow.com</a>. Chúng tôi sẽ phản hồi trong vòng 24 giờ.
        </p>
      </div>

      <div className="terms-section">
        <h2>4. Góp ý và khiếu nại</h2>
        <p>
          Chúng tôi luôn hoan nghênh ý kiến đóng góp của bạn để cải thiện dịch vụ. Vui lòng gửi góp ý hoặc khiếu nại qua email: <a href="mailto:feedback@dinenow.com">feedback@dinenow.com</a>.
        </p>
      </div>

      <div className="back-to-home">
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default Support;