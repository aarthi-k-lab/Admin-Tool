import React from 'react';

import './LeftNav.css';

function LeftNav() {
  return (
    <div styleName="stretch-column">
      <nav id="cmod_leftnav" styleName="left-nav-bar">
        <img alt="dashboard" src="/static/img/icon-dashboard.png" />
      </nav>
    </div>
  );
}

export default LeftNav;
