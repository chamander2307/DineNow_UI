import React from 'react';
import Logo from '../../assets/img/DineNow_2.svg';

const DineNowLogo = ({ size = 300 }) => (
  <img src={Logo} alt="DineNow Logo" style={{ width: size, height: 'auto'}} />
);

export default DineNowLogo;
