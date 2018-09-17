import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import AppContainer from '../AppContainer';
import Header from '../AppHeader';
import Body from '../Body';
import LeftNav from '../LeftNav';
import MainContent from '../MainContent';

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
