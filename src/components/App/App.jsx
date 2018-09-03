import React from 'react';
import { hot } from 'react-hot-loader';
import Header from '../AppHeader';
import Body from '../Body';
import LeftNav from '../LeftNav';
import MainContent from '../MainContent';
import ContentHeader from '../ContentHeader';

import './App.css';

function App() {
  return (
    <div styleName="app">
      <Header />
      <Body>
        <LeftNav />
        <MainContent>
          <ContentHeader />
        </MainContent>
      </Body>
    </div>
  );
}

export default hot(module)(App);
