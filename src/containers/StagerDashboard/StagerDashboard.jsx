import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import StagerPage from './StagerPage';

function StagerDashboard(props) {
  const { isFirstVisit } = props;
  return <StagerPage isFirstVisit={isFirstVisit} />;
}

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
});

StagerDashboard.propTypes = {
  isFirstVisit: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(StagerDashboard);
