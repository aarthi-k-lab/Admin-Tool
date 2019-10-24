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
import MenuItem from '@material-ui/core/MenuItem';
import { Link, withRouter } from 'react-router-dom';
import { selectors, operations } from 'ducks/dashboard';
import { selectors as LoginSelectors } from 'ducks/login';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import UserNotification from '../../../components/UserNotification/UserNotification';
import './DocsIn.css';

const validLoanEntries = RegExp(/[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/);
const validateLoanFormat = (loansNumber) => {
  let isValid = true;
  // eslint-disable-next-line
  if (validLoanEntries.test(loansNumber)) {
    isValid = false;
  }
  return isValid;
};

const getValueStates = () => {
  const states = [{
    displayName: 'ORDER',
    value: 'Ordered',
  }];
  return states;
};

const getTaxTranscriptStates = () => {
  const states = [{
    displayName: 'ORDER',
    value: 'Ordered',
  }, {
    displayName: 'COMPLETE',
    value: 'Completed',
  }];
  return states;
};

const isPageTypeDocsIn = (pageType) => {
  if (pageType === 'BULKUPLOAD_DOCSIN') return true;
  return false;
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
      value: 'Value',
      selectedState: 'Ordered',
    };
    this.handleBackButton = this.handleBackButton.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleloansSubmitStager = this.handleloansSubmitStager.bind(this);
    this.handleloansSubmitDocsIn = this.handleloansSubmitDocsIn.bind(this);
    this.renderDropDown = this.renderDropDown.bind(this);
    this.handleChangeInState = this.handleChangeInState.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
    this.renderDownloadButton = this.renderDownloadButton.bind(this);
    this.renderNotepadArea = this.renderNotepadArea.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.onDownloadCSV = this.onDownloadCSV.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.showBulkOrderPage = this.showBulkOrderPage.bind(this);
  }

  onDownloadCSV() {
    this.csvLink.link.click();
  }

  onValueChange(event) {
    this.setState({ value: event.target.value });
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
        countLoan += item.statusMessage === 'Successful' ? 1 : 0;
        loanNum = item.loanNumber;
      }
    });
    return `${countLoan} loan(s) have been processed.`;
  }

  showBulkOrderPage() {
    const { onSelect } = this.props;
    onSelect();
  }

  handleChangeInState(event) {
    this.setState({ selectedState: event.target.value });
  }

  handleBackButton() {
    const { history, bulkOrderPageType } = this.props;
    if (isPageTypeDocsIn(bulkOrderPageType)) history.push('/docs-in');
    else history.push('/stager');
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

  handleloansSubmitDocsIn() {
    const { loansNumber } = this.state;
    const { onLoansSubmit, onFailedLoanValidation, bulkOrderPageType } = this.props;
    if (validateLoanFormat(loansNumber)) {
      const loanNumbersList = loansNumber.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
      const payload = {
        loanNumbers: loanNumbersList,
        pageType: bulkOrderPageType,
      };
      onLoansSubmit(payload);
    } else {
      const payload = {
        level: 'error',
        status: 'Please enter loan number(s) in correct format. Only comma and newline separated loan numbers are accepted',
      };
      onFailedLoanValidation(payload);
    }
  }

  handleloansSubmitStager() {
    const { loansNumber, value, selectedState } = this.state;
    const {
      onLoansSubmit, user, onFailedLoanValidation, bulkOrderPageType,
    } = this.props;
    if (validateLoanFormat(loansNumber)) {
      const loanNumbersList = loansNumber.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
      const payload = {
        loanNumber: loanNumbersList,
        eventName: value,
        status: selectedState,
        userID: user.userDetails.email,
        pageType: bulkOrderPageType,
      };
      onLoansSubmit(payload);
    } else {
      const payload = {
        level: 'error',
        status: 'Please enter loan number(s) in correct format. Only comma and newline separated loan numbers are accepted',
      };
      onFailedLoanValidation(payload);
    }
  }

  renderDropDown(LoanStates) {
    const { value, selectedState } = this.state;
    return (
      <>
        <Grid item styleName="drop-down-select" xs={1}>
          <Select
            // native
            onChange={event => this.onValueChange(event)}
            value={value}
          >
            <MenuItem value="Value">VALUE</MenuItem>
            <MenuItem value="TaxTranscript">TAX TRANSCRIPT</MenuItem>
          </Select>
        </Grid>
        <Grid item style={{ marginLeft: '2rem' }} styleName="drop-down" xs={1}>
          <Select
            // native
            onChange={this.handleChangeInState}
            value={selectedState}
          >
            {LoanStates.map(item => (
              <MenuItem value={item.value}>{item.displayName}</MenuItem>
            ))}
          </Select>
        </Grid>
      </>
    );
  }

  renderDownloadButton() {
    const { tableData } = this.props;
    return (
      <Grid
        item
        style={{
          textAlign: 'right', paddingRight: '2rem', paddingTop: '0.3rem', marginLeft: '16rem',
        }}
        xs={4}
      >
        {(tableData && tableData.length > 0) && (
          <Button color="primary" onClick={() => this.onDownloadCSV()} variant="contained">
            <DownloadIcon styleName="download-icon" />
            <CSVLink
              // eslint-disable-next-line no-return-assign
              ref={event => this.csvLink = event}
              data={tableData}
              filename="bulk-order.csv"
              onClick={event => event.stopPropagation()}
              style={{ color: 'white' }}
            >
              Download
            </CSVLink>
          </Button>
        )}
      </Grid>
    );
  }

  renderNotepadArea() {
    const { loansNumber, isDisabled } = this.state;
    const { bulkOrderPageType } = this.props;
    return (
      <div styleName="status-details-parent">
        <div styleName="status-details">
          <TextField
            id="loanNumbers"
            margin="normal"
            multiline
            onChange={this.handleChange}
            style={{ height: '98%', width: '99%', resize: 'none' }}
            value={loansNumber}
          />
        </div>
        <div styleName="interactive-button">
          {isPageTypeDocsIn(bulkOrderPageType)
            ? (
              <div>
                <Button
                  className="material-ui-button"
                  color="primary"
                  disabled={isDisabled}
                  margin="normal"
                  onClick={this.handleloansSubmitDocsIn}
                  variant="contained"
                >
                  Docs Received
                </Button>
              </div>
            )
            : (
              <div>
                <Button
                  className="material-ui-button"
                  color="primary"
                  disabled={isDisabled}
                  margin="normal"
                  onClick={this.handleloansSubmitStager}
                  variant="contained"
                >
                  SUBMIT
                </Button>
              </div>
            )}
        </div>
      </div>
    );
  }

  renderTableData() {
    const { tableData } = this.props;
    return (
      <Grid container direction="column" style={{ paddingLeft: '1rem' }} xs={10}>
        <div styleName="table-container">
          <div styleName="height-limiter">
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
              styleName="table"
            />
          </div>
        </div>
      </Grid>
    );
  }

  render() {
    const { value } = this.state;
    const { inProgress } = this.props;
    const title = '';
    const { resultOperation, bulkOrderPageType } = this.props;
    const LoanStates = value === 'Value' ? getValueStates() : getTaxTranscriptStates();
    const renderBackButtonPage = isPageTypeDocsIn(bulkOrderPageType) ? '/docs-in' : '/stager';
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
              <div styleName="backButton">
                <Link onClick={this.handleBackButton} to={renderBackButtonPage}>
                  &lt; BACK
                </Link>
              </div>
            </Grid>
            {!isPageTypeDocsIn(bulkOrderPageType)
              ? this.renderDropDown(LoanStates)
              : <Grid item xs={3} />}
            <Grid item xs={6}>
              <div style={{ paddingTop: '0.1rem', paddingBottom: '0' }} styleName="title-row">
                {(resultOperation && resultOperation.status)
                  ? <UserNotification level={resultOperation.level} message={resultOperation.status} type="alert-box" />
                  : ''
                }
              </div>
            </Grid>
            <Grid item xs={2}>
              {this.renderDownloadButton()}
            </Grid>
          </Grid>
          <Controls />
        </ContentHeader>
        <Grid container>
          <Grid item xs={6}>
            <span styleName="loan-numbers">Enter Loan Numbers</span>
          </Grid>
          <Grid item xs={5}>
            <span styleName="message">
              {this.getMessage()}
            </span>
          </Grid>
        </Grid>
        <Grid container styleName="loan-activity" xs={12}>
          <Grid item xs={2}>{this.renderNotepadArea()}</Grid>
          {this.renderTableData()}
        </Grid>
      </>
    );
  }
}

DocsIn.defaultProps = {
  inProgress: false,
  resultOperation: { level: '', status: '' },
  onLoansSubmit: () => { },
  onFailedLoanValidation: () => { },
  tableData: [
    {
      loanNumber: '', pid: 0, evalId: 0, statusMessage: '',
    },
  ],
};

DocsIn.propTypes = {
  bulkOrderPageType: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  inProgress: PropTypes.bool,
  onFailedLoanValidation: PropTypes.func,
  onLoansSubmit: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
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
  user: PropTypes.shape({
    userDetails: PropTypes.shape({
      email: PropTypes.string,
    }),
  }).isRequired,
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  resultOperation: selectors.resultOperation(state),
  tableData: selectors.tableData(state),
  user: LoginSelectors.getUser(state),
  bulkOrderPageType: selectors.bulkOrderPageType(state),
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