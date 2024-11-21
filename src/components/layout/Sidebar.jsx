import React, { useState } from 'react';
import './css/Sidebar.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssessmentIcon from '@mui/icons-material/Assessment';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: <DashboardIcon /> },
    { name: 'Time Entry', icon: <AccessTimeIcon /> },
    { name: 'Reports', icon: <AssessmentIcon /> },
    { name: 'Projects', icon: <FolderIcon /> },
    { name: 'Settings', icon: <SettingsIcon /> }
  ];

  return (
    <div 
      className={`sidebar ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => (
          <li key={index} className={`menu-item ${index === 0 ? 'active' : ''}`}>
            <span className="icon">{item.icon}</span>
            <span className="label">{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
