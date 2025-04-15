import React, { useState } from 'react';

const ResetPasswordForm = ({ onSubmit, title = 'Đổi Mật Khẩu' }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }
    onSubmit(password);
  };

  return (
    <>
      {title && <h3 className="auth__title">{title}</h3>}
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          type="password"
          className="auth__input"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="auth__input"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth__button">Đổi mật khẩu</button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
