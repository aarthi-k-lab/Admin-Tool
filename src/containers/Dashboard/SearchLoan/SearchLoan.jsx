import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Loader from 'components/Loader/Loader';
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
import NoEvalsPage from '../NoEvalsPage';
import InvalidLoanPage from '../InvalidLoanPage';
import { EvalTableRow } from '../EvalTable';
import { operations, selectors } from '../../../state/ducks/dashboard';
import { operations as checkListOperations } from '../../../state/ducks/tasks-and-checklist';
import './SearchLoan.css';
import WidgetBuilder from '../../../components/Widgets/WidgetBuilder';
import AdditionalInfo from '../../AdditionalInfo/AdditionalInfo';
import GoBackToSearch from '../../../components/GoBackToSearch/GoBackToSearch';
import widgets from '../../../constants/widget';
import MilestoneActivity from '../../LoanActivity/MilestoneActivity';


class SearchLoan extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false,
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
    } = this.props;
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
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
    const { onAdditionalInfoSelect, onHistorySelect } = this.props;
    onAdditionalInfoSelect(false);
    onHistorySelect(false);
  }

  handleAIChange = (value, widgetId) => {
    const {
      onAdditionalInfoSelect, isAdditionalInfoOpen, onAdditionalInfo, searchLoanResult,
    } = this.props;
    const { loanNumber } = searchLoanResult;
    if (R.equals(widgetId, widgets.additionalInfo)) {
      onAdditionalInfoSelect(!isAdditionalInfoOpen);
      if (!isAdditionalInfoOpen) onAdditionalInfo(loanNumber);
    }
  }

  handleRowClick(payload, rowInfo) {
    const { user } = this.props;
    const adGroups = user && user.groupList;
    const isPostMod = payload.milestone === 'Post Mod';
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
        || isPostMod
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

  renderSearchResults() {
    const { searchLoanResult, history } = this.props;
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
            R.prop('evalId'),
          ),
        ), data);
        const { inProgress } = this.props;
        if (inProgress) {
          return (
            <Loader message="Please Wait" />
          );
        }
        const searchResultCount = data.length;
        return (
          <div styleName="eval-table-container">
            <div styleName="eval-table-height-limiter">
              <h3 styleName="resultText">
                <span styleName="searchResutlText">{searchResultCount}</span>
                &nbsp;search results found for Loan &nbsp; &quot;
                <span styleName="searchResutlText">{loanNumber}</span>
                &quot;
              </h3>
              <ReactTable
                className="-striped -highlight"
                columns={SearchLoan.COLUMN_DATA}
                data={data}
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
                    height: '3rem',
                  },
                })}
                getTheadThProps={() => ({
                  style: {
                    'font-weight': 'bold', 'font-size': '10px', color: '#9E9E9E', 'text-align': 'left',
                  },
                })}
                minRows={20}
                style={{ marginRight: '4rem', overflow: 'hidden' }}
              />
            </div>
          </div>
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
      searchLoanResult, history, location, isAdditionalInfoOpen, isHistoryOpen,
    } = this.props;
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
        {!R.isEmpty(searchLoanResult) && !isHistoryOpen && <WidgetBuilder inSearchPage triggerAI={this.handleAIChange} type="search" />}
        {((isAdditionalInfoOpen && valid) || isHistoryOpen) ? (
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
        {isAdditionalInfoOpen && valid && <AdditionalInfo data={data} loanNumber={loanNumber} styleName="evalTable" type="searchPage" />}
        {isHistoryOpen && <MilestoneActivity inSearchPage />}
        {!(isAdditionalInfoOpen || isHistoryOpen) && (
        <>
          {this.renderRejectResults()}
          {this.renderSearchResults()}
          {this.renderAlert()}
        </>
        )}
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
    maxWidth: 70,
    minWidth: 70,
    Cell: row => <EvalTableRow row={row} />,
  }, {
    Header: 'RESOLUTIONCHOICETYPE',
    accessor: 'resolutionChoiceType',
    maxWidth: 150,
    minWidth: 150,
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
    Header: 'STATUS DATE',
    accessor: 'pstatusDate',
    maxWidth: 110,
    minWidth: 110,
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
    accessor: 'tstatusDate',
    maxWidth: 110,
    minWidth: 110,
    Cell: row => <EvalTableRow row={row} />,

  }, {
    Header: 'ASSIGNED DATE',
    accessor: 'assignedDate',
    maxWidth: 110,
    minWidth: 110,
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
  isHistoryOpen: false,
  isAdditionalInfoOpen: false,
};

SearchLoan.propTypes = {
  closeSweetAlert: PropTypes.func.isRequired,
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string.isRequired,
  getRejectResponse: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string.isRequired,
  })).isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  inProgress: PropTypes.bool,
  isAdditionalInfoOpen: PropTypes.bool,
  isAssigned: PropTypes.bool.isRequired,
  isHistoryOpen: PropTypes.bool,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  onAdditionalInfo: PropTypes.func.isRequired,
  onAdditionalInfoSelect: PropTypes.func.isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onClearStagerTaskName: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  onGetGroupName: PropTypes.func.isRequired,
  onHistorySelect: PropTypes.func.isRequired,
  onSearchLoan: PropTypes.func.isRequired,
  onSelectEval: PropTypes.func.isRequired,
  resultOperation: PropTypes.shape(
    {
      isOpen: PropTypes.bool,
      level: PropTypes.string,
      status: PropTypes.string,
    },
  ),
  searchLoanResult: PropTypes.arrayOf(PropTypes.shape({
    loanNumber: PropTypes.string.isRequired,
    valid: PropTypes.bool,
  })).isRequired,
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
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  isAssigned: selectors.isAssigned(state),
  searchLoanResult: selectors.searchLoanResult(state),
  getRejectResponse: selectors.getRejectResponse(state),
  user: loginSelectors.getUser(state),
  inProgress: selectors.inProgress(state),
  resultOperation: selectors.resultOperation(state),
  isAdditionalInfoOpen: selectors.isAdditionalInfoOpen(state),
  isHistoryOpen: selectors.isHistoryOpen(state),
});

const mapDispatchToProps = dispatch => ({
  closeSweetAlert: operations.closeSweetAlert(dispatch),
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  onSearchLoan: operations.onSearchLoan(dispatch),
  onSelectEval: operations.onSelectEval(dispatch),
  onGetGroupName: operations.onGetGroupName(dispatch),
  onClearStagerTaskName: operations.onClearStagerTaskName(dispatch),
  onGetChecklistHistory: checkListOperations.fetchHistoricalChecklistData(dispatch),
  onAdditionalInfo: operations.onAdditionalInfoClick(dispatch),
  onAdditionalInfoSelect: operations.onAdditionalInfoSelect(dispatch),
  onHistorySelect: operations.onHistorySelect(dispatch),
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
