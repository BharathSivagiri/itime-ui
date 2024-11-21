import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { FaTasks, FaChevronLeft, FaChevronRight, FaEllipsisV } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import Calendar from 'react-calendar';
import './css/Dashboard.css';
import 'react-calendar/dist/Calendar.css';

const Dashboard = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentWeek] = useState('17 Dec - 23 Dec');
  const [date, setDate] = useState(new Date());
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);

  const handlePunchClick = () => {
    setIsPunchedIn(!isPunchedIn);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <div className="widgets-container">
          <div className="widget">
            <div className="widget-header">
              <div className="date-with-icon">
                <FaTasks className="check-icon" />
                <h4>{getCurrentDate()}</h4>
              </div>
              <div className="menu-container">
                <SlOptions className="menu-icon" onClick={toggleMenu} />
                {showMenu && (
                  <div className="menu-popup">
                    <div className="menu-item">More Details</div>
                  </div>
                )}
              </div>
            </div>
            <div className="time-widget-content">
              <div className="punch-controls">
                <div className="shift-hours">
                  <h5>Shift Hours</h5>
                  <span>9:00 - 6:00</span>
                </div>
                <button 
                  className={`punch-button ${isPunchedIn ? 'punched-in' : ''}`}
                  onClick={handlePunchClick}
                >
                  {isPunchedIn ? 'Punch-Out' : 'Punch-In'}
                </button>
              </div>
              <div className="time-details">
                <div className="time-item">
                  <h5>Punch-In</h5>
                  <span>9:00</span>
                </div>
                <div className="time-item">
                  <h5>Punch-Out</h5>
                  <span>6:00</span>
                </div>
                <div className="time-item">
                  <h5>Work Hours</h5>
                  <span>8:00</span>
                </div>
              </div>
            </div>
            <div className="weekly-stats-container">
              <div className="weekly-stats-header">
                <h5>Weekly Stats</h5>
                <div className="week-navigator">
                  <FaChevronLeft className="week-nav-icon" />
                  <span className="week-range">{currentWeek}</span>
                  <FaChevronRight className="week-nav-icon" />
                </div>
              </div>
              <div className="weekly-time-details">
                <div className="weekly-time-item">
                  <span className="time-label">Scheduled Hours</span>
                  <span className="time-value">40:00</span>
                </div>
                <div className="weekly-time-item">
                  <span className="time-label">Worked Hours</span>
                  <span className="time-value">38:30</span>
                </div>
              </div>
            </div>
          </div>
          <div className="widget">
            <div className="widget-header">
              <h4>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
              <div className="menu-container">
                <FaEllipsisV className="menu-icon" onClick={() => setShowCalendarMenu(!showCalendarMenu)} />
                {showCalendarMenu && (
                  <div className="menu-popup">
                    <div className="menu-item">More Details</div>
                  </div>
                )}
              </div>
            </div>
            <div className="calendar-container">
              <Calendar 
                onChange={setDate} 
                value={date}
                className="custom-calendar"
              />
            </div>
          </div>
          <div className="widget">
            <h4>Widget 3</h4>
            {/* Widget content */}
          </div>
          <div className="widget">
            <h4>Widget 4</h4>
            {/* Widget content */}
          </div>
          <div className="widget">
            <h4>Widget 4</h4>
            {/* Widget content */}
          </div>
          <div className="widget">
            <h4>Widget 5</h4>
            {/* Widget content */}
          </div>
          <div className="widget">
            <h4>Widget 6</h4>
            {/* Widget content */}
          </div>
          <div className="widget">
            <h4>Widget 7</h4>
            {/* Widget content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;