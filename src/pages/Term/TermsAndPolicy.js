import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/TermsAndPolicy.css';

const TermsAndPolicy = () => {
  return (
    <div className="terms-container">
      <h1>Điều khoản & Chính sách</h1>

      <section className="terms-section">
        <h2>1. Quyền riêng tư</h2>
        <p>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dưới đây là các chính sách quyền riêng tư mà chúng tôi áp dụng:
        </p>
        <ul>
          <li>
            <strong>Thu thập thông tin:</strong> Chúng tôi chỉ thu thập các thông tin cần thiết như họ tên, email, số điện thoại để cung cấp dịch vụ tốt nhất cho bạn.
          </li>
          <li>
            <strong>Sử dụng thông tin:</strong> Thông tin của bạn sẽ được sử dụng để xác thực tài khoản, gửi thông báo, và cải thiện trải nghiệm người dùng.
          </li>
          <li>
            <strong>Chia sẻ thông tin:</strong> Chúng tôi không chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi có sự đồng ý của bạn hoặc theo yêu cầu của pháp luật.
          </li>
          <li>
            <strong>Bảo mật:</strong> Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ dữ liệu của bạn khỏi truy cập trái phép.
          </li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>2. Điều khoản sử dụng</h2>
        <p>
          Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản sau:
        </p>
        <ul>
          <li>
            <strong>Đăng ký tài khoản:</strong> Bạn phải cung cấp thông tin chính xác khi đăng ký và chịu trách nhiệm bảo mật tài khoản của mình.
          </li>
          <li>
            <strong>Hành vi cấm:</strong> Không sử dụng dịch vụ để thực hiện các hành vi vi phạm pháp luật, lừa đảo, hoặc gây hại cho người khác.
          </li>
          <li>
            <strong>Đặt bàn:</strong> Khi đặt bàn qua hệ thống, bạn cần tuân thủ các quy định của nhà hàng và chính sách hủy đặt bàn.
          </li>
          <li>
            <strong>Trách nhiệm:</strong> Chúng tôi không chịu trách nhiệm cho các tranh chấp phát sinh giữa bạn và nhà hàng.
          </li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>3. Liên hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi nào về điều khoản và chính sách của chúng tôi, vui lòng liên hệ qua email: <a href="mailto:info@restaurantwebsite.com">info@restaurantwebsite.com</a>.
        </p>
      </section>

      <div className="back-to-home">
        <Link to="/">Quay lại trang chủ</Link>
      </div>
    </div>
  );
};

export default TermsAndPolicy;