import React from 'react';

import './Header.css';
import search from '../images/Search.png';
import profile from '../images/Profile.png';
import logo from '../images/Logo.png';

function Header() {
  return (
    <div styleName="header">
      <div styleName="header">
        <div id="cmod_homepage" styleName="header-h1">
          <img alt="logo" src={logo} />
        </div>
        <div styleName="header-logo">
          <img alt="profile" src={profile} />
        </div>
        <div styleName="header-search">
          <img alt="search" src={search} />
        </div>
      </div>
    </div>
  );
}

export default Header;
