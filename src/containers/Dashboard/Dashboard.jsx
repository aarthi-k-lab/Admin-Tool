import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as dashboardSelectors, operations } from 'ducks/dashboard';
import * as R from 'ramda';
import LandingPage from './LandingPage';
import EvaluationPage from './EvaluationPage';
import UserReport from './UserReport';
import { selectors as loginSelectors } from '../../state/ducks/login';

function getPage(isFirstVisit, group, userGroupList) {
  const homepage = R.contains(`${group.toLowerCase()}-mgr`, userGroupList) ? <UserReport /> : <LandingPage />;
  return isFirstVisit && group !== 'LA' ? homepage : <EvaluationPage group={group} />;
}

function Dashboard(props) {
  const {
    isFirstVisit, group, onGetGroupName, userGroupList,
  } = props;
  onGetGroupName(group);
  return getPage(isFirstVisit, group, userGroupList);
}

const TestExports = {
  Dashboard,
};

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
  userGroupList: loginSelectors.getGroupList(state),
});

Dashboard.defaultProps = {
  group: 'FEUW',
};
Dashboard.propTypes = {
  group: PropTypes.string,
  isFirstVisit: PropTypes.bool.isRequired,
  onGetGroupName: PropTypes.func.isRequired,
  userGroupList: PropTypes.arrayOf(PropTypes.string).isRequired,
};
const mapDispatchToProps = dispatch => ({
  onGetGroupName: operations.onGetGroupName(dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
export { TestExports };
