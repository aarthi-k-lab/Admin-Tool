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
    this.state = {
      loading: props.loading,
    };
  }

  componentDidMount() {
    const { getDashboardCounts } = this.props;
    getDashboardCounts();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { counts, isFirstVisit } = nextProps;
    const activeFlags = prevState.activeTab && prevState.activeTile;
    if (isFirstVisit && counts.length > 0 && !activeFlags) {
      const activeTab = counts[0].displayName;
      const activeTile = counts[0].data[0].displayName;
      return { activeTab, activeTile };
    }
    return prevState;
  }

  onStatusCardClick(searchTerm, activeTile, activeTab) {
    const { getDashboardData } = this.props;
    this.setState({ activeTab, activeTile });
    this.setState({ loading: true });
    getDashboardData(searchTerm);
  }

  render() {
    const { counts, isFirstVisit } = this.props;
    const { activeTab, activeTile, loading } = this.state;
    return (
      <StagerPage
        activeTab={activeTab}
        activeTile={activeTile}
        counts={counts}
        isFirstVisit={isFirstVisit}
        loading={loading}
        onStatusCardClick={
          (searchTerm,
            tileName,
            tabName) => this.onStatusCardClick(searchTerm, tileName, tabName)
        }
      />
    );
  }
}

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
  counts: stagerSelectors.getCounts(state),
  loading: stagerSelectors.getLoaderInfo(state),
});

const mapDispatchToProps = dispatch => ({
  getDashboardCounts: stagerOperations.getDashboardCounts(dispatch),
  getDashboardData: stagerOperations.getDashboardData(dispatch),
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
  ),
  getDashboardCounts: PropTypes.func.isRequired,
  getDashboardData: PropTypes.func.isRequired,
  isFirstVisit: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
};

StagerDashboard.defaultProps = {
  counts: [],
  loading: true,
};

export default connect(mapStateToProps, mapDispatchToProps)(StagerDashboard);
