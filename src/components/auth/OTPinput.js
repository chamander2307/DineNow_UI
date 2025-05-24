import React from 'react';

const OtpInput = ({ value, onChange, onSubmit, title = 'Nhập mã OTP' }) => {
  return (
    <>
      {title && <h3 className="auth__title">{title}</h3>}
      <form className="auth__form" onSubmit={onSubmit}>
        <input
          type="text"
          className="auth__input"
          placeholder="Nhập mã OTP"
          maxLength={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
        <button type="submit" className="auth__button">Xác nhận</button>
      </form>
    </>
  );
};

export default OtpInput;
