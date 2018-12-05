import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import * as R from 'ramda';
import CustomSnackBar from 'components/CustomSnackBar';
import StagerPage from './StagerPage';

class StagerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeSearchTerm: '' };
  }

  componentDidMount() {
    const { getDashboardCounts } = this.props;
    getDashboardCounts();
  }

  onOrderClick(data) {
    const { triggerOrderCall } = this.props;
    const orderPayload = R.map(dataUnit => ({
      evalId: dataUnit['Eval ID'] && dataUnit['Eval ID'].toString(),
      taskId: dataUnit.TKIID && dataUnit.TKIID.toString(),
    }), data);
    triggerOrderCall(orderPayload);
  }

  onStatusCardClick(searchTerm, activeTile, activeTab) {
    const { getDashboardData, onCheckBoxClick, getDashboardCounts } = this.props;
    this.setState({ activeTab, activeTile, activeSearchTerm: searchTerm });
    getDashboardData(searchTerm);
    getDashboardCounts();
    onCheckBoxClick([]);
  }

  onCheckBoxClick(isChecked, data) {
    const { onCheckBoxClick, selectedData } = this.props;
    const foundData = selectedData.find(obj => data.TKIID === obj.TKIID);
    const selectedDataCopy = [...selectedData];
    if (isChecked && !foundData) {
      selectedDataCopy.push(data);
    } else if (!isChecked && foundData) {
      selectedDataCopy.splice(selectedDataCopy.findIndex(i => i.TKIID === data.TKIID), 1);
    }
    onCheckBoxClick(selectedDataCopy);
  }

  refreshDashboard() {
    const { activeSearchTerm } = this.state;
    const { getDashboardData, getDashboardCounts, onCheckBoxClick } = this.props;
    if (activeSearchTerm) {
      getDashboardData(activeSearchTerm);
    }
    getDashboardCounts();
    onCheckBoxClick([]);
  }

  render() {
    const {
      closeSnackBar, counts, tableData,
      loading, snackBarData, selectedData,
    } = this.props;
    const {
      activeTab, activeTile,
    } = this.state;
    return (
      <div>
        <CustomSnackBar
          message={snackBarData && snackBarData.message}
          onClose={closeSnackBar}
          open={snackBarData && snackBarData.open}
          type={snackBarData && snackBarData.type}
        />
        <StagerPage
          activeTab={activeTab}
          activeTile={activeTile}
          counts={counts}
          loading={loading}
          onCheckBoxClick={(isChecked, data) => this.onCheckBoxClick(isChecked, data)}
          onOrderClick={data => this.onOrderClick(data)}
          onStatusCardClick={
            (searchTerm,
              tileName,
              tabName) => this.onStatusCardClick(searchTerm, tileName, tabName)
          }
          refreshDashboard={() => this.refreshDashboard()}
          selectedData={selectedData}
          tableData={tableData}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
  counts: stagerSelectors.getCounts(state),
  loading: stagerSelectors.getLoaderInfo(state),
  tableData: stagerSelectors.getTableData(state),
  selectedData: stagerSelectors.getSelectedData(state),
  snackBarData: notificationSelectors.getSnackBarState(state),
});

const mapDispatchToProps = dispatch => ({
  getDashboardCounts: stagerOperations.getDashboardCounts(dispatch),
  getDashboardData: stagerOperations.getDashboardData(dispatch),
  onCheckBoxClick: stagerOperations.onCheckBoxClick(dispatch),
  triggerOrderCall: stagerOperations.triggerOrderCall(dispatch),
  closeSnackBar: notificationOperations.closeSnackBar(dispatch),
});

StagerDashboard.propTypes = {
  closeSnackBar: PropTypes.func.isRequired,
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
  snackBarData: PropTypes.node.isRequired,
  tableData: PropTypes.node,
  triggerOrderCall: PropTypes.func.isRequired,
};

StagerDashboard.defaultProps = {
  counts: [],
  tableData: [],
  loading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(StagerDashboard);
