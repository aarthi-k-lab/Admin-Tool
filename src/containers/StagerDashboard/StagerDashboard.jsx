import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import CustomSnackBar from 'components/CustomSnackBar';
import * as R from 'ramda';
import RouteAccess from 'lib/RouteAccess';
import DashboardModel from 'models/Dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import { selectors as notificationSelectors, operations as notificationOperations } from 'ducks/notifications';
import moment from 'moment';
import StagerPage from './StagerPage';

class StagerDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSearchTerm: '',
      stager: 'STAGER_ALL',
    };
  }

  componentDidMount() {
    const { getDashboardCounts, triggerStagerValue, triggerStartEndDate } = this.props;
    const { stager } = this.state;
    const datePayload = this.getDatePayload();
    triggerStartEndDate(datePayload);
    triggerStagerValue(stager);
    getDashboardCounts();
  }

  onOrderClick(data, searchTerm) {
    const { triggerOrderCall, user } = this.props;
    const userPrincipalName = user.userDetails.email;
    const endPoint = R.contains('Reclass', searchTerm) ? 'reclass' : 'valuation';
    const orderPayload = R.map(dataUnit => ({
      evalId: dataUnit['Eval ID'] && dataUnit['Eval ID'].toString(),
      taskId: dataUnit.TKIID && dataUnit.TKIID.toString(),
    }), data);
    const payload = {
      taskData: orderPayload,
      userPrincipalName,
    };
    triggerOrderCall(payload, endPoint);
  }

  onStatusCardClick(activeTile, activeTab) {
    const value = `${activeTile}${activeTab}`;
    const searchTerm = value.replace(/ /g, '');
    const {
      getDashboardData,
      onCheckBoxClick,
      getDashboardCounts,
      onClearDocGenAction,
      onClearSearchResponse,
      getStagerSearchResponse,
    } = this.props;
    onClearDocGenAction();
    if (getStagerSearchResponse && !R.isEmpty(getStagerSearchResponse)
      && !getStagerSearchResponse.error && !getStagerSearchResponse.noContents) {
      const stagerValues = getStagerSearchResponse[activeTab] ? getStagerSearchResponse[activeTab].split(',') : [];
      if (stagerValues.indexOf(activeTile) === -1) {
        onClearSearchResponse();
      }
    }
    this.setState({ activeTab, activeTile, activeSearchTerm: searchTerm });
    const { stager } = this.state;
    const payload = {
      activeSearchTerm: searchTerm,
      stager,
    };
    getDashboardData(payload);
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
    const stagerValue = DashboardModel.STAGER_VALUE;
    const {
      getDashboardCounts,
      onCheckBoxClick, triggerStagerValue,
      triggerStartEndDate, onClearStagerResponse, onClearSearchResponse,
    } = this.props;
    this.setState({
      activeSearchTerm: '',
      stager: stagerValue[stager],
      activeTile: '',
      activeTab: '',
    });
    const datePayload = this.getDatePayload();
    triggerStartEndDate(datePayload);
    triggerStagerValue(stagerValue[stager]);
    getDashboardCounts();
    onClearStagerResponse();
    onClearSearchResponse();
    onCheckBoxClick([]);
  }

  // eslint-disable-next-line class-methods-use-this
  getDatePayload() {
    const now = new Date();
    const CurrentDate = moment().startOf('month').format('DD');
    const start = moment(new Date(now.getFullYear(), now.getMonth(), CurrentDate, 0, 0, 0, 0));
    const end = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0));
    const payload = {
      fromDate: start.format('YYYY-MM-DD HH:mm:ss'),
      toDate: end.format('YYYY-MM-DD HH:mm:ss'),
    };
    return payload;
  }

  refreshDashboard() {
    const { activeSearchTerm, stager } = this.state;
    const {
      getDashboardData, getDashboardCounts,
      onCheckBoxClick, onClearDocGenAction,
      onClearStagerResponse, onClearSearchResponse,
      triggerStartEndDate, triggerStagerValue,
    } = this.props;
    const payload = {
      activeSearchTerm,
      stager,
    };
    if (activeSearchTerm) {
      getDashboardData(payload);
    }
    const datePayload = this.getDatePayload();
    const stagerValue = DashboardModel.STAGER_VALUE;
    onClearStagerResponse();
    onClearSearchResponse();
    triggerStartEndDate(datePayload);
    triggerStagerValue(stagerValue[stager]);
    getDashboardCounts();
    onCheckBoxClick([]);
    onClearDocGenAction();
  }

  renderSnackBar() {
    const { snackBarData, closeSnackBar } = this.props;
    return (
      <CustomSnackBar
        message={snackBarData && snackBarData.message}
        onClose={closeSnackBar}
        open={snackBarData && snackBarData.open}
        type={snackBarData && snackBarData.type}
      />
    );
  }

  render() {
    const { groups } = this.props;
    if (!RouteAccess.hasStagerDashboardAccess(groups)) {
      return <Redirect to="/unauthorized?error=STAGER_DASHBOARD_ACCESS_NEEDED" />;
    }
    const {
      counts, tableData,
      loading, selectedData, docGenResponse,
    } = this.props;
    const {
      activeTab, activeTile, stager,
    } = this.state;

    return (
      <>
        {this.renderSnackBar()}
        <StagerPage
          activeTab={activeTab}
          activeTile={activeTile}
          counts={counts}
          loading={loading}
          onCheckBoxClick={(isChecked, data) => this.onCheckBoxClick(isChecked, data)}
          onOrderClick={(data, searchTerm) => this.onOrderClick(data, searchTerm)}
          onSelectAll={(isChecked, data) => this.onSelectAll(isChecked, data)}
          onStagerChange={stagerValue => this.onStagerChange(stagerValue)}
          onStatusCardClick={
            (tileName,
              tabName, totalCount) => this.onStatusCardClick(tileName, tabName, totalCount)
          }
          popupData={docGenResponse}
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
  docGenResponse: stagerSelectors.getdocGenResponse(state),
  snackBarData: notificationSelectors.getSnackBarState(state),
  getStagerSearchResponse: stagerSelectors.getStagerSearchResponse(state),
  user: loginSelectors.getUser(state),
});

const mapDispatchToProps = dispatch => ({
  getDashboardCounts: stagerOperations.getDashboardCounts(dispatch),
  getDashboardData: stagerOperations.getDashboardData(dispatch),
  onCheckBoxClick: stagerOperations.onCheckBoxClick(dispatch),
  triggerOrderCall: stagerOperations.triggerOrderCall(dispatch),
  triggerStagerValue: stagerOperations.triggerStagerValue(dispatch),
  onClearDocGenAction: stagerOperations.onClearDocGenAction(dispatch),
  onClearSearchResponse: stagerOperations.onClearSearchResponse(dispatch),
  triggerStartEndDate: stagerOperations.triggerStartEndDate(dispatch),
  closeSnackBar: notificationOperations.closeSnackBar(dispatch),
  onClearStagerResponse: stagerOperations.onClearStagerResponse(dispatch),

});

StagerDashboard.propTypes = {
  closeSnackBar: PropTypes.func,
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
  docGenResponse: PropTypes.arrayOf(
    PropTypes.shape({
      hitLoans: PropTypes.array.isRequired,
      missedLoans: PropTypes.array.isRequired,
    }),
  ),
  getDashboardCounts: PropTypes.func.isRequired,
  getDashboardData: PropTypes.func.isRequired,
  getStagerSearchResponse: PropTypes.node.isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool,
  onCheckBoxClick: PropTypes.func.isRequired,
  onClearDocGenAction: PropTypes.func.isRequired,
  onClearSearchResponse: PropTypes.func.isRequired,
  onClearStagerResponse: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
  snackBarData: PropTypes.node,
  tableData: PropTypes.node,
  triggerOrderCall: PropTypes.func.isRequired,
  triggerStagerValue: PropTypes.func.isRequired,
  triggerStartEndDate: PropTypes.func.isRequired,
  user: PropTypes.shape({
    skills: PropTypes.objectOf(PropTypes.string).isRequired,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
};

StagerDashboard.defaultProps = {
  counts: [],
  tableData: [],
  snackBarData: null,
  loading: false,
  closeSnackBar: () => { },
  docGenResponse: {},
};

const TestExports = {
  StagerDashboard,
};

export default connect(mapStateToProps, mapDispatchToProps)(StagerDashboard);

export { TestExports };
