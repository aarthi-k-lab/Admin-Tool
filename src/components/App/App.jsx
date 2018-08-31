import React from 'react';
import { hot } from 'react-hot-loader';
import Header from '../Header';

import './App.css';
import Body from '../Body';
// import LeftNav from '../LeftNav';
// import GetNext from '../GetNext';

function App() {
  return (
    <div styleName="app">
      <Header />
      <Body>
        Random
        {/* <GetNext />
        <LeftNav /> */}
      </Body>
    </div>
  );
}

export default hot(module)(App);
