import React, { useContext, useEffect, useState } from 'react';
import '../../assets/styles/Profile.css';
import { UserContext } from '../../contexts/UserContext';
import { updateUserProfile } from '../../services/userService';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    avatar: '',
  });

  // ✅ Load dữ liệu người dùng từ context vào form
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dob: user.dob || '',
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  // ✅ Cập nhật dữ liệu khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Xử lý khi nhấn nút "Lưu"
  const handleSubmit = async () => {
    // Kiểm tra tên không được trống
    if (!formData.fullName.trim()) {
      alert("❌ Tên không được để trống");
      return;
    }

    // Kiểm tra số điện thoại hợp lệ: đúng 10 chữ số
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("❌ Số điện thoại không hợp lệ. Phải là 10 chữ số.");
      return;
    }

    try {
      // Gửi API cập nhật chỉ với các trường hợp lệ
      const updated = await updateUserProfile({
        fullName: formData.fullName,
        phone: formData.phone,
      });

      setUser(updated); // cập nhật lại context
      alert("✅ Cập nhật thành công!");
    } catch (err) {
      console.error("❌ Cập nhật thất bại:", err);
      alert("❌ Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-layout">
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-user">
            <p>{formData.fullName}</p>
          </div>
          <nav>
            <ul>
              <li className="active">Hồ Sơ</li>
              <li>Đơn Mua</li>
              <li>Cài Đặt Thông Báo</li>
            </ul>
          </nav>
        </aside>

        {/* Content */}
        <section className="profile-content">
          <h2>Hồ Sơ Của Tôi</h2>
          <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

          <div className="profile-form">
            <div className="profile-left">
              {/* Họ tên */}
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              {/* Email - chỉ xem, không chỉnh sửa */}
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} disabled />
              </div>

              {/* Số điện thoại */}
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Nút lưu */}
              <button className="save-btn" onClick={handleSubmit}>
                Lưu
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
