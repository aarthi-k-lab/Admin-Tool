import React from 'react';
import ChervronLeft from '@material-ui/icons/ChevronLeft';

import './CollapseIcon.css';

const CollapseIcon = () => (
  <span styleName="collapse-icon-container">
    <ChervronLeft />
    <ChervronLeft styleName="shift-left" />
  </span>
);

export default CollapseIcon;
