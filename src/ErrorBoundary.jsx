import AirbrakeClient from 'airbrake-js';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.airbrake = new AirbrakeClient({
      projectId: process.env.AIRBRAKE_PROJECT_ID,
      projectKey: process.env.AIRBRAKE_PROJECT_KEY,
    });
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    this.airbrake.notify({
      error,
      params: { info },
    });
  }

  render() {
    const { hasError } = this.state;
    // eslint-disable-next-line
    const { children } = this.props;
    if (hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return children;
  }
}
export default ErrorBoundary;
