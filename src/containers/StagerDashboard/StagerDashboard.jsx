import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as stagerSelectors } from 'ducks/stager';
import {
  operations as stagerOperations,
} from 'ducks/stager';
import StagerPage from './StagerPage';

class StagerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
    const { getDashboardCounts } = props;
    getDashboardCounts();
  }

  render() {
    const { counts, isFirstVisit } = this.props;
    return <StagerPage counts={counts} isFirstVisit={isFirstVisit} />;
  }
}

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
  counts: stagerSelectors.getCounts(state),
});

const mapDispatchToProps = dispatch => ({
  getDashboardCounts: stagerOperations.getDashboardCounts(dispatch),
});

StagerDashboard.propTypes = {
  counts: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          aboutToBreach: PropTypes.number,
          displayName: PropTypes.string,
          searchTerm: PropTypes.string,
          slaBreached: PropTypes.number,
          total: PropTypes.number,
        }),
      ),
      displayName: PropTypes.string,
    }),
  ).isRequired,
  getDashboardCounts: PropTypes.func.isRequired,
  isFirstVisit: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StagerDashboard);
