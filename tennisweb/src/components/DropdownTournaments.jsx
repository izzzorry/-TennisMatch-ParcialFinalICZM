import React from 'react';
import './DropdownMenu.css';

const DropdownTournaments = ({ onMouseEnter, onMouseLeave }) => {
  return (
    <div className="dropdown-menu-tournaments" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="dropdown-item">
        <img src="url-to-upcoming-image" alt="" />
        <p>Upcoming</p>
      </div>
      <div className="dropdown-item">
        <img src="url-to-ongoing-image" alt="" />
        <p>Ongoing</p>
      </div>
      <div className="dropdown-item">
        <img src="url-to-past-image" alt="" />
        <p>Past</p>
      </div>
    </div>
  );
};

export default DropdownTournaments;
