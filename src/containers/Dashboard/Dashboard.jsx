import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as dashboardSelectors, operations } from 'ducks/dashboard';
// import LandingPage from './LandingPage';
import { Redirect } from 'react-router-dom';
import EvaluationPage from './EvaluationPage';
import UserReport from './UserReport';

function getPage(isFirstVisit, group) {
  // return isFirstVisit && group !== 'LA' ? <LandingPage /> : <EvaluationPage group={group} />;
  return isFirstVisit && group !== 'LA' ? <UserReport /> : <EvaluationPage group={group} />;
}

function Dashboard(props) {
  const {
    isFirstVisit,
    group,
    isPostModEndShift,
    onGetGroupName,
  } = props;
  onGetGroupName(group);
  if (isPostModEndShift) {
    return <Redirect to="/stager" />;
  }
  return getPage(isFirstVisit, group);
}

const TestExports = {
  Dashboard,
};

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
  isPostModEndShift: dashboardSelectors.isPostModEndShift(state),
});

Dashboard.defaultProps = {
  group: 'FEUW',
  isPostModEndShift: false,
};

Dashboard.propTypes = {
  group: PropTypes.string,
  isFirstVisit: PropTypes.bool.isRequired,
  isPostModEndShift: PropTypes.bool,
  onGetGroupName: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onGetGroupName: operations.onGetGroupName(dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export { TestExports };
