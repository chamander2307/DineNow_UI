// src/constants/httpStatusMessages.js
const httpStatusMessages = {
  // 🔹 Chuẩn HTTP
  200: "Thành công",
  201: "Tạo mới thành công",
  401: "Chưa đăng nhập hoặc phiên làm việc đã hết hạn",
  403: "Không có quyền truy cập",
  404: "Tài nguyên không tìm thấy",
  405: "Phương thức không được hỗ trợ",
  500: "Lỗi máy chủ nội bộ",

  // 🔸 Custom code (tùy backend bạn định nghĩa)
  402: "Token không hợp lệ hoặc hết hạn",
  406: "Email đã tồn tại",
  407: "Số điện thoại đã tồn tại",
  408: "Người dùng đã tồn tại",
  409: "Mật khẩu hoặc email không hợp lệ",
  410: "Dữ liệu đầu vào không hợp lệ",
  411: "OTP không hợp lệ",
  412: "Yêu cầu đổi mật khẩu không hợp lệ hoặc đã hết hạn",
  418: "Tài khoản chưa được xác thực",
};

export default httpStatusMessages;
