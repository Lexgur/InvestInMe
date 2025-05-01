import React from 'react';
import logo from '../assets/investLogo.png';

const InvestLogo = () => {
  return (
    <div className="invest-logo-container">
      <img src={logo} alt="Invest Logo" className="invest-logo" />
    </div>
  );
};

export default InvestLogo;