import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as dashboardSelectors, operations } from 'ducks/dashboard';
// import LandingPage from './LandingPage';
import EvaluationPage from './EvaluationPage';
import UserReport from './UserReport';

function getPage(isFirstVisit, group) {
  // return isFirstVisit && group !== 'LA' ? <LandingPage /> : <EvaluationPage group={group} />;
  return isFirstVisit && group !== 'LA' ? <UserReport /> : <EvaluationPage group={group} />;
}

function Dashboard(props) {
  const { isFirstVisit, group, onGetGroupName } = props;
  onGetGroupName(group);
  return getPage(isFirstVisit, group);
}

const TestExports = {
  Dashboard,
};

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
});

Dashboard.defaultProps = {
  group: 'FEUW',
};
Dashboard.propTypes = {
  group: PropTypes.string,
  isFirstVisit: PropTypes.bool.isRequired,
  onGetGroupName: PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch => ({
  onGetGroupName: operations.onGetGroupName(dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export { TestExports };
