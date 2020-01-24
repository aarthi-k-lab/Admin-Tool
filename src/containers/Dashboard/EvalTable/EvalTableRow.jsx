import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import {
  selectors as loginSelectors,
} from 'ducks/login';
import { withRouter } from 'react-router-dom';
import EvalTableCell from './EvalTableCell';
import RouteAccess from '../../../lib/RouteAccess';
import DashboardModel from '../../../models/Dashboard';
import { operations, selectors } from '../../../state/ducks/dashboard';


const showReject = row => ((row.original.pstatus === 'Active' && (row.original.pstatusReason === 'Rejection Pending' || row.original.pstatusReason === 'Trial Rejected')) || (row.original.pstatusReason === 'Reject Suspend State' && row.original.pstatus === 'Suspended'));

const getEventName = (pstatusReason, pstatus, taskName) => {
  let eventName = '';
  if ((pstatus === 'Active' && (pstatusReason === 'Rejection Pending' || pstatusReason === 'Trial Rejected')) || (pstatusReason === 'Reject Suspend State'
    && pstatus === 'Suspended' && (taskName === 'FrontEnd Review' || taskName === 'Processing'))) {
    eventName = 'unreject';
  } else if (pstatusReason === 'Reject Suspend State' && pstatus === 'Suspended' && (taskName === 'Document Generation' || taskName.startsWith('DocGenStager'))) {
    eventName = 'sendToDocGenStager';
  } else if (pstatusReason === 'Reject Suspend State' && pstatus === 'Suspended' && (taskName === 'Docs In')) {
    eventName = 'sendToDocsIn';
  }
  return eventName;
};

class EvalTableRow extends React.PureComponent {
  handleLinkClick = (value) => {
    const {
      row, searchLoanResult, onSelectReject, user, history,
    } = this.props;
    const { loanNumber } = searchLoanResult;
    const payLoad = { loanNumber, ...row.original };
    if (value === 'Loan Activity') {
      const { onSelectEval } = this.props;
      onSelectEval(payLoad);
    } else if (value === 'Booking') {
      const { onSelectEval, onGetGroupName } = this.props;
      this.redirectPath = '/special-loan';
      onGetGroupName('BOOKING');
      onSelectEval(payLoad);
      history.push(this.redirectPath);
    } else if (((payLoad.pstatus === 'Active' && (payLoad.pstatusReason === 'Rejection Pending' || payLoad.pstatusReason === 'Trial Rejected')) || (payLoad.pstatusReason === 'Reject Suspend State' && payLoad.pstatus === 'Suspended'))) {
      const { evalId } = payLoad;
      const userID = R.path(['userDetails', 'email'], user);
      const rejectPayload = {
        evalId,
        userID,
        eventName: getEventName(payLoad.pstatusReason, payLoad.pstatus, payLoad.taskName),
        loanNumber,
      };
      onSelectReject(rejectPayload);
    }
  }

  showBooking = () => {
    const { row, user } = this.props;
    const groups = user && user.groupList;
    return RouteAccess.hasSlaAccess(groups) && ((row.original.taskName === DashboardModel.PENDING_BOOKING) || (row.original.milestone === 'Post Mod' && row.original.assignee === 'In Queue'));
  }

  getStyles = () => {
    const { row, user } = this.props;
    const groups = user && user.groupList;
    let styles = '';
    if (!row.original.assignee && row.column.Header === 'ASSIGNED TO') {
      styles = 'redText pointer';
    } else if (row.original.assignee
      && (row.original.assignee === 'In Queue' && row.original.milestone === 'PostMod' && !RouteAccess.hasSlaAccess(groups))
      && (
        (row.original.assignee === 'In Queue' && !DashboardModel.ALLOW_IN_QUEUE.includes(row.original.taskName))
        || row.original.assignee === 'N/A')
    ) {
      styles = 'blackText';
    } else {
      styles = 'blackText pointer';
    }
    return styles;
  };

  getAction = (row) => {
    if (showReject(row)) {
      return (
        <EvalTableCell
          click={() => this.handleLinkClick('Un-reject')}
          styleProps={this.getStyles(row)}
          value="Un-reject"
        />
      );
    }
    if (this.showBooking()) {
      return (
        <EvalTableCell
          click={() => this.handleLinkClick('Booking')}
          styleProps={this.getStyles(row)}
          value="Booking"
        />
      );
    }
    return (<EvalTableCell styleProps={this.getStyles(row)} value={row.value} />);
  };

  render() {
    const { row } = this.props;
    let cellData = null;
    switch (row.column.Header) {
      case 'ASSIGNED TO':
        cellData = <EvalTableCell styleProps={this.getStyles(row)} value={row.value ? row.value : 'Unassigned'} />;
        break;
      case 'HISTORY':
        cellData = (
          <EvalTableCell
            click={() => this.handleLinkClick('Loan Activity')}
            styleProps={this.getStyles(row)}
            value="Loan Activity"
          />
        );
        break;
      case 'ACTIONS':
        cellData = this.getAction(row);
        break;
      default:
        cellData = <EvalTableCell styleProps={this.getStyles(row)} value={row.value} />;
    }
    return (
      <div>
        {cellData}
      </div>
    );
  }
}

EvalTableRow.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  onGetGroupName: PropTypes.func.isRequired,
  onSelectEval: PropTypes.func.isRequired,
  onSelectReject: PropTypes.func.isRequired,
  row: PropTypes.shape({
    column: PropTypes.shape({
      Header: PropTypes.string,
    }),
    original: PropTypes.shape({
      assignee: PropTypes.string,
      evalId: PropTypes.string,
      milestone: PropTypes.string,
      taskName: PropTypes.string,
    }),
    value: PropTypes.string,
  }).isRequired,
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
const mapDispatchToProps = dispatch => ({
  onSelectEval: operations.onSelectEval(dispatch),
  onSelectReject: operations.onSelectReject(dispatch),
  onGetGroupName: operations.onGetGroupName(dispatch),
});

const mapStateToProps = state => ({
  searchLoanResult: selectors.searchLoanResult(state),
  user: loginSelectors.getUser(state),

});

const EvalTableRowContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EvalTableRow);

export default withRouter(EvalTableRowContainer);
