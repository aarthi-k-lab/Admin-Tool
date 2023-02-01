import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Loader from 'components/Loader/Loader';
import Tombstone from 'containers/Dashboard/Tombstone';
import * as R from 'ramda';
import { withRouter, Link } from 'react-router-dom';
import RouteAccess from 'lib/RouteAccess';
import EndShift from 'models/EndShift';
import DashboardModel from 'models/Dashboard';
import SweetAlertBox from 'components/SweetAlertBox';
import UserNotification from 'components/UserNotification/UserNotification';
import {
  selectors as loginSelectors,
} from 'ducks/login';
import moment from 'moment-timezone';
import { selectors as widgetsSelectors, operations as widgetsOperations } from 'ducks/widgets';
import { operations as tombstoneOperations, selectors as tombstoneSelectors } from 'ducks/tombstone';
import Grid from '@material-ui/core/Grid';
import { operations as milestoneOperations } from 'ducks/milestone-activity';
import { closeWidgets } from 'components/Widgets/WidgetSelects';
import RFDContent from '../../../components/Tombstone/TombstoneComponents/RFDContent';
import CollateralContent from '../../../components/Tombstone/TombstoneComponents/CollateralContent';
import NoEvalsPage from '../NoEvalsPage';
import InvalidLoanPage from '../InvalidLoanPage';
import { EvalTableRow } from '../EvalTable';
import { operations, selectors } from '../../../state/ducks/dashboard';
import { operations as checkListOperations } from '../../../state/ducks/tasks-and-checklist';
import './SearchLoan.css';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import AdditionalInfo from '../../AdditionalInfo/AdditionalInfo';
import GoBackToSearch from '../../../components/GoBackToSearch/GoBackToSearch';
import { ADDITIONAL_INFO, HISTORY } from '../../../constants/widgets';
import MilestoneActivity from '../../LoanActivity/MilestoneActivity';
import { EDITABLE_FIELDS } from '../../../constants/loanInfoComponents';
import Popup from '../../../components/Popup';
import { CLOSED, REJECTED, ACTIVE } from '../../../constants/status';

class SearchLoan extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false,
      isOpen: false,
    };
    this.redirectPath = '';
    this.renderSearchResults = this.renderSearchResults.bind(this);
    this.renderRejectResults = this.renderRejectResults.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.getParamsValue = this.getParamsValue.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.validateLoanNumber = this.validateLoanNumber.bind(this);
    this.getLoanActivityPath = this.getLoanActivityPath.bind(this);
  }


  componentDidMount() {
    const {
      evalId, enableGetNext, onAutoSave, isAssigned, onClearStagerTaskName,
      onGetGroupName,
    } = this.props;
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
    onGetGroupName('SEARCH_LOAN');
    // onGetRFDData();
    onClearStagerTaskName();
  }

  componentDidUpdate(prevProps) {
    const { onSearchLoan } = this.props;
    const { searchLoanResult } = prevProps;
    const loanNumber = this.getParamsValue();
    const validLoanNumber = this.validateLoanNumber();
    const exisitngSearch = searchLoanResult.loanNumber
      ? loanNumber !== searchLoanResult.loanNumber.toString() : true;
    if (validLoanNumber && exisitngSearch) {
      onSearchLoan(loanNumber);
    }
  }

  getMilestoneActivityPath() {
    const { user } = this.props;
    const groups = user && user.groupList;
    return RouteAccess.hasMilestoneActivityAccess(groups) ? '/milestone-activity' : '/';
  }

  getLoanActivityPath() {
    const { user } = this.props;
    const groups = user && user.groupList;
    return RouteAccess.hasLoanActivityAccess(groups) ? '/loan-activity' : '/';
  }

  getParamsValue() {
    const { location } = this.props;
    const params = location.search;
    const loanNumberSearch = new URLSearchParams(params);
    return loanNumberSearch.get('loanNumber');
  }

  handleClose = () => {
    const { closeSweetAlert } = this.props;
    closeSweetAlert();
  }

  goToSearchResults = () => {
    const { groupName } = this.state;
    const { onGetGroupName } = this.props;
    if (groupName !== 'SEARCH_LOAN') {
      onGetGroupName('SEARCH_LOAN');
    }
    const {
      onWidgetToggle, openWidgetList, onGoBackToSearch, tombstoneData,
    } = this.props;
    onGoBackToSearch();
    const widgetsToBeClosed = {
      openWidgetList,
      page: 'SEARCH_LOAN',
      closingWidgets: [HISTORY, ADDITIONAL_INFO],
    };
    const widgetList = closeWidgets(widgetsToBeClosed);
    const payload = {
      currentWidget: '',
      openWidgetList: widgetList,
      data: tombstoneData,
    };
    onWidgetToggle(payload);
  }

  handleRowClick(payload, rowInfo) {
    const { user, checkTrialStagerButton } = this.props;
    const adGroups = user && user.groupList;
    const isPostMod = payload.milestone === 'Post Mod';
    if (payload.pstatus === 'Completed' || payload.pstatus === 'Terminated') {
      this.setState({ isOpen: true });
      return;
    }
    if (rowInfo.Header !== 'ACTIONS') {
      let group = '';
      if ((payload.assignee !== 'In Queue' || DashboardModel.ALLOW_IN_QUEUE.includes(payload.taskName) || (isPostMod && RouteAccess.hasSlaAccess(adGroups))) && payload.assignee !== 'N/A') {
        switch (payload.taskName) {
          case 'Underwriting':
            group = 'BEUW';
            this.redirectPath = '/backend-checklist';
            break;
          case 'Processing':
            group = 'PROC';
            this.redirectPath = '/doc-processor';
            break;
          case 'Trial Modification':
          case 'Forbearance':
            group = 'LA';
            checkTrialStagerButton();
            this.redirectPath = this.getLoanActivityPath();
            break;
          case 'Document Generation':
            group = 'DOCGEN';
            this.redirectPath = '/doc-gen';
            break;
          case 'Docs In':
            group = 'DOCSIN';
            this.redirectPath = '/docs-in';
            break;
          case DashboardModel.PENDING_BOOKING:
            group = 'BOOKING';
            this.redirectPath = '/special-loan';
            break;
          case 'Investor Settlement':
            group = 'INVSET';
            this.redirectPath = '/investor-settlement';
            break;
          case 'Second Look':
            group = 'SECONDLOOK';
            this.redirectPath = '/second-look';
            break;
          default:
            this.redirectPath = '/frontend-checklist';
            group = 'FEUW';
        }
      }

      if ((payload.pstatus === 'Suspended' && payload.pstatusReason === 'Approved for Doc Generation')
        || (payload.tstatus === 'Active' && payload.taskName === 'Docs Sent')) {
        this.redirectPath = '/doc-gen-back';
        group = 'DGB';
      }

      if ((payload.tstatus === 'Active' && payload.taskName === 'Pending Buyout')
        || (payload.tstatus === 'Active' && payload.taskName === DashboardModel.PENDING_BOOKING)
        || (payload.pstatus === 'Suspended' && payload.pstatusReason === 'Mod Booked')) {
        this.redirectPath = '/docs-in-back';
        group = 'DIB';
      }

      if ((
        payload.taskName === DashboardModel.PENDING_BOOKING
        || (isPostMod && !(payload.taskName === 'Investor Settlement'))
      ) && RouteAccess.hasSlaAccess(adGroups)) {
        this.redirectPath = '/special-loan';
        group = 'BOOKING';
      }

      if (!R.isEmpty(group)) {
        const {
          onSelectEval, onGetGroupName,
        } = this.props;
        onGetGroupName(group);
        onSelectEval(payload);
        this.setState({ isRedirect: true });
      }
    }
  }

  handleBackButton() {
    const { onEndShift } = this.props;
    onEndShift(EndShift.CLEAR_DASHBOARD_DATA);
  }

  validateLoanNumber() {
    const { searchLoanResult } = this.props;
    return R.isEmpty(searchLoanResult)
      || (searchLoanResult
        && searchLoanResult.loanNumber);
  }

  renderRejectResults() {
    const { getRejectResponse } = this.props;
    return !R.isEmpty(getRejectResponse) ? (
      <div styleName="notificationMsg">
        <UserNotification
          level={getRejectResponse.level}
          message={getRejectResponse.message}
          type="alert-box"
        />
      </div>
    ) : null;
  }

  renderCollateralAlert() {
    const { clearPopupData, popupData } = this.props;
    if (popupData) {
      const {
        isOpen, message, title, level,
        confirmButtonText, onConfirm,
      } = popupData;
      const confirmAction = clearPopupData;
      return (
        <Popup
          confirmButtonText={confirmButtonText}
          level={level}
          message={message}
          onConfirm={() => confirmAction(onConfirm)}
          show={isOpen}
          showConfirmButton
          title={title}
        />
      );
    }
    return null;
  }

  renderLoanInfoComponents() {
    const { checklistCenterPaneView } = this.props;
    return (
      <Grid styleName="loan-info-components">
        {checklistCenterPaneView === 'Reason for Default' ? <RFDContent /> : <CollateralContent />}
        {this.renderCollateralAlert()}
      </Grid>
    );
  }

  renderSearchResults() {
    const { searchLoanResult, history, checklistCenterPaneView } = this.props;
    const { isRedirect } = this.state;
    if (isRedirect) {
      history.push(this.redirectPath);
    }
    if (searchLoanResult.statusCode) {
      return (
        <InvalidLoanPage loanNumber={searchLoanResult.statusCode} />
      );
    }
    if (searchLoanResult.loanNumber) {
      const {
        loanNumber, unAssigned, assigned, valid,
      } = searchLoanResult;
      let data = [];
      if (valid) { // valid loan number
        if (!unAssigned && !assigned) { // no eval cases present
          return <NoEvalsPage loanNumber={loanNumber} />;
        }
        if (unAssigned) {
          data.push(...unAssigned);
        }
        if (assigned) {
          data.push(...assigned);
        }
        data = R.sort(R.descend(
          R.compose(
            Number.parseInt,
            R.prop('date'),
          ),
        ), data);
        const { inProgress } = this.props;
        if (inProgress) {
          return (
            <Loader message="Please Wait" />
          );
        }
        const activeMods = [];
        const completedMods = [];
        const evalCompletedStatus = [CLOSED, REJECTED];
        /* If the task is in active status (or)
        eval status is not Rejected or Closed and no process is present in CMOD,
        then display eval in the In Progress section
        else in completed section */
        data.forEach((mod) => {
          if (mod.pstatus === ACTIVE
            || (!mod.piid && !evalCompletedStatus.includes(mod.resolutionStatus))) {
            activeMods.push(mod);
          } else completedMods.push(mod);
        });

        return (
          <>
            <div styleName="resultText">
              <p styleName="search-text">Search result for </p>
              <p styleName="searchResutlText">{loanNumber}</p>
            </div>
            <div styleName="search-container">
              <Tombstone />
              <div styleName="eval-table-container">
                {EDITABLE_FIELDS.includes(checklistCenterPaneView) ? this.renderLoanInfoComponents()
                  : (
                    <>
                      <div styleName="eval-table-height-limiter">
                        <h3 style={{ paddingLeft: '2rem' }}> MOD HISTORY </h3>
                        <h3 style={{ paddingLeft: '2rem' }}> InProgress </h3>
                        <ReactTable
                          className="-striped -highlight"
                          columns={SearchLoan.COLUMN_DATA}
                          data={activeMods}
                          getTdProps={(state, rowInfo, column) => ({
                            onClick: (event) => {
                              const payload = { loanNumber, ...rowInfo.original, isSearch: true };
                              if (rowInfo.original.sourceLabel === 'REMEDY' || column.Header === 'HISTORY') {
                                event.stopPropagation();
                              } else {
                                this.handleRowClick(payload, column);
                              }
                            },
                            style: {
                              height: activeMods && activeMods.length > 0 ? '3rem' : '6rem',
                            },
                          })}
                          getTheadThProps={() => ({
                            style: {
                              'font-weight': 'bold', 'font-size': '10px', color: '#9E9E9E', 'text-align': 'left',
                            },
                          })}
                          minRows={1}
                          showPagination={false}
                          style={{ margin: '0rem 2rem' }}
                        />

                        <h3 style={{ paddingLeft: '2em' }}> Completed </h3>
                        <ReactTable
                          className="-striped -highlight"
                          columns={SearchLoan.COLUMN_DATA}
                          data={completedMods}
                          getTdProps={(state, rowInfo, column) => ({
                            onClick: (event) => {
                              const payload = { loanNumber, ...rowInfo.original, isSearch: true };
                              if (rowInfo.original.sourceLabel === 'REMEDY' || column.Header === 'HISTORY') {
                                event.stopPropagation();
                              } else {
                                this.handleRowClick(payload, column);
                              }
                            },
                            style: {
                              height: completedMods && completedMods.length > 0 ? '3rem' : '6rem',
                            },
                          })}
                          getTheadThProps={() => ({
                            style: {
                              'font-weight': 'bold', 'font-size': '10px', color: '#9E9E9E', 'text-align': 'left',
                            },
                          })}
                          minRows={1}
                          showPagination={false}
                          style={{ margin: '0rem 2rem' }}
                        />
                      </div>
                    </>
                  )}
              </div>
            </div>
          </>
        );
      }
      return <InvalidLoanPage loanNumber={loanNumber} />;
    }
    return null;
  }

  renderAlert = () => {
    const { resultOperation } = this.props;
    const { status, level, isOpen } = resultOperation;
    return !R.isEmpty(resultOperation) ? (
      <SweetAlertBox
        confirmButtonColor="#004261"
        message={status}
        onConfirm={() => this.handleClose()}
        show={isOpen}
        showConfirmButton
        type={level}
      />
    ) : null;
  };

  render() {
    const {
      searchLoanResult, history, location, openWidgetList,
    } = this.props;
    const { isOpen } = this.state;
    const data = [];
    const {
      loanNumber, unAssigned, assigned, valid,
    } = searchLoanResult;
    if (valid) {
      if (unAssigned) {
        data.push(...unAssigned);
      }
      if (assigned) {
        data.push(...assigned);
      }
    }

    return (
      <>
        {!R.isEmpty(searchLoanResult) && !R.contains(HISTORY, openWidgetList) && (
        <WidgetBuilder page="SEARCH_LOAN" />
        )}
        {((R.contains(ADDITIONAL_INFO, openWidgetList) && valid)
        || R.contains(HISTORY, openWidgetList)) ? (
          <GoBackToSearch
            history={history}
            loanNumber={loanNumber}
            location={location}
            onClick={this.goToSearchResults}
          />
          )
          : (
            <span styleName="backButton">
              <Link onClick={this.handleBackButton} to="/">&lt; BACK</Link>
            </span>
          )
        }
        {R.contains(ADDITIONAL_INFO, openWidgetList) && valid
        && (
        <AdditionalInfo
          data={data}
          loanNumber={loanNumber}
          styleName="evalTable"
          type="searchPage"
        />
        )}
        {R.contains(HISTORY, openWidgetList) && <MilestoneActivity inSearchPage />}
        {!(R.contains(ADDITIONAL_INFO, openWidgetList) || R.contains(HISTORY, openWidgetList)) && (
        <>
          {this.renderRejectResults()}
          {this.renderSearchResults()}
          {this.renderAlert()}
        </>
        )}
        <>
          <SweetAlertBox
            message="Unable to proceed with this eval as it is no longer active"
            onConfirm={() => { this.setState({ isOpen: false }); }}
            show={isOpen}
            type="Info"
          />
        </>
      </>
    );
  }
}

SearchLoan.COLUMN_DATA = [
  {
    Header: '',
    accessor: 'sourceLabel',
    maxWidth: 60,
    minWidth: 60,
    Cell: row => <EvalTableRow row={row} />,
  },
  {
    Header: 'ACTIONS',
    accessor: 'actions',
    maxWidth: 65,
    minWidth: 65,
    Cell: row => <EvalTableRow row={row} />,
  }, {
    Header: 'EVAL ID',
    accessor: 'evalId',
    maxWidth: 65,
    minWidth: 65,
    Cell: row => <EvalTableRow row={row} />,
  }, {
    Header: 'PROCESS ID',
    accessor: 'piid',
    maxWidth: 70,
    minWidth: 70,
    Cell: row => <EvalTableRow row={row} />,
  }, {
    Header: 'RESOLUTION ID',
    accessor: 'resolutionId',
    maxWidth: 100,
    minWidth: 100,
    Cell: row => <EvalTableRow row={row} />,
  }, {
    Header: 'RESOLUTIONCHOICETYPE',
    accessor: 'resolutionChoiceType',
    maxWidth: 180,
    minWidth: 180,
    Cell: row => <EvalTableRow row={row} />,
  }, {
    Header: 'STATUS',
    accessor: 'pstatus',
    maxWidth: 70,
    minWidth: 70,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    Header: 'PROCESS STATUS REASON',
    accessor: 'pstatusReason',
    maxWidth: 150,
    minWidth: 150,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    id: 'pstatusDate',
    Header: 'STATUS DATE',
    accessor: d => (R.isNil(d.pstatusDate) ? ''
      : moment(d.pstatusDate).format('MM/DD/YYYY hh:mm:ss A')),
    maxWidth: 180,
    minWidth: 180,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    Header: 'MILESTONE',
    accessor: 'milestone',
    maxWidth: 150,
    minWidth: 150,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    Header: 'TASK NAME',
    accessor: 'taskName',
    maxWidth: 150,
    minWidth: 150,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    Header: 'TASK STATUS',
    accessor: 'tstatus',
    maxWidth: 90,
    minWidth: 90,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    Header: 'TASK STATUS REASON',
    accessor: 'statusReason',
    maxWidth: 130,
    minWidth: 130,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    Header: 'TASK STATUS DATE',
    id: 'tstatusDate',
    accessor: d => (R.isNil(d.tstatusDate) ? ''
      : moment(d.tstatusDate).format('MM/DD/YYYY hh:mm:ss A')),
    maxWidth: 150,
    minWidth: 150,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    Header: 'ASSIGNED DATE',
    id: 'assignedDate',
    accessor: d => (R.isNil(d.assignedDate) ? ''
      : moment(d.assignedDate).format('MM/DD/YYYY hh:mm:ss A')),
    maxWidth: 150,
    minWidth: 150,
    Cell: row => <EvalTableRow row={row} />,
  }, {
    Header: 'ASSIGNED TO',
    accessor: 'assignee',
    maxWidth: 200,
    minWidth: 200,
    Cell: row => <EvalTableRow row={row} />,
  }, {
    Header: 'HISTORY',
    accessor: 'history',
    maxWidth: 80,
    minWidth: 80,
    Cell: row => <EvalTableRow row={row} />,
  },
];

SearchLoan.defaultProps = {
  enableGetNext: false,
  inProgress: false,
  resultOperation: {},
  openWidgetList: [],
  onGoBackToSearch: () => {},
  checklistCenterPaneView: 'Checklist',
  popupData: {
    confirmButtonText: 'Okay!',
  },
};

SearchLoan.propTypes = {
  checklistCenterPaneView: PropTypes.string,
  checkTrialStagerButton: PropTypes.func.isRequired,
  clearPopupData: PropTypes.func.isRequired,
  closeSweetAlert: PropTypes.func.isRequired,
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string.isRequired,
  getRejectResponse: PropTypes.shape({
    level: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  inProgress: PropTypes.bool,
  isAssigned: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onClearStagerTaskName: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  // onGetTombstoneData: PropTypes.func.isRequired,
  onGetGroupName: PropTypes.func.isRequired,
  onGoBackToSearch: PropTypes.func,
  onSearchLoan: PropTypes.func.isRequired,
  onSelectEval: PropTypes.func.isRequired,
  onWidgetToggle: PropTypes.func.isRequired,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  popupData: PropTypes.shape({
    confirmButtonText: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    message: PropTypes.string,
    onConfirm: PropTypes.func,
    title: PropTypes.string,
  }),
  resultOperation: PropTypes.shape(
    {
      isOpen: PropTypes.bool,
      level: PropTypes.string,
      status: PropTypes.string,
    },
  ),
  searchLoanResult: PropTypes.shape({
    assigned: PropTypes.arrayOf(PropTypes.shape()),
    loanNumber: PropTypes.string.isRequired,
    statusCode: PropTypes.string,
    taksId: PropTypes.string.isRequired,
    taskName: PropTypes.string.isRequired,
    unAssigned: PropTypes.arrayOf(PropTypes.shape()),
    valid: PropTypes.bool,
  }).isRequired,
  tombstoneData: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.any.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  user: PropTypes.shape({
    groupList: PropTypes.array,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  isAssigned: selectors.isAssigned(state),
  searchLoanResult: selectors.searchLoanResult(state),
  getRejectResponse: selectors.getRejectResponse(state),
  user: loginSelectors.getUser(state),
  inProgress: selectors.inProgress(state),
  resultOperation: selectors.resultOperation(state),
  tombstoneData: tombstoneSelectors.getTombstoneData(state),
  checklistCenterPaneView: tombstoneSelectors.getChecklistCenterPaneView(state),
  popupData: selectors.getPopupData(state),
});

const mapDispatchToProps = dispatch => ({
  onGetRFDData: tombstoneOperations.getRFDTableDataOperation(dispatch),
  closeSweetAlert: operations.closeSweetAlert(dispatch),
  checkTrialStagerButton: operations.checkTrialEnableStagerButtonOperation(dispatch),
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  onSearchLoan: operations.onSearchLoan(dispatch),
  onSelectEval: operations.onSelectEval(dispatch),
  onGetGroupName: operations.onGetGroupName(dispatch),
  onClearStagerTaskName: operations.onClearStagerTaskName(dispatch),
  onGetChecklistHistory: checkListOperations.fetchHistoricalChecklistData(dispatch),
  onWidgetToggle: widgetsOperations.onWidgetToggle(dispatch),
  onGoBackToSearch: milestoneOperations.goBackToSearch(dispatch),
  clearTombstoneData: tombstoneOperations.clearTombstoneDataOperation(dispatch),
  clearPopupData: operations.clearPopupData(dispatch),
});

const SearchLoanContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchLoan);

const TestHooks = {
  SearchLoan,
};

export default withRouter(SearchLoanContainer);
export { TestHooks };
