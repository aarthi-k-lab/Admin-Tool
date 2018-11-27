import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import StagerPage from './StagerPage';

class StagerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedData: [] };
  }

  componentDidMount() {
    const { getDashboardCounts } = this.props;
    getDashboardCounts();
  }

  onStatusCardClick(searchTerm, activeTile, activeTab) {
    const { getDashboardData, onCheckBoxClick } = this.props;
    this.setState({ activeTab, activeTile });
    getDashboardData(searchTerm);
    onCheckBoxClick([]);
  }

  onCheckBoxClick(isChecked, data) {
    const { onCheckBoxClick, selectedData } = this.props;
    const foundData = selectedData.find(obj => data.TKIID === obj.TKIID);
    if (isChecked && !foundData) {
      selectedData.push(data);
    } else if (!isChecked && foundData) {
      selectedData.splice(selectedData.findIndex(i => i.TKIID === data.TKIID), 1);
    }
    this.setState({ selectedData });
    onCheckBoxClick(selectedData);
  }

  render() {
    const {
      counts, tableData, loading,
    } = this.props;
    const {
      activeTab, activeTile,
      selectedData,
    } = this.state;
    return (
      <StagerPage
        activeTab={activeTab}
        activeTile={activeTile}
        counts={counts}
        loading={loading}
        onCheckBoxClick={(isChecked, data) => this.onCheckBoxClick(isChecked, data)}
        onStatusCardClick={
          (searchTerm,
            tileName,
            tabName) => this.onStatusCardClick(searchTerm, tileName, tabName)
        }
        selectedData={selectedData}
        tableData={tableData}
      />
    );
  }
}

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
  counts: stagerSelectors.getCounts(state),
  loading: stagerSelectors.getLoaderInfo(state),
  tableData: stagerSelectors.getTableData(state),
  selectedData: stagerSelectors.getSelectedData(state),
});

const mapDispatchToProps = dispatch => ({
  getDashboardCounts: stagerOperations.getDashboardCounts(dispatch),
  getDashboardData: stagerOperations.getDashboardData(dispatch),
  onCheckBoxClick: stagerOperations.onCheckBoxClick(dispatch),
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
  loading: PropTypes.bool,
  onCheckBoxClick: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
  tableData: PropTypes.node,
};

StagerDashboard.defaultProps = {
  counts: [],
  tableData: [],
  loading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(StagerDashboard);
