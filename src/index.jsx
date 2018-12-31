
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './state';
import App from './containers/App';
import ErrorBoundary from './ErrorBoundary';

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  const { default: mock } = require('./api-mocks');
  mock();
}

const store = configureStore();

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <App />
    </Provider>
  </ErrorBoundary>,
  document.getElementById('app'),
);
