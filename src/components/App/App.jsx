import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader';
import AppContainer from 'components/AppContainer';
import Header from 'components/AppHeader';
import Body from 'components/Body';
import LeftNav from 'components/LeftNav';
import MainContent from 'components/MainContent';

function App({ user, children }) {
  return (
    <AppContainer>
      <Header user={user} />
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
  user: PropTypes.shape({
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

export default hot(module)(App);
