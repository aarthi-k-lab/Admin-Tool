import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import * as R from 'ramda';
import { Link } from 'react-router-dom';
import NoEvalsPage from '../NoEvalsPage';
import InvalidLoanPage from '../InvalidLoanPage';
import { EvalTableRow } from '../../../components/EvalTable';
import { operations, selectors } from '../../../state/ducks/dashboard';
import './SearchLoan.css';

class SearchLoan extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderSearchResults = this.renderSearchResults.bind(this);
    this.getParamsValue = this.getParamsValue.bind(this);
  }


  componentDidMount() {
    const {
      onSearchLoan, evalId, enableGetNext, onAutoSave,
    } = this.props;
    const loanNumber = this.getParamsValue();
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext)) {
      onAutoSave('Paused');
    }
    onSearchLoan(loanNumber);
  }

  componentDidUpdate() {
    const {
      searchLoanResult, onSearchLoan,
    } = this.props;
    const loanNumber = this.getParamsValue();
    if (searchLoanResult && searchLoanResult.loanNumber) {
      if (loanNumber !== searchLoanResult.loanNumber.toString()) {
        onSearchLoan(loanNumber);
      }
    }
  }

  getParamsValue() {
    const { location } = this.props;
    const params = location.search;
    const loanNumberSearch = new URLSearchParams(params);
    return loanNumberSearch.get('loanNumber');
  }

  renderSearchResults() {
    const { searchLoanResult } = this.props;
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
          <div>
            <h3 styleName="resultText">
              <span styleName="searchResutlText">{ searchResultCount }</span>
                      &nbsp;search results found for Loan &nbsp; &quot;
              <span styleName="searchResutlText">{ loanNumber }</span>
              &quot;
            </h3>
            <ReactTable
              className="-highlight"
              columns={SearchLoan.COLUMN_DATA}
              data={data}
              defaultPageSize={15}
              getPaginationProps={() => ({ style: { height: '30px' } })}
              getTheadThProps={() => ({ style: { 'font-weight': 'bold', 'font-size': '10px', color: '#9E9E9E' } })}
              minRows={15}
              pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
              styleName="evalTable"
            />
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
        <span styleName="backButton"><Link to="/loan-evaluation">&lt; BACK</Link></span>
        { this.renderSearchResults() }
      </>
    );
  }
}

SearchLoan.COLUMN_DATA = [{
  Header: 'EVAL ID',
  accessor: 'evalId',
  maxWidth: 150,
  Cell: row => <EvalTableRow row={row} />,
}, {
  Header: 'PROCESS ID',
  accessor: 'piid',
  maxWidth: 150,
  Cell: row => <EvalTableRow row={row} />,


}, {
  Header: 'TASK NAME',
  accessor: 'taskName',
  maxWidth: 150,
  Cell: row => <EvalTableRow row={row} />,

}, {
  Header: 'STATUS',
  accessor: 'status',
  maxWidth: 150,
  Cell: row => <EvalTableRow row={row} />,

}, {
  Header: 'STATUS DATE',
  accessor: 'statusDate',
  maxWidth: 150,
  Cell: row => <EvalTableRow row={row} />,

}, {
  Header: 'ASSIGNEE',
  accessor: 'assignee',
  maxWidth: 150,
  Cell: row => <EvalTableRow row={row} />,
}];


SearchLoan.defaultProps = {
  enableGetNext: false,
};

SearchLoan.propTypes = {
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onSearchLoan: PropTypes.func.isRequired,

  searchLoanResult: PropTypes.arrayOf(PropTypes.shape({
    loanNumber: PropTypes.string.isRequired,
    valid: PropTypes.bool,
  })).isRequired,
};
const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  searchLoanResult: selectors.searchLoanResult(state),
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onSearchLoan: operations.onSearchLoan(dispatch),

});

const SearchLoanContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchLoan);

export default SearchLoanContainer;
