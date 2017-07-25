import React from 'react';
import { COLORS } from "../../utils/common";

import './style.css';

const DEFAULT_STYLES = { fill: COLORS.Main };

export const Icon = ({ name, onTouchStart, style }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: require(`mdi-svg/svg/${name}.svg`) }}
      onTouchStart={onTouchStart}
      className="icon"
      style={{ ...DEFAULT_STYLES, ...style }}
    />
  )
};
