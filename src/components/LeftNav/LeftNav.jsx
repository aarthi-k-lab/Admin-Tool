import React from 'react';
import { Link } from 'react-router-dom';
import AgentLoanView from '@material-ui/icons/FeaturedPlayListOutlined';
import StagerIcon from '@material-ui/icons/Send';

import './LeftNav.css';

function LeftNav() {
  return (
    <div styleName="stretch-column">
      <nav id="cmod_leftnav" styleName="left-nav-bar">
        <Link to="/reports">
          <img alt="dashboard" src="/static/img/icon-dashboard.png" />
        </Link>
        <Link to="/loan-evaluation">
          <AgentLoanView fontSize="inherit" />
        </Link>
        <Link to="/stager">
          <StagerIcon fontSize="inherit" />
        </Link>
      </nav>
    </div>
  );
}

export default LeftNav;
