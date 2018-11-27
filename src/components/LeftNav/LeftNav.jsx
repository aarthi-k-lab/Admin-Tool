import React from 'react';
import { Link } from 'react-router-dom';
// import AgentLoanView from '@material-ui/icons/FeaturedPlayListOutlined';
// import StagerIcon from '@material-ui/icons/Send';

import './LeftNav.css';

function LeftNav() {
  return (
    <div styleName="stretch-column">
      <nav id="cmod_leftnav" styleName="left-nav-bar">
        <Link to="/reports">
          <img alt="dashboard" src="/static/img/icon-dashboard.png" />
        </Link>
        <Link to="/loan-evaluation">
          <img alt="loan-evaluation" src="/static/img/frontend.svg" />
        </Link>
        <Link to="/stager">
          <img alt="stager" src="/static/img/stager.svg" />
        </Link>
      </nav>
    </div>
  );
}

export default LeftNav;
