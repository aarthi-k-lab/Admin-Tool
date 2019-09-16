import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextareaAutosize';
import { CSVLink } from 'react-csv';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import ReactTable from 'react-table';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import Loader from 'components/Loader/Loader';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { selectors, operations } from 'ducks/dashboard';
import PropTypes from 'prop-types';
import UserNotification from '../../../components/UserNotification/UserNotification';
import './DocsIn.css';

const validLoanEntries = RegExp(/[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/);
const validateLoanFormat = (loansNumber) => {
  let isValid = true;
  // eslint-disable-next-line
  if (validLoanEntries.test(loansNumber)){
    isValid = false;
  }
  return isValid;
};
class DocsIn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      hasError: false,
      loansNumber: '',
      // loanNumbersCount: 0,
      isDisabled: 'disabled',
    };
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleloansSubmit = this.handleloansSubmit.bind(this);
  }

  onDownloadCSV() {
    this.csvLink.link.click();
  }

  getMessage() {
    const { hasError } = this.state;
    const { tableData } = this.props;
    if (hasError) {
      return 'We are experiencing some issues. Please try after some time.';
    }
    let countLoan = 0;
    let loanNum = 0;
    // eslint-disable-next-line no-unused-expressions
    tableData && tableData.forEach((item) => {
      if (loanNum !== item.loanNumber) {
        countLoan += item.statusMessage === 'Successfully' ? 1 : 0;
        loanNum = item.loanNumber;
      }
    });
    return `${countLoan} loans have been processed.`;
  }

  handleBackButton() {
    const { history } = this.props;
    history.push('/docs-in');
  }

  handleChange(event) {
    const { onFailedLoanValidation } = this.props;
    this.setState({
      loansNumber: event.target.value,
      isDisabled: (event.target.value.trim() ? '' : 'disabled'),
    });
    const payload = {};
    onFailedLoanValidation(payload);
  }

  handleloansSubmit() {
    const { loansNumber } = this.state;
    const { onLoansSubmit } = this.props;
    const { onFailedLoanValidation } = this.props;
    if (validateLoanFormat(loansNumber)) {
      const loanNumbersList = loansNumber.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
      onLoansSubmit(loanNumbersList);
    } else {
      const payload = {
        level: 'error',
        status: 'Please enter loan number(s) in correct format. Only comma and newline separated loan numbers are accepted',
      };
      onFailedLoanValidation(payload);
    }
  }

  render() {
    const { inProgress } = this.props;
    const title = '';
    const { resultOperation } = this.props;
    const { loansNumber, isDisabled } = this.state;
    const { tableData } = this.props;
    if (inProgress) {
      return (
        <Loader message="Please Wait" />
      );
    }
    return (
      <>
        <ContentHeader title={title}>
          <Grid container style={{ height: '3rem' }} xs={12}>
            <Grid item xs={1}>
              <div styleName="backButton"><Link onClick={this.handleBackButton} to="/docs-in">&lt; BACK</Link></div>
            </Grid>
            <Grid item xs={10}>
              <div style={{ paddingTop: '0.1rem', paddingBottom: '0' }} styleName="title-row">
                {(resultOperation && resultOperation.status)
                  ? <UserNotification level={resultOperation.level} message={resultOperation.status} type="alert-box" />
                  : ''
                }
              </div>
            </Grid>
            <Grid item style={{ textAlign: 'right', paddingRight: '1rem', paddingTop: '0.3rem' }} xs={1}>
              {(tableData && tableData.length > 0) && (
                <Button color="primary" onClick={() => this.onDownloadCSV()} variant="contained">
                  <DownloadIcon styleName="download-icon" />
                  <CSVLink
                    // eslint-disable-next-line no-return-assign
                    ref={event => this.csvLink = event}
                    data={tableData}
                    filename="docs-in.csv"
                    onClick={event => event.stopPropagation()}
                    style={{ color: 'white' }}
                  >
                    Download
                  </CSVLink>
                </Button>
              )}
            </Grid>
          </Grid>
          <Controls />
        </ContentHeader>
        <Grid container style={{ paddingTop: '0.5rem' }}>
          <Grid item xs={6}>
            <span styleName="loan-numbers">Enter Loan Numbers</span>
          </Grid>
          <Grid item xs={5}>
            <span styleName="docsin-message">
              {this.getMessage()}
            </span>
          </Grid>
        </Grid>
        <Grid container styleName="loan-activity">
          <Grid container item styleName="status-details-parent" xs={2}>
            <div styleName="status-details">
              <TextField
                id="loanNumbers"
                margin="normal"
                multiline
                onChange={this.handleChange}
                style={{ height: '98%', width: '99%' }}
                value={loansNumber}
              />
            </div>
            <div styleName="interactive-button">
              <Button
                className="material-ui-button"
                color="primary"
                disabled={isDisabled}
                margin="normal"
                onClick={this.handleloansSubmit}
                variant="contained"
              >
                Docs Received
              </Button>
            </div>
          </Grid>
          {/* {(tasks && tasks.length > 0) && ( */}
          <Grid container direction="column" style={{ paddingLeft: '1rem' }} xs={10}>
            <div styleName="docsin-table-container">
              <div styleName="docsin-height-limiter">
                {/* {(tableData && tableData.length > 0) && ( */}
                <ReactTable
                  className="-striped -highlight"
                  columns={[
                    {
                      Header: 'LOAN NUMBER', accessor: 'loanNumber', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
                    },
                    {
                      Header: 'PID', accessor: 'pid', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
                    },
                    {
                      Header: 'EVAL ID', accessor: 'evalId', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
                    },
                    {
                      Header: 'STATUS', accessor: 'statusMessage', minWidth: 700, maxWidth: 1000, style: { width: '54%' }, headerStyle: { textAlign: 'left' },
                    },
                  ]}
                  data={tableData || []}
                  defaultPageSize={100}
                  /* eslint-disable-next-line */
                  getTrProps={(state, rowInfo, column) => {
                    return {
                      /* eslint-disable-next-line */
                      style: { background: !rowInfo ? '' : (rowInfo.row.status === 'Success' ? '' : '#ffe1e1') },
                    };
                  }}
                  pageSizeOptions={[10, 20, 25, 50, 100]}
                  styleName="docsin-table"
                />
                {/* )} */}
              </div>
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
}

DocsIn.defaultProps = {
  inProgress: false,
  resultOperation: { level: '', status: '' },
  onLoansSubmit: () => {},
  onFailedLoanValidation: () => {},
  tableData: [
    {
      loanNumber: '', pid: 0, evalId: 0, statusMessage: '',
    },
  ],
};

DocsIn.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  inProgress: PropTypes.bool,
  onFailedLoanValidation: PropTypes.func,
  onLoansSubmit: PropTypes.func,
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      evalId: PropTypes.string,
      loanNumber: PropTypes.string,
      pid: PropTypes.string,
      statusMessage: PropTypes.string,
    }),
  ),
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  resultOperation: selectors.resultOperation(state),
  tableData: selectors.tableData(state),
});

const mapDispatchToProps = dispatch => ({
  onLoansSubmit: operations.onLoansSubmit(dispatch),
  onFailedLoanValidation: operations.onFailedLoanValidation(dispatch),
});

const DocsInContainer = connect(mapStateToProps, mapDispatchToProps)(DocsIn);

const TestHooks = {
  DocsIn,
};

export default withRouter(DocsInContainer);
export { TestHooks };
