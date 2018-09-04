import React from 'react';

import './Header.css';

function Header() {
  return (
    <header styleName="header">
      <img alt="logo" src="/static/img/logo.png" />
      <span styleName="spacer" />
      <img alt="search" src="/static/img/search.png" styleName="search" />
      <img alt="profile" src="/static/img/profile.png" />
    </header>
  );
}

export default Header;
