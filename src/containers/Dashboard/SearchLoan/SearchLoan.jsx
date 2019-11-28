import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Loader from 'components/Loader/Loader';
import * as R from 'ramda';
import { Link, withRouter } from 'react-router-dom';
import RouteAccess from 'lib/RouteAccess';
import EndShift from 'models/EndShift';
import DashboardModel from 'models/Dashboard';
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
      onSearchLoan, evalId, enableGetNext, onAutoSave, isAssigned, onClearStagerTaskName,
    } = this.props;
    const loanNumber = this.getParamsValue();
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
    onClearStagerTaskName();
    onSearchLoan(loanNumber);
  }

  componentDidUpdate() {
    const { onSearchLoan } = this.props;
    const loanNumber = this.getParamsValue();
    const validLoanNumber = this.validateLoanNumber();
    if (validLoanNumber) {
      onSearchLoan(loanNumber);
    }
    this.canRedirect = true;
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

  getGroups() {
    const { user } = this.props;
    return user && user.groupList;
  }

  handleBackButton() {
    const { onEndShift } = this.props;
    onEndShift(EndShift.CLEAR_DASHBOARD_DATA);
  }

  handleRowClick(payload, rowInfo) {
    if (rowInfo.Header !== 'ACTIONS') {
      if ((payload.assignee !== 'In Queue' || DashboardModel.ALLOW_IN_QUEUE.includes(payload.taskName)) && payload.assignee !== 'N/A') {
        const { onSelectEval, onGetGroupName, onGetChecklistHistory } = this.props;
        let group = '';
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
          default:
            this.redirectPath = '/frontend-checklist';
            group = 'FEUW';
        }
        onGetGroupName(group);
        onSelectEval(payload);
        onGetChecklistHistory(payload.taskId);
        this.setState({ isRedirect: true });
      }

      if ((payload.pstatus === 'Suspended' && payload.pstatusReason === 'Approved for Doc Generation')
        || (payload.tstatus === 'Active' && payload.taskName === 'Docs Sent')) {
        const { onSelectEval, onGetGroupName } = this.props;
        this.redirectPath = '/doc-gen-back';
        onGetGroupName('DGB');
        onSelectEval(payload);
        this.setState({ isRedirect: true });
      }

      if ((payload.tstatus === 'Active' && payload.taskName === 'Pending Buyout')
        || (payload.tstatus === 'Active' && payload.taskName === 'Pending Booking')
        || (payload.pstatus === 'Suspended' && payload.pstatusReason === 'Mod Booked')) {
        const { onSelectEval, onGetGroupName } = this.props;
        this.redirectPath = '/docs-in-back';
        onGetGroupName('DIB');
        onSelectEval(payload);
        this.setState({ isRedirect: true });
      }
    }
  }

  validateLoanNumber() {
    const { searchLoanResult } = this.props;
    // const loanNumber = this.getParamsValue();
    return R.isEmpty(searchLoanResult)
      || (searchLoanResult
        && searchLoanResult.loanNumber);
    // && loanNumber !== searchLoanResult.loanNumber.toString()
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
      const data = [];
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
                getPaginationProps={() => ({ style: { height: '30px' } })}
                getTdProps={(state, rowInfo, column) => ({
                  onClick: () => {
                    const payload = { loanNumber, ...rowInfo.original, isSearch: true };
                    this.handleRowClick(payload, column);
                  },
                })}
                getTheadThProps={() => ({
                  style: {
                    'font-weight': 'bold', 'font-size': '10px', color: '#9E9E9E', 'text-align': 'left',
                  },
                })}
                minRows={20}
                styleName="evalTable"
              />
            </div>
          </div>
        );
      }
      return <InvalidLoanPage loanNumber={loanNumber} />;
    }
    return null;
  }

  render() {
    return (
      <>
        <span styleName="backButton"><Link onClick={this.handleBackButton} to="/">&lt; BACK</Link></span>
        {this.renderRejectResults()}
        {this.renderSearchResults()}
      </>
    );
  }
}

SearchLoan.COLUMN_DATA = [
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
  },
];


SearchLoan.defaultProps = {
  enableGetNext: false,
  inProgress: false,
};

SearchLoan.propTypes = {
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string.isRequired,
  getRejectResponse: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string.isRequired,
  })).isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  inProgress: PropTypes.bool,
  isAssigned: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onClearStagerTaskName: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  onGetChecklistHistory: PropTypes.func.isRequired,
  onGetGroupName: PropTypes.func.isRequired,
  onSearchLoan: PropTypes.func.isRequired,
  onSelectEval: PropTypes.func.isRequired,
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
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  onSearchLoan: operations.onSearchLoan(dispatch),
  onSelectEval: operations.onSelectEval(dispatch),
  onGetGroupName: operations.onGetGroupName(dispatch),
  onClearStagerTaskName: operations.onClearStagerTaskName(dispatch),
  onGetChecklistHistory: checkListOperations.fetchHistoricalChecklistData(dispatch),
});

const SearchLoanContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchLoan);

export default withRouter(SearchLoanContainer);
