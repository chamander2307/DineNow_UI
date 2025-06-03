const adminHttpStatusMessages = {
  200: "Thành công",
  400: "Yêu cầu không hợp lệ hoặc thiếu tham số",
  401: "Chưa đăng nhập hoặc phiên làm việc đã hết hạn",
  403: "Không có quyền truy cập",
  404: "Tài nguyên không tìm thấy",
  500: "Lỗi máy chủ nội bộ",
  402: "Token không hợp lệ hoặc hết hạn",
  408: "Tài nguyên đang được sử dụng",
  410: "Dữ liệu đầu vào không hợp lệ",
  416: "Tài nguyên đã tồn tại",
  420: "Tải hình ảnh lên thất bại",
  421: "Xóa hình ảnh thất bại",
  422: "Không tìm thấy hình ảnh",
  423: "Loại hình ảnh không hợp lệ. Chỉ cho phép PNG, JPG, JPEG và GIF",
};

export default adminHttpStatusMessages;