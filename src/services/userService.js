import axios from '../config/axios';

// Lấy danh sách tất cả người dùng (chỉ dành cho ADMIN)
export const getAllUsers = async () => {
  const res = await axios.get('/users');
  return res.data.data; // mảng UserDTO
};

// Tạo người dùng mới
export const createUser = async (userDTO) => {
  const res = await axios.post('/users', userDTO);
  return res.data.data; // trả về user mới tạo
};
