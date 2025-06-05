import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/home/Profile.css';
import { UserContext } from '../../contexts/UserContext';
import { updateUserProfile } from '../../services/userService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userHttpStatusMessages from '../../constants/userHttpStatusMessages';

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    avatar: '',
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (user?.isGoogleAccount) {
      toast.error('Tài khoản Google không thể thay đổi thông tin.');
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error(userHttpStatusMessages[410] || 'Tên không được để trống.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      toast.error(userHttpStatusMessages[410] || 'Số điện thoại không được để trống.');
      return;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast.error(userHttpStatusMessages[410] || 'Số điện thoại không hợp lệ. Phải là 10 chữ số.');
      return;
    }

    try {
      const updated = await updateUserProfile({
        fullName: formData.fullName,
        phone: formData.phone,
      });
      setUser({ ...updated, isGoogleAccount: user.isGoogleAccount });
      toast.success(userHttpStatusMessages[200] || 'Cập nhật thành công!');
    } catch (err) {
      console.error('Cập nhật thất bại:', err);
      const status = err.response?.status || 500;
      toast.error(userHttpStatusMessages[status] || 'Cập nhật thất bại. Vui lòng thử lại.');
    }
  };

  const isGoogleAccount = user?.isGoogleAccount || false;

  return (
    <div className="profile-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-user">
            <p>{formData.fullName}</p>
          </div>
          <nav>
            <ul>
              <li className="active">Hồ Sơ</li>
            </ul>
          </nav>
        </aside>

        <section className="profile-content">
          <h2>Hồ Sơ Của Tôi</h2>
          <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

          <div className="profile-form">
            <div className="profile-left">
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isGoogleAccount}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={formData.email} disabled />
              </div>

              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isGoogleAccount}
                />
              </div>

              <div className="form-actions">
                <button
                  className="save-btn"
                  onClick={handleSubmit}
                  disabled={isGoogleAccount}
                >
                  Lưu
                </button>
                <button
                  className="change-password-btn"
                  onClick={() => navigate('/change-password')}
                  disabled={isGoogleAccount}
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;