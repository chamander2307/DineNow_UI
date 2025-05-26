// services/paymentService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/customer/payments';

export const createPaymentUrl = async (orderId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/create-url/${orderId}`);
    if (response.data && response.data.status === 201 && response.data.data) {
      return response.data.data; // Trả về URL thanh toán
    }
    throw new Error('Không thể tạo URL thanh toán.');
  } catch (error) {
    console.error('Lỗi khi tạo URL thanh toán:', error);
    throw error.response ? error.response.data.message : 'Lỗi kết nối server.';
  }
};