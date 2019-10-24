import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RouteAccess from 'lib/RouteAccess';
import * as R from 'ramda';
import {
  selectors as loginSelectors,
} from 'ducks/login';
import EvalTableCell from './EvalTableCell';
import DashboardModel from '../../../models/Dashboard';
import { operations, selectors } from '../../../state/ducks/dashboard';


const showReject = (row, groupList) => {
  let showreject = '';
  if (((row.original.pstatusReason === 'Rejection Pending' && row.original.pstatus === 'Active') || (row.original.pstatusReason === 'Reject Suspend State' && row.original.pstatus === 'Suspended')) && RouteAccess.hasManagerDashboardAccess(groupList)) {
    showreject = true;
  } else {
    showreject = false;
  }
  return showreject;
};

const getEventName = (pstatusReason, pstatus, taskName) => {
  let eventName = '';
  if (pstatusReason === 'Rejection Pending' && pstatus === 'Active') { eventName = 'unreject'; } else if (pstatusReason === 'Reject Suspend State' && pstatus === 'Suspended' && (taskName === 'FrontEnd Review' || taskName === 'Processing')) {
    eventName = 'referral';
  } else if (pstatusReason === 'Reject Suspend State' && pstatus === 'Suspended' && (taskName === 'Document Generation')) {
    eventName = 'sendToDocGenStager';
  } else if (pstatusReason === 'Reject Suspend State' && pstatus === 'Suspended' && (taskName === 'Docs In')) {
    eventName = 'sendToDocsIn';
  }
  return eventName;
};

class EvalTableRow extends React.PureComponent {
  handleLinkClick = (value, groupList) => {
    const {
      row, searchLoanResult, onSelectReject, user,
    } = this.props;
    const { loanNumber } = searchLoanResult;
    const payLoad = { loanNumber, ...row.original };
    if (value === 'Loan Activity') {
      const { onSelectEval } = this.props;
      onSelectEval(payLoad);
    } else if (RouteAccess.hasManagerDashboardAccess(groupList) && ((payLoad.pstatusReason === 'Rejection Pending' && payLoad.pstatus === 'Active') || (payLoad.pstatusReason === 'Reject Suspend State' && payLoad.pstatus === 'Suspended'))) {
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

  render() {
    const getStyles = (row) => {
      let styles = '';
      if (!row.original.assignee && row.column.Header === 'ASSIGNED TO') {
        styles = 'redText pointer';
      } else if (row.original.assignee && ((row.original.assignee === 'In Queue' && !DashboardModel.ALLOW_IN_QUEUE.includes(row.original.taskName)) || row.original.assignee === 'N/A')) {
        styles = 'blackText';
      } else {
        styles = 'blackText pointer';
      }
      return styles;
    };
    const { row, user } = this.props;
    const displayReject = showReject(row, user.groupList);
    let cellData = null;
    switch (row.column.Header) {
      case 'ASSIGNED TO':
        cellData = <EvalTableCell styleProps={getStyles(row)} value={row.value ? row.value : 'Unassigned'} />;
        break;
      case 'ACTIONS':
        cellData = (
          <EvalTableCell
            click={() => this.handleLinkClick('Loan Activity')}
            styleProps={getStyles(row)}
            value="Loan Activity"
          />
        );
        break;
      case 'REJECT':
        cellData = (
          displayReject
            ? (
              <EvalTableCell
                click={() => this.handleLinkClick('Reject', user.groupList)}
                styleProps={getStyles(row)}
                value="Reject"
              />
            )
            : <EvalTableCell styleProps={getStyles(row)} value={row.value} />
        );
        break;
      default:
        cellData = <EvalTableCell styleProps={getStyles(row)} value={row.value} />;
    }
    return (
      <div>
        {cellData}
      </div>
    );
  }
}

EvalTableRow.propTypes = {
  onSelectEval: PropTypes.func.isRequired,
  onSelectReject: PropTypes.func.isRequired,
  row: PropTypes.shape({
    column: PropTypes.shape({
      Header: PropTypes.string,
    }),
    original: PropTypes.shape({
      evalId: PropTypes.string,
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
});

const mapStateToProps = state => ({
  searchLoanResult: selectors.searchLoanResult(state),
  user: loginSelectors.getUser(state),

});

const EvalTableRowContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EvalTableRow);

export default EvalTableRowContainer;
