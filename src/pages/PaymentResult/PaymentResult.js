import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/home/PaymentResult.css';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy paymentStatus từ query parameters
  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get('paymentStatus');
  
  // Xác định nội dung hiển thị dựa trên paymentStatus
  const isSuccess = paymentStatus === 'SUCCESS';
  const title = isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại';
  const message = isSuccess
    ? 'Cảm ơn bạn đã thanh toán! Đơn hàng của bạn đã được xử lý thành công.'
    : 'Xin lỗi, thanh toán của bạn không thể thực hiện. Vui lòng thử lại hoặc liên hệ hỗ trợ.';
  const icon = isSuccess ? '✅' : '❌';
  
  // Xử lý nút chuyển hướng về trang chủ
  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className="payment-page-container">
      <div className="payment-card">
        <div className="payment-icon">{icon}</div>
        <h1 className="payment-title">{title}</h1>
        <p className="payment-message">{message}</p>
        <button className="payment-button" onClick={handleRedirect}>
          Về Trang Chủ
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;