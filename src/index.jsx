
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './state';
import App from './containers/App';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  const { default: mock } = require('./api-mocks');
  mock();
}

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
