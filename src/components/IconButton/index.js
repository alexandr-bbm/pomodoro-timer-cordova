import React from 'react';
import { Icon } from "../Icon/index";

import './style.css';

export const IconButton = ({ onTouchStart, iconStyle, iconName, text }) => {
  return (
    <button onTouchStart={onTouchStart} className="icon-button">
      <Icon
        name={iconName}
        style={iconStyle}
      />
      <div className="icon-button__text">{text}</div>
    </button>
  )
};
