import React from 'react';
import './css/Navbar.css';
import Logo from '../../images/logo192.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
      <img src={Logo} alt="iOPEX Logo" className="navbar-logo" />
        <span>Dashboard</span>
      </div>
      <div className="navbar-right">
        <div className="user-profile">
          <span>Welcome</span>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
