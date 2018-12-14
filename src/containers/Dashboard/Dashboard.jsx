import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import LandingPage from './LandingPage';
import EvaluationPage from './EvaluationPage';

function Dashboard(props) {
  const { isFirstVisit } = props;
  return isFirstVisit ? <LandingPage /> : <EvaluationPage />;
}

const TestExports = {
  Dashboard,
};

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
});

Dashboard.propTypes = {
  isFirstVisit: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(Dashboard);
export { TestExports };
