import axios from '../config/axios';

// ========== AUTH API ==========

export const register = async (userData) => {
  try {
    const res = await axios.post('/api/auth/register', userData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const res = await axios.post('/api/auth/login', credentials);
    if (res.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
    }
    return res.data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await axios.post('/api/auth/logout');
    localStorage.removeItem('accessToken');
    return res.data;
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    throw error;
  }
};

export const sendVerifyOTP = async ({ email }) => {
  try {
    const res = await axios.post('/api/auth/send-verification-otp', { email });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gửi OTP xác thực:", error);
    throw error;
  }
};

export const sendForgotOTP = async (email) => {
  try {
    const res = await axios.post('/api/auth/forgot-password', { email });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi gửi OTP đổi mật khẩu:", error);
    throw error;
  }
};

export const verifyAccountOTP = async ({ email, otp }) => {
  try {
    const res = await axios.post('/api/auth/verify-account', { email, otp });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xác thực OTP tài khoản:", error);
    throw error;
  }
};

export const verifyResetOTP = async ({ email, otp }) => {
  try {
    const res = await axios.post('/api/auth/verify-reset-password-otp', { email, otp });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xác thực OTP đổi mật khẩu:", error);
    throw error;
  }
};

export const resetPassword = async ({ email, newPassword }) => {
  try {
    const res = await axios.post('/api/auth/reset-password', { email, newPassword });
    return res.data.data;
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu:", error);
    throw error;
  }
};

export const googleLogin = async ({ idToken }) => {
  try {
    const res = await axios.post('/api/auth/google-login', { idToken });
    if (res.data?.accessToken) {
      localStorage.setItem('accessToken', res.data.accessToken);
    }
    return res.data;
  } catch (error) {
    console.error("Lỗi khi đăng nhập bằng Google:", error);
    throw error;
  }
};