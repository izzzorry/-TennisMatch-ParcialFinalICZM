import React from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({ onMouseEnter, onMouseLeave }) => {
  return (
    <div className="dropdown-menu" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="dropdown-item">
        <img src="url-to-children-image" alt="" />
        <p>Children</p>
      </div>
      <div className="dropdown-item">
        <img src="url-to-teens-image" alt="" />
        <p>Teens</p>
      </div>
      <div className="dropdown-item">
        <img src="url-to-adults-image" alt="" />
        <p>Adults</p>
      </div>
    </div>
  );
};

export default DropdownMenu;
