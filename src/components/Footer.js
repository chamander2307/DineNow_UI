import React from 'react';
import '../assets/styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h4 className="footer__title">DineNow</h4>
          <p className="footer__text">Đặt bàn trực tuyến dễ dàng tại các nhà hàng yêu thích của bạn.</p>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Liên kết</h4>
          <ul className="footer__list">
            <li><a href="/terms" className="footer__link">Điều khoản</a></li>
            <li><a href="/support" className="footer__link">Hỗ trợ</a></li>
            <li><a href="/privacy" className="footer__link">Chính sách riêng tư</a></li>
          </ul>
        </div>
        <div className="footer__section">
          <h4 className="footer__title">Liên hệ</h4>
          <p className="footer__text">Email: support@dinenow.vn</p>
          <p className="footer__text">© 2025 DineNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;