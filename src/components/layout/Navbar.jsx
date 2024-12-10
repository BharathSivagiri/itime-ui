import React from 'react';
import './css/Navbar.css';
import Logo from '../../images/logo192.png';
import { MdOutlineWidgets } from "react-icons/md";
import {useAuth} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";

const Navbar = ({ 
  toggleWidgetConfig, 
  showWidgetConfig, 
  widgetConfig, 
  toggleWidget, 
  resetWidgets 
}) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
      <img src={Logo} alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-right">
        <div className="user-profile">
          <span>Welcome</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="widget-config">
          <button className="widget-config-btn" onClick={toggleWidgetConfig}>
          <MdOutlineWidgets />
          </button>
          {showWidgetConfig && (
            <div className="widget-config-menu">
              <div className="widget-toggle">
                <span>Punch Widget</span>
                <label className="switch">
                  <input 
                    type="checkbox"
                    checked={widgetConfig.punchWidget}
                    onChange={() => toggleWidget('punchWidget')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="widget-toggle">
                <span>Calendar Widget</span>
                <label className="switch">
                  <input 
                    type="checkbox"
                    checked={widgetConfig.calendarWidget}
                    onChange={() => toggleWidget('calendarWidget')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              {/* Add more widget toggles here */}
              <button className="reset-widgets" onClick={resetWidgets}>
                Reset All Widgets
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;