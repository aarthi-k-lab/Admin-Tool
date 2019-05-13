import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import * as R from 'ramda';
import CustomSnackBar from 'components/CustomSnackBar';
import RouteAccess from 'lib/RouteAccess';
import StagerPage from './StagerPage';


class StagerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSearchTerm: '',
      stager: 'UNDERWRITER STAGER',
    };
  }

  componentDidMount() {
    const { getDashboardCounts } = this.props;
    const { stager } = this.state;
    getDashboardCounts(stager);
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
    const { stager } = this.state;
    const payload = {
      activeSearchTerm: searchTerm,
      stager,
    };
    getDashboardData(payload);
    getDashboardCounts(stager);
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

  onSelectAll(isChecked, data) {
    const { onCheckBoxClick, selectedData } = this.props;
    let selectedDataCopy = [...selectedData];
    if (isChecked) {
      selectedDataCopy = data;
    } else if (!isChecked) {
      selectedDataCopy = [];
    }
    onCheckBoxClick(selectedDataCopy);
  }


  onStagerChange(stager) {
    const { getDashboardData, getDashboardCounts, onCheckBoxClick } = this.props;
    this.setState({
      activeSearchTerm: '',
      stager,
      activeTile: '',
      activeTab: '',
    });
    const payload = {
      activeSearchTerm: '',
      stager,
    };
    getDashboardCounts(stager);
    getDashboardData(payload);
    onCheckBoxClick([]);
  }

  refreshDashboard() {
    const { activeSearchTerm, stager } = this.state;
    const { getDashboardData, getDashboardCounts, onCheckBoxClick } = this.props;
    const payload = {
      activeSearchTerm,
      stager,
    };
    if (activeSearchTerm) {
      getDashboardData(payload);
    }
    getDashboardCounts(stager);
    onCheckBoxClick([]);
  }


  render() {
    const { groups } = this.props;
    if (!RouteAccess.hasStagerDashboardAccess(groups)) {
      return <Redirect to="/unauthorized?error=STAGER_DASHBOARD_ACCESS_NEEDED" />;
    }
    const {
      closeSnackBar, counts, tableData, downloadCSVUri,
      loading, snackBarData, selectedData, docsOutResponse,
    } = this.props;
    const {
      activeTab, activeTile, stager,
    } = this.state;
    return (
      <>
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
          downloadCSVUri={downloadCSVUri}
          loading={loading}
          onCheckBoxClick={(isChecked, data) => this.onCheckBoxClick(isChecked, data)}
          onOrderClick={data => this.onOrderClick(data)}
          onSelectAll={(isChecked, data) => this.onSelectAll(isChecked, data)}
          onStagerChange={stagerValue => this.onStagerChange(stagerValue)}
          onStatusCardClick={
            (searchTerm,
              tileName,
              tabName) => this.onStatusCardClick(searchTerm, tileName, tabName)
          }
          popupData={docsOutResponse}
          refreshDashboard={() => this.refreshDashboard()}
          selectedData={selectedData}
          stager={stager}
          tableData={tableData}
        />
      </>
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
  docsOutResponse: stagerSelectors.getDocsOutResponse(state),
  downloadCSVUri: stagerSelectors.getDownloadCSVUri(state),
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
  docsOutResponse: PropTypes.arrayOf(
    PropTypes.shape({
      error: PropTypes.bool,
    }),
  ),
  downloadCSVUri: PropTypes.string,
  getDashboardCounts: PropTypes.func.isRequired,
  getDashboardData: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  downloadCSVUri: '',
  docsOutResponse: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(StagerDashboard);
