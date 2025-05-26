// services/paymentService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/customer/payments';

export const createPaymentUrl = async (orderId) => {
  try {
    console.log(`${API_BASE_URL}/create-url/${orderId}`);
    const response = await axios.post(`${API_BASE_URL}/create-url/${orderId}`);
    console.log('Tạo URL thanh toán thành công:', response.data);
    if (response.status === 200 || response.status === 201) {
      
      if (response.data && response.data.data && typeof response.data.data === 'string') {
        return response.data.data; // Trả về URL thanh toán
      }
      throw new Error('URL thanh toán không hợp lệ trong phản hồi.');
    }
    throw new Error('Yêu cầu không thành công. Vui lòng thử lại.');
  } catch (error) {
    console.error('Lỗi khi tạo URL thanh toán:', error);
    throw error.response 
      ? new Error(error.response.data.message || 'Không thể tạo URL thanh toán. Vui lòng kiểm tra quyền truy cập hoặc trạng thái đơn hàng.')
      : new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
  }
};