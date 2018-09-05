import React from 'react';
import PropTypes from 'prop-types';
import Header from '../AppHeader';
import Body from '../Body';

import './AppLayout.css';

function AppLayout({ children }) {
  return (
    <div styleName="app ">
      <Header />
      <Body>
        {children}
      </Body>
    </div>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
