import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import { FaTasks, FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import { SlOptions } from "react-icons/sl";
import './css/Dashboard.css';
import { ENDPOINTS } from '../constants/apiEndpoints';
import { MESSAGES } from '../constants/AppMessages';
import moment from 'moment';

const Dashboard = () => {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [weeklyStats, setWeeklyStats] = useState({
    totalShiftHours: '--:--',
    totalActualHours: '--:--'
  });
  const [punchData, setPunchData] = useState({
    punchInTime: null,
    punchOutTime: null,
    totalWorkingHours: null,
    lastPunch: null,
    shiftStartTime: null,
    shiftEndTime: null
  });

  const getWeekRange = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); 
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: 'short'
    })} - ${end.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: 'short'
    })}`;
  };

  const navigateWeek = async (direction) => {
    const newSelectedWeek = moment(selectedWeek);
    const updatedSelectedWeek = direction === 'next' ? newSelectedWeek.add(1, 'weeks') : newSelectedWeek.subtract(1, 'weeks');
    setSelectedWeek(updatedSelectedWeek.toDate());

    const weekStart = updatedSelectedWeek.clone().startOf('week').format('YYYY-MM-DD');
    const weekEnd = updatedSelectedWeek.clone().endOf('week').format('YYYY-MM-DD');

    await fetchWeeklyStats(weekStart, weekEnd);
  };

  const fetchWeeklyStats = async (weekStart, weekEnd) => {
    try {
      const response = await fetch(
          `${ENDPOINTS.PUNCH}/weekly-stats?startDate=${weekStart}&endDate=${weekEnd}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
      );
      if (response.ok) {
        const data = await response.json();
        setWeeklyStats({
          totalShiftHours: data.totalShiftHours || '--:--',
          totalActualHours: data.totalActualHours || '--:--'
        });
      }
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  };

  const fetchPunchData = async () => {
    const dataDate = moment().format("YYYY-MM-DD HH:mm:ss");
    try {
      const response = await fetch(`${ENDPOINTS.PUNCH_CALCULATE}?date=${dataDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setPunchData(data);
      setIsPunchedIn(data.lastPunch === 'IN');
    } catch (error) {
      console.error(MESSAGES.PUNCH_DATA_FETCH_ERROR, error);
    }
  };

  useEffect(() => {
    const currentWeek = moment(selectedWeek);
    const weekStart = currentWeek.clone().startOf('week').format('YYYY-MM-DD');
    const weekEnd = currentWeek.clone().endOf('week').format('YYYY-MM-DD');
    fetchPunchData();
    fetchWeeklyStats(weekStart, weekEnd);
  }, []);

  const handlePunchClick = async () => {
    const punchRequest = {
      punchType: isPunchedIn ? 'OUT' : 'IN'
    };

    try {
      const response = await fetch(ENDPOINTS.PUNCH, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(punchRequest)
      });

      if (response.ok) {
        setIsPunchedIn(!isPunchedIn);
        setTimeout(fetchPunchData, 500);
      }
    } catch (error) {
      console.error(MESSAGES.PUNCH_RECORD_ERROR, error);
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const shiftEndTime = punchData.shiftEndTime;
    
    // If it's a night shift that ends the next day
    if (shiftEndTime) {
      const [hours, minutes] = shiftEndTime.split(':');
      const shiftEnd = new Date();
      shiftEnd.setHours(parseInt(hours), parseInt(minutes), 0);
      
      // If current time is before shift end but after midnight
      // Keep showing previous day's date
      if (now.getHours() < parseInt(hours) && punchData.lastPunch === 'IN') {
        now.setDate(now.getDate() - 1);
      }
    }
    
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format the datetime string to show only time
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return '--:--';
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const [widgetConfig, setWidgetConfig] = useState({
    punchWidget: true,
    calendarWidget: true,
    // More widgets can be added
  });
  
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);
  
  const toggleWidgetConfig = () => {
    setShowWidgetConfig(!showWidgetConfig);
  };
  
  const toggleWidget = (widgetName) => {
    setWidgetConfig(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }));
  };
  
  const resetWidgets = () => {
    setWidgetConfig({
      punchWidget: true,
      calendarWidget: true,
      // Resets all widgets to true
    });
  };
  
  // State for tracking current displayed month
  const [currentDate, setCurrentDate] = useState(new Date());

  // Functions to handle month navigation
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };
  
  return (
    <div className="dashboard-container">
      <Navbar 
        toggleWidgetConfig={toggleWidgetConfig}
        showWidgetConfig={showWidgetConfig}
        widgetConfig={widgetConfig}
        toggleWidget={toggleWidget}
        resetWidgets={resetWidgets}
      />
      <div className="dashboard-content">
        <Sidebar />
        <div className="widgets-container">
          {widgetConfig.punchWidget && (
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
                    {punchData.shiftStartTime?.substring(0, 5)} - {punchData.shiftEndTime?.substring(0, 5)}
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
                    <span>{formatTime(punchData.punchInTime)}</span>
                  </div>
                  <div className="time-item">
                    <h5>Punch-Out</h5>
                    <span>{formatTime(punchData.punchOutTime)}</span>
                  </div>
                  <div className="time-item">
                    <h5>Work Hours</h5>
                    <span>{punchData.totalWorkingHours || '--:--:--'}</span>
                  </div>
                </div>
              </div>
              <div className="weekly-stats-container">
                <div className="weekly-stats-header">
                  <h5>Weekly Stats</h5>
                  <div className="week-navigator">
                    <FaChevronLeft 
                      className="week-nav-icon" 
                      onClick={() => navigateWeek('prev')}
                    />
                    <span className="week-range">{getWeekRange(selectedWeek)}</span>
                    <FaChevronRight 
                      className="week-nav-icon" 
                      onClick={() => navigateWeek('next')}
                    />
                  </div>
                </div>
                <div className="weekly-time-details">
                  <div className="weekly-time-item">
                    <span className="time-label">Scheduled Hours</span>
                    <span className="time-value">{weeklyStats.totalShiftHours}</span>
                  </div>
                  <div className="weekly-time-item">
                    <span className="time-label">Worked Hours</span>
                    <span className="time-value">{weeklyStats.totalActualHours}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Calendar Widget */}
          {widgetConfig.calendarWidget && (
            <div className="widget calendar-widget">
              <div className="widget-header">
                <div className="date-with-icon">
                  <FaCalendarAlt className="calendar-icon" />
                  <h4>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                </div>
                <div className="calendar-navigation">
                  <button className="month-nav" onClick={prevMonth}>
                    <FaChevronLeft />
                  </button>
                  <button className="month-nav" onClick={nextMonth}>
                    <FaChevronRight />
                  </button>
                </div>
                <div className="menu-container">
                  <SlOptions className="menu-icon" onClick={toggleMenu} />
                </div>
              </div>
              <div className="calendar-content">
                <div className="calendar-grid">
                  <div className="weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="weekday">{day}</div>
                    ))}
                  </div>
                  <div className="days">
                    {Array.from({ length: 35 }, (_, i) => {
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                      const firstDay = date.getDay();
                      const currentDateNum = i - firstDay + 1;
                      const isCurrentMonth = currentDateNum > 0 && currentDateNum <= new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                      
                      return (
                        <div 
                          key={i} 
                          className={`day ${isCurrentMonth ? 'current-month' : 'other-month'} ${
                            currentDateNum === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() && 
                            currentDate.getFullYear() === new Date().getFullYear() 
                              ? 'today' 
                              : ''
                          }`}
                        >
                          {isCurrentMonth ? currentDateNum : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other widgets with their respective config checks */}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;