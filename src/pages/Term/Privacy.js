import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/TermsAndPolicy.css'; // Cập nhật đường dẫn CSS

const Privacy = () => {
  return (
    <div className="terms-container">
      <h1>Chính sách bảo mật</h1>

      <div className="terms-section">
        <h2>1. Thu thập thông tin</h2>
        <p>
          Chúng tôi tại DineNow cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi thu thập các thông tin như tên, email, số điện thoại và địa chỉ khi bạn đăng ký tài khoản hoặc đặt bàn tại các nhà hàng.
        </p>
        <p>
          Ngoài ra, chúng tôi cũng thu thập dữ liệu về lịch sử đặt bàn và sở thích ẩm thực để cải thiện trải nghiệm của bạn trên nền tảng.
        </p>
      </div>

      <div className="terms-section">
        <h2>2. Sử dụng thông tin</h2>
        <p>Thông tin của bạn được sử dụng để:</p>
        <ul>
          <li>Xử lý yêu cầu đặt bàn và cung cấp dịch vụ hỗ trợ.</li>
          <li>Gửi thông báo về các ưu đãi, chương trình khuyến mãi hoặc sự kiện đặc biệt.</li>
          <li>Cải thiện dịch vụ và cá nhân hóa trải nghiệm của bạn.</li>
        </ul>
      </div>

      <div className="terms-section">
        <h2>3. Chia sẻ thông tin</h2>
        <p>
          Chúng tôi không bán hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi cần thiết để cung cấp dịch vụ (ví dụ: chia sẻ với nhà hàng bạn đặt bàn) hoặc theo yêu cầu của pháp luật.
        </p>
      </div>

      <div className="terms-section">
        <h2>4. Bảo mật thông tin</h2>
        <p>
          Chúng tôi áp dụng các biện pháp bảo mật hiện đại để bảo vệ thông tin của bạn khỏi truy cập trái phép, mất mát hoặc lạm dụng.
        </p>
      </div>

      <div className="terms-section">
        <h2>5. Quyền của bạn</h2>
        <p>
          Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình. Để thực hiện, vui lòng liên hệ với chúng tôi qua <a href="mailto:support@dinenow.com">support@dinenow.com</a>.
        </p>
      </div>

      <div className="terms-section">
        <h2>6. Liên hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:support@dinenow.com">support@dinenow.com</a> hoặc số điện thoại: 0123 456 789.
        </p>
      </div>

      <div className="back-to-home">
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default Privacy;