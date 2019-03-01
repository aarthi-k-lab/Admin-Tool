import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import * as R from 'ramda';
import { Link, Redirect, withRouter } from 'react-router-dom';
import NoEvalsPage from '../NoEvalsPage';
import InvalidLoanPage from '../InvalidLoanPage';
import { EvalTableRow } from '../EvalTable';
import { operations, selectors } from '../../../state/ducks/dashboard';
import './SearchLoan.css';

class SearchLoan extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false,
    };
    this.redirectPath = '';
    this.canRedirect = false;
    this.renderSearchResults = this.renderSearchResults.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.getParamsValue = this.getParamsValue.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.validateLoanNumber = this.validateLoanNumber.bind(this);
  }


  componentDidMount() {
    const {
      onSearchLoan, evalId, enableGetNext, onAutoSave, isAssigned,
    } = this.props;
    const loanNumber = this.getParamsValue();
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
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

  getParamsValue() {
    const { location } = this.props;
    const params = location.search;
    const loanNumberSearch = new URLSearchParams(params);
    return loanNumberSearch.get('loanNumber');
  }

  handleBackButton() {
    const { onEndShift } = this.props;
    onEndShift();
  }

  handleRowClick(payload) {
    const { onSelectEval } = this.props;
    if (payload.assignee !== 'In Queue' && payload.assignee !== 'N/A') {
      onSelectEval(payload);
      this.redirectPath = payload.taskName === 'Underwriting' ? '/backend-evaluation' : '/frontend-evaluation';
      this.setState({ isRedirect: true });
    }
  }

  validateLoanNumber() {
    const { searchLoanResult } = this.props;
    const loanNumber = this.getParamsValue();
    return R.isEmpty(searchLoanResult)
      || (searchLoanResult
      && searchLoanResult.loanNumber
      && loanNumber !== searchLoanResult.loanNumber.toString());
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
        const searchResultCount = data.length;
        return (
          <div styleName="eval-table-container">
            <div styleName="eval-table-height-limiter">
              <h3 styleName="resultText">
                <span styleName="searchResutlText">{ searchResultCount }</span>
                        &nbsp;search results found for Loan &nbsp; &quot;
                <span styleName="searchResutlText">{ loanNumber }</span>
                &quot;
              </h3>
              <ReactTable
                className="-striped -highlight"
                columns={SearchLoan.COLUMN_DATA}
                data={data}
                getPaginationProps={() => ({ style: { height: '30px' } })}
                getTheadThProps={() => ({
                  style: {
                    'font-weight': 'bold', 'font-size': '10px', color: '#9E9E9E', 'text-align': 'left',
                  },
                })}
                getTrProps={(state, rowInfo) => ({
                  onClick: () => {
                    const payload = { loanNumber, ...rowInfo.original, isSearch: true };
                    this.handleRowClick(payload);
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
    return (this.canRedirect
      ? <Redirect to="/frontend-evaluation" /> : null
    );
  }

  render() {
    return (
      <>
        <span styleName="backButton"><Link onClick={this.handleBackButton} to="/frontend-evaluation">&lt; BACK</Link></span>
        { this.renderSearchResults() }
      </>
    );
  }
}

SearchLoan.COLUMN_DATA = [{
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
  Header: 'STATUS REASON',
  accessor: 'statusReason',
  maxWidth: 130,
  minWidth: 130,
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
}];


SearchLoan.defaultProps = {
  enableGetNext: false,
};

SearchLoan.propTypes = {
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAssigned: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  onSearchLoan: PropTypes.func.isRequired,
  onSelectEval: PropTypes.func.isRequired,
  searchLoanResult: PropTypes.arrayOf(PropTypes.shape({
    loanNumber: PropTypes.string.isRequired,
    valid: PropTypes.bool,
  })).isRequired,
};
const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  isAssigned: selectors.isAssigned(state),
  searchLoanResult: selectors.searchLoanResult(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  onSearchLoan: operations.onSearchLoan(dispatch),
  onSelectEval: operations.onSelectEval(dispatch),
});

const SearchLoanContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchLoan);

export default withRouter(SearchLoanContainer);
