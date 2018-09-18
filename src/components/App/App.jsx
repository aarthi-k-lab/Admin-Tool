import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import AppContainer from 'components/AppContainer';
import Header from 'components/AppHeader';
import Body from 'components/Body';
import LeftNav from 'components/LeftNav';
import MainContent from 'components/MainContent';

function App({ children }) {
  return (
    <AppContainer>
      <Header />
      <Body>
        <LeftNav />
        <MainContent>
          { children }
        </MainContent>
      </Body>
    </AppContainer>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default hot(module)(App);
