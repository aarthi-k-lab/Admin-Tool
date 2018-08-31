import React from 'react';

import './Header.css';

function Header() {
  return (
    <header styleName="header">
      <img alt="logo" src="/static/images/logo.png" />
      <span styleName="spacer" />
      <img alt="search" src="/static/images/search.png" />
      <img alt="profile" src="/static/images/profile.png" />
    </header>
  );
}

export default Header;
