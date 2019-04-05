import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import EvalTableCell from './EvalTableCell';
import { operations, selectors } from '../../../state/ducks/dashboard';

class EvalTableRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleLinkClick = this.handleLinkClick.bind(this);
  }

  handleLinkClick() {
    const { row, searchLoanResult } = this.props;
    const { loanNumber } = searchLoanResult;
    const payLoad = { loanNumber, ...row.original };
    const { onSelectEval } = this.props;
    onSelectEval(payLoad);
  }

  render() {
    const getStyles = (row) => {
      let styles = '';
      if (row.original.tstatus === 'Paused') {
        styles = 'blackText';
      } else if (!row.original.assignee && row.column.Header === 'ASSIGNED TO') {
        styles = 'redText pointer';
      } else if (row.original.assignee && (row.original.assignee === 'In Queue' || row.original.assignee === 'N/A')) {
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
            click={() => this.handleLinkClick()}
            styleProps={getStyles(row)}
            value="Loan Activity"
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
  row: PropTypes.arrayOf(PropTypes.shape({
    evalId: PropTypes.string.isRequired,
  })).isRequired,
  searchLoanResult: PropTypes.arrayOf(PropTypes.shape({
    loanNumber: PropTypes.string.isRequired,
    valid: PropTypes.bool,
  })).isRequired,
};
const mapDispatchToProps = dispatch => ({
  onSelectEval: operations.onSelectEval(dispatch),
});

const mapStateToProps = state => ({
  searchLoanResult: selectors.searchLoanResult(state),
});

const EvalTableRowContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EvalTableRow);

export default EvalTableRowContainer;
