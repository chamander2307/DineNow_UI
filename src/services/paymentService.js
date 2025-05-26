import axios from '../config/axios';

// Hàm tạo URL thanh toán cho đơn hàng
export const createPaymentUrl = async (orderId) => {
  try {
    // Kiểm tra orderId hợp lệ
    if (!orderId || isNaN(orderId)) {
      throw new Error('ID đơn hàng không hợp lệ.');
    }

    // Gọi API tạo URL thanh toán
    const res = await axios.post(`/api/customer/payments/create-url/${orderId}`);

    // Kiểm tra phản hồi
    if (!res.data?.data) {
      throw new Error('Phản hồi API không chứa URL thanh toán.');
    }

    const paymentUrl = res.data.data;

    // Kiểm tra bảo mật: đảm bảo URL thuộc VNPAY
    if (typeof paymentUrl !== 'string' || !paymentUrl.includes('vnpayment.vn')) {
      throw new Error('URL thanh toán không hợp lệ hoặc không thuộc VNPAY.');
    }

    return paymentUrl;
  } catch (error) {
    console.error('Lỗi khi tạo URL thanh toán:', error);
    throw new Error(`Không thể tạo URL thanh toán: ${error.response?.data?.message || error.message}`);
  }
};