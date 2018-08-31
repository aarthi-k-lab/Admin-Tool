import React from 'react';

import './LeftNav.css';
import Dashboard from '../images/Dashboard.png';

function LeftNav() {
  return (
    <div id="cmod_leftnav" styleName="leftmenubar">
      <img alt="menu" src={Dashboard} styleName="leftmenu" />
    </div>
  );
}

export default LeftNav;
