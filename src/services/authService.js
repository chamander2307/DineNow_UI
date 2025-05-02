import axios from '../config/axios';

// 1. Đăng ký người dùng mới
export const register = async (userData) => {
  const res = await axios.post('/auth/register', userData);
  return res.data.data;
};

// 2. Đăng nhập
export const login = async (credentials) => {
  const res = await axios.post('/auth/login', credentials);
  return res.data; // Trả cả status, message, data
};

// 3. Đăng xuất
export const logout = async () => {
  const res = await axios.post('/auth/logout');
  return res.data.data; // true hoặc false
};

// 4. Làm mới access token
export const refreshToken = async () => {
  const res = await axios.post('/auth/refresh-token');
  return res.data.data; // { accessToken }
};

// 5. Gửi OTP xác thực tài khoản
export const sendVerifyOTP = async ({ email }) => {
  const res = await axios.post('/auth/send-verification-otp', { email });
  return res.data.data;
};

// 6. Gửi OTP đổi mật khẩu
export const sendForgotOTP = async (email) => {
  const res = await axios.post('/auth/forgot-password', { email });
  return res.data.data;
};

// 7. Xác thực OTP tài khoản
export const verifyAccountOTP = async ({ email, otp }) => {
  const res = await axios.post('/auth/verify-account', { email, otp });
  return res.data.data;
};

// 8. Xác thực OTP đổi mật khẩu
export const verifyResetOTP = async ({ email, otp }) => {
  const res = await axios.post('/auth/verify-reset-password-otp', { email, otp });
  return res.data.data;
};

// 9. Đổi mật khẩu
export const resetPassword = async ({ email, newPassword }) => {
  const res = await axios.post('/auth/reset-password', { email, newPassword });
  return res.data.data;
};
// 10. Đăng nhập bằng Google
export const googleLogin = async ({ idToken }) => {
  const res = await axios.post('/auth/google-login', { idToken });
  return res.data;
};
