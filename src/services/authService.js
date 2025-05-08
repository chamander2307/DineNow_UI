import axios from '../config/axios';

// ========== AUTH API ==========

// 1. Đăng ký người dùng mới
export const register = async (userData) => {
  const res = await axios.post('/api/auth/register', userData);
  return res.data.data;
};

// 2. Đăng nhập
// Hàm đăng nhập
export const login = async (credentials) => {
  const res = await axios.post('/api/auth/login', credentials);
  
  // Kiểm tra và lưu accessToken vào localStorage
  if (res.data && res.data.accessToken) {
    localStorage.setItem('accessToken', res.data.accessToken);
  }
  
  return res.data;
};


// 3. Đăng xuất
export const logout = async () => {
  const res = await axios.post('/api/auth/logout');
  return res.data.data;
};

// 4. Làm mới access token
export const refreshToken = async () => {
  const res = await axios.post('/api/auth/refresh-token');
  return res.data.data;
};

// 5. Gửi OTP xác thực tài khoản
export const sendVerifyOTP = async ({ email }) => {
  const res = await axios.post('/api/auth/send-verification-otp', { email });
  return res.data.data;
};

// 6. Gửi OTP đổi mật khẩu
export const sendForgotOTP = async (email) => {
  const res = await axios.post('/api/auth/forgot-password', { email });
  return res.data.data;
};

// 7. Xác thực OTP tài khoản
export const verifyAccountOTP = async ({ email, otp }) => {
  const res = await axios.post('/api/auth/verify-account', { email, otp });
  return res.data.data;
};

// 8. Xác thực OTP đổi mật khẩu
export const verifyResetOTP = async ({ email, otp }) => {
  const res = await axios.post('/api/auth/verify-reset-password-otp', { email, otp });
  return res.data.data;
};

// 9. Đổi mật khẩu
export const resetPassword = async ({ email, newPassword }) => {
  const res = await axios.post('/api/auth/reset-password', { email, newPassword });
  return res.data.data;
};

// 10. Đăng nhập bằng Google
export const googleLogin = async ({ idToken }) => {
  const res = await axios.post('/api/auth/google-login', { idToken });
  return res.data;
};
