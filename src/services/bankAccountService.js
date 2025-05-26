import axios from '../config/axios';

// Tạo tài khoản ngân hàng
export const createBankAccount = async (bankAccountData) => {
  try {
    const response = await axios.post("/api/owner/bank-accounts", bankAccountData);
    console.log("Response từ createBankAccount:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản ngân hàng:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Cập nhật tài khoản ngân hàng
export const updateBankAccount = async (bankAccountData) => {
  try {
    const response = await axios.put("/api/owner/bank-accounts", bankAccountData);
    console.log("Response từ updateBankAccount:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật tài khoản ngân hàng:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

// Lấy thông tin tài khoản ngân hàng
export const getBankAccount = async () => {
  try {
    const response = await axios.get("/api/owner/bank-accounts");
    console.log("Response từ getBankAccount:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tài khoản ngân hàng:", error);
    console.error("Error response:", error.response?.data);
    throw error;
  }
};

