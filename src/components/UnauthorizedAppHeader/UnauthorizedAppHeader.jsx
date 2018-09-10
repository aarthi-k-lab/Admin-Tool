import React from 'react';

import './UnauthorizedAppHeader.css';

function Header() {
  return (
    <header styleName="header">
      <img alt="logo" src="/static/img/logo.png" />
      <span styleName="spacer" />
    </header>
  );
}

export default Header;
