import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import {
  selectors as loginSelectors,
} from 'ducks/login';
import EvalTableCell from './EvalTableCell';
import DashboardModel from '../../../models/Dashboard';
import { operations, selectors } from '../../../state/ducks/dashboard';

class EvalTableRow extends React.PureComponent {
  handleLinkClick = (value) => {
    const {
      row, searchLoanResult, onSelectReject, user,
    } = this.props;
    const { loanNumber } = searchLoanResult;
    const payLoad = { loanNumber, ...row.original };
    if (value === 'Loan Activity') {
      const { onSelectEval } = this.props;
      onSelectEval(payLoad);
    } else if ((payLoad.statusReason !== 'Rejection Pending' && payLoad.pstatus === 'Active') || (payLoad.statusReason === 'Reject Suspend State' && payLoad.pstatus === 'Suspended')) {
      const { evalId } = payLoad;
      const userID = R.path(['userDetails', 'email'], user);
      const rejectPayload = {
        evalId,
        userID,
        eventName: 'unreject',
        loanNumber,
      };
      onSelectReject(rejectPayload);
    }
  }

  render() {
    const getRejectStyles = (row) => {
      let rejectCheck = '';
      if ((row.original.statusReason !== 'Rejection Pending' && row.original.pstatus === 'Active') || (row.original.statusReason === 'Reject Suspend State' && row.original.pstatus === 'Suspended')) {
        rejectCheck = 'primary';
      } else {
        rejectCheck = 'disabled';
      }
      return rejectCheck;
    };
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
    const { row } = this.props;
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
      case 'Reject':
        cellData = (
          <EvalTableCell
            click={() => this.handleLinkClick('Reject')}
            styleProps={getRejectStyles(row)}
            value="Reject"
          />
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
