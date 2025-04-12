import React, { useState } from 'react';
import '../../assets/styles/Profile.css';
import defaultAvatar from '../../assets/img/defaultAvatar.webp';
const Profile = () => {
  const [user, setUser] = useState({
    full_name: 'Thanh678x',
    email: 'thanh678xx@gmail.com',
    phone: '0987123451',
    gender: 'male',
    dob: '2003-01-01',
    avatar: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-page">
      <div className="profile-layout">
        <aside className="profile-sidebar">
          <div className="profile-user">
            <img src={defaultAvatar} alt="avatar" className="profile-avatar" />
            <p>{user.full_name}</p>
          </div>
          <nav>
            <ul>
              <li className="active">Hồ Sơ</li>
              <li>Đơn Mua</li>
              <li>Cài Đặt Thông Báo</li>
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
                <input type="text" name="full_name" value={user.full_name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user.email} disabled /> <a href="#">Thay Đổi</a>
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input type="text" value={user.phone} disabled /> <a href="#">Thay Đổi</a>
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <div className="radio-group">
                  <label><input type="radio" name="gender" value="male" checked={user.gender === 'male'} onChange={handleChange} /> Nam</label>
                  <label><input type="radio" name="gender" value="female" checked={user.gender === 'female'} onChange={handleChange} /> Nữ</label>
                </div>
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input type="date" name="dob" value={user.dob} onChange={handleChange} />
              </div>
              <button className="save-btn">Lưu</button>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;