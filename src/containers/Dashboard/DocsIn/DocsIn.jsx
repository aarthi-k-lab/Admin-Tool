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
import * as R from 'ramda';
import MenuItem from '@material-ui/core/MenuItem';
import { Link, withRouter } from 'react-router-dom';
import { selectors, operations } from 'ducks/dashboard';
import { selectors as LoginSelectors } from 'ducks/login';
import { selectors as stagerSelectors } from 'ducks/stager';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import UserNotification from '../../../components/UserNotification/UserNotification';
import './DocsIn.css';

const validLoanEntries = RegExp(/[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/);
const nonDispositionList = ['Value', 'TaxTranscript', 'Incentive'];
const recordationToOrderTasks = ['Modification Agreement ToOrder', 'Assumption Agreement ToOrder',
  'Partial Claim ToOrder', '258A ToOrder'];
const recordationOrderedTasks = ['Modification Agreement Ordered', 'Assumption Agreement Ordered',
  'Partial Claim Ordered', '258A Ordered'];
const validateLoanFormat = (loansNumber) => {
  let isValid = true;
  // eslint-disable-next-line
  if (validLoanEntries.test(loansNumber)) {
    isValid = false;
  }
  return isValid;
};

const getStagerValues = (taskName) => {
  let value = [];
  switch (taskName) {
    case 'Value':
      value = [{
        displayName: 'ORDER',
        value: 'ORDERED',
      }];
      break;
    case 'TaxTranscript':
      value = [{
        displayName: 'ORDER',
        value: 'ORDERED',
      }, {
        displayName: 'COMPLETE',
        value: 'COMPLETED',
      }];
      break;
    default: return null;
  }
  return value;
};
const getPostModStagerTaskNames = () => {
  const states = [{
    displayName: 'FNMAQC',
    value: 'FNMA QC',
  }, {
    displayName: 'COUNTERSIGN',
    value: 'Countersign',
  }, {
    displayName: 'SEND MOD AGREEMENT',
    value: 'Send Mod Agreement',
  }, {
    displayName: 'RECORDATION',
    value: 'Recordation',
  }, {
    displayName: 'MODIFICATION AGREEMENT TOORDER',
    value: 'Modification Agreement ToOrder',
  }, {
    displayName: 'ASSUMPTION AGREEMENT TOORDER',
    value: 'Assumption Agreement ToOrder',
  }, {
    displayName: 'PARTIAL CLAIM TOORDER',
    value: 'Partial Claim ToOrder',
  }, {
    displayName: '258A TOORDER',
    value: '258A ToOrder',
  }, {
    displayName: 'MODIFICATION AGREEMENT ORDERED',
    value: 'Modification Agreement Ordered',
  }, {
    displayName: 'ASSUMPTION AGREEMENT ORDERED',
    value: 'Assumption Agreement Ordered',
  }, {
    displayName: 'PARTIAL CLAIM ORDERED',
    value: 'Partial Claim Ordered',
  }, {
    displayName: '258A ORDERED',
    value: '258A Ordered',
  }, {
    displayName: 'INVESTOR SETTLEMENT',
    value: 'Investor Settlement',
  }, {
    displayName: 'MOD REVERSAL',
    value: 'modReversal',
  }];
  return states;
};

const getPostModStagerValues = (dropDownValue) => {
  let taskName = '';
  if (dropDownValue.includes('ToOrder')) {
    taskName = recordationToOrderTasks.indexOf(dropDownValue) !== -1 ? 'Recordation To Order' : dropDownValue;
  } else {
    taskName = recordationOrderedTasks.indexOf(dropDownValue) !== -1 ? 'Recordation Ordered' : dropDownValue;
  }
  let value = [];
  switch (taskName) {
    case 'modReversal':
      value = [{
        displayName: 'CLOSE ALL TASKS',
        value: 'Close All Tasks',
      }];
      break;
    default: return [];
  }
  return value;
};

const getStagerTaskName = () => {
  const states = [{
    displayName: 'VALUE',
    value: 'Value',
  }, {
    displayName: 'TAX TRANSCRIPT',
    value: 'TaxTranscript',
  }];
  return states;
};

const getOptionBasedStagerValues = (dropDownValue) => {
  let taskName = '';
  if (dropDownValue.includes('ToOrder')) {
    taskName = recordationToOrderTasks.indexOf(dropDownValue) !== -1 ? 'Recordation To Order' : dropDownValue;
  } else {
    taskName = recordationOrderedTasks.indexOf(dropDownValue) !== -1 ? 'Recordation Ordered' : dropDownValue;
  }
  let value = [];
  switch (taskName) {
    case 'FNMA QC':
      value = [
        {
          displayName: 'FNMA QC PASS',
          value: 'FNMA QC PASS',
        },
        {
          displayName: 'SUBMITTED IR SHAREPOINT TICKET',
          value: 'Submitted IR SharePoint Ticket',
        }];
      break;
    case 'Countersign':
      value = [
        {
          displayName: 'COUNTERSIGNED COMPLETED',
          value: 'Countersigned Completed',
        }];
      break;
    case 'Send Mod Agreement':
      value = [
        {
          displayName: 'COMPLETED',
          value: 'Completed',
        }];
      break;
    case 'Recordation':
      value = [
        {
          displayName: 'RE-ORDER',
          value: 'Re-Order',
        }];
      break;
    case 'Recordation To Order':
      value = [
        {
          displayName: 'SENT FOR E-RECORDING',
          value: 'Sent for E-Recording',
        },
        {
          displayName: 'SENT TO VENDOR FOR RECORDING',
          value: 'Sent to Vendor for Recording',
        }];
      break;
    case 'Recordation Ordered':
      value = [
        {
          displayName: 'RECORDED',
          value: 'Recorded',
        },
        {
          displayName: 'REJECTED BY COUNTY - MODIFICATION EXCEPTION',
          value: 'Rejected by County - Modification Exception',
        }];
      break;
    case 'Investor Settlement':
      value = [{
        displayName: 'SUBMITTED FOR SETTLEMENT',
        value: 'Submitted for Settlement',
      }];
      break;
    default: return null;
  }
  return value;
};

const isPageTypeDocsIn = (pageType) => {
  if (pageType === 'BULKUPLOAD_DOCSIN') return true;
  return false;
};

const postModGroups = ['postmodstager', 'postmodstager-mgr'];
const stagerGroups = ['stager', 'stager-mgr'];
const allAccessGroups = [...postModGroups, ...stagerGroups];

class DocsIn extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      hasError: false,
      loansNumber: '',
      // loanNumbersCount: 0,
      isDisabled: 'disabled',
      value: '',
      selectedState: undefined,
      modReversalReason: '',
      stagerTaskOptions: [],
      selectedStagerTaskOptions: '',
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
    this.handleChangeModReversalReasons = this.handleChangeModReversalReasons.bind(this);
    this.handleOptionStagerTask = this.handleOptionStagerTask.bind(this);
    this.renderOptionDropdown = this.renderOptionDropdown.bind(this);
  }

  componentDidMount() {
    const {
      groupName, user, setPageType, setStagerValueAndState, bulkOrderPageType,
      onCleanResult,
    } = this.props;
    let valueState = {};
    let optionStagerValues = [];
    if (!groupName) {
      const isPostMod = user ? this.isPostModGroup(user.userGroups.map(o => o.groupName)) : false;
      const isStager = user ? this.isStagerGroup(user.userGroups.map(o => o.groupName)) : false;
      if (isStager && isPostMod) {
        setPageType('BULKUPLOAD_ALL_STAGER');
        valueState = { value: 'Value', selectedState: 'ORDERED' };
      } else if (isStager) {
        setPageType('BULKUPLOAD_STAGER');
        valueState = { value: 'Value', selectedState: 'ORDERED' };
      } else if (isPostMod) {
        setPageType('BULKUPLOAD_POSTMOD_STAGER');
        optionStagerValues = getOptionBasedStagerValues('FNMA QC');
        valueState = {
          value: 'FNMA QC',
          selectedStagerTaskOptions: 'FNMA QC PASS',
          stagerTaskOptions: optionStagerValues,
        };
      } else {
        setPageType('BULKUPLOAD_DOCSIN');
      }
    } else {
      switch (bulkOrderPageType) {
        case 'BULKUPLOAD_STAGER':
          valueState = { value: 'Value', selectedState: 'ORDERED' };
          break;
        case 'BULKUPLOAD_POSTMOD_STAGER':
          optionStagerValues = getOptionBasedStagerValues('FNMA QC');
          valueState = {
            value: 'FNMA QC',
            selectedStagerTaskOptions: 'FNMA QC PASS',
            stagerTaskOptions: optionStagerValues,
          };
          break;
        case 'BULKUPLOAD_ALL_STAGER':
          valueState = { value: 'Value', selectedState: 'ORDERED' };
          break;
        default:
      }
    }
    onCleanResult();
    setStagerValueAndState(valueState);
    this.setState(valueState);
  }


  onDownloadCSV() {
    this.csvLink.link.click();
  }

  onValueChange(event) {
    let LoanStates = [];
    let optionStagerValues = [];
    let disableSubmit = '';
    let selectedOptionValue = '';
    const { setStagerValueAndState, user } = this.props;
    const { modReversalReason, loansNumber } = this.state;
    const dualGroup = user ? this.isDualGroup(user.userGroups.map(o => o.groupName))
      : false;
    const postModGroupCheck = user ? this.isPostModGroup(user.userGroups.map(o => o.groupName))
      : false;
    if (dualGroup) {
      LoanStates = getStagerValues(event.target.value)
        || getPostModStagerValues(event.target.value);
    } else if (postModGroupCheck) {
      LoanStates = getPostModStagerValues(event.target.value);
    } else {
      LoanStates = getStagerValues(event.target.value);
    }
    const { onSelectModReversal } = this.props;
    if (event.target.value === 'modReversal') {
      onSelectModReversal();
      disableSubmit = modReversalReason && loansNumber ? '' : 'disabled';
    } else if (nonDispositionList.indexOf(event.target.value) === -1) {
      optionStagerValues = getOptionBasedStagerValues(event.target.value);
      disableSubmit = loansNumber ? '' : 'disabled';
      selectedOptionValue = optionStagerValues[0].value;
    } else {
      disableSubmit = loansNumber ? '' : 'disabled';
    }
    const valueState = {
      value: event.target.value,
      selectedState: !R.isEmpty(LoanStates) ? LoanStates[0].value : null,
      stagerTaskOptions: optionStagerValues,
      isDisabled: disableSubmit,
      selectedStagerTaskOptions: selectedOptionValue,
    };
    setStagerValueAndState(valueState);
    this.setState(valueState);
  }

  getMessage() {
    const { hasError, value, selectedStagerTaskOptions } = this.state;
    const { tableData } = this.props;
    if (hasError) {
      return 'We are experiencing some issues. Please try after some time.';
    }
    let count = 0;
    const isRecordationReorder = (value === 'Recordation' && selectedStagerTaskOptions === 'Re-Order');
    if (tableData) {
      const data = Object.assign([], R.flatten(tableData));
      const successRecords = R.filter(obj => obj.statusMessage === 'Successful', data);
      count = isRecordationReorder ? R.uniq(successRecords.map(o => o.evalId)).length
        : R.uniq(successRecords.map(o => o.loanNumber)).length;
    }
    const title = isRecordationReorder ? 'Evals' : 'loans';
    return `${count} ${title} have been processed.`;
  }

  getSubmitState(value) {
    const { modReversalReason, value: stateValue } = this.state;
    if (stateValue === 'modReversal') return ((value.trim() && modReversalReason !== '') ? '' : 'disabled');
    return (value.trim() ? '' : 'disabled');
  }

  // eslint-disable-next-line class-methods-use-this
  isPostModGroup(userGroups) {
    return postModGroups.every(i => userGroups.includes(i));
  }

  // eslint-disable-next-line class-methods-use-this
  isDualGroup(userGroups) {
    return allAccessGroups.every(i => userGroups.includes(i));
  }

  // eslint-disable-next-line class-methods-use-this
  isStagerGroup(userGroups) {
    return stagerGroups.every(i => userGroups.includes(i));
  }


  handleBackButton() {
    const { history, bulkOrderPageType } = this.props;
    if (isPageTypeDocsIn(bulkOrderPageType)) history.push('/docs-in');
    else history.push('/stager');
  }

  handleChangeInState(event) {
    this.setState({ selectedState: event.target.value });
  }

  handleChangeModReversalReasons(event) {
    const { loansNumber } = this.state;
    this.setState({ modReversalReason: event.target.value, isDisabled: loansNumber !== '' ? '' : 'disabled' });
  }

  handleOptionStagerTask(event) {
    const { loansNumber } = this.state;
    this.setState({ selectedStagerTaskOptions: event.target.value, isDisabled: loansNumber !== '' ? '' : 'disabled' });
  }

  showBulkOrderPage() {
    const { onSelect } = this.props;
    onSelect();
  }

  handleChange(event) {
    const { onFailedLoanValidation } = this.props;
    this.setState({
      loansNumber: event.target.value,
      isDisabled: this.getSubmitState(event.target.value),
    });
    const payload = {};
    onFailedLoanValidation(payload);
  }

  handleloansSubmitDocsIn() {
    const { loansNumber } = this.state;
    const { onLoansSubmit, onFailedLoanValidation, bulkOrderPageType } = this.props;
    if (validateLoanFormat(loansNumber)) {
      const loanNumbers = loansNumber.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
      const loanNumbersList = new Set(loanNumbers);
      const payload = {
        loanNumbers: [...loanNumbersList],
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
    const {
      loansNumber, value, selectedState, modReversalReason, selectedStagerTaskOptions,
    } = this.state;
    const {
      onLoansSubmit, user, onFailedLoanValidation, bulkOrderPageType,
    } = this.props;
    let statusName = '';
    if (validateLoanFormat(loansNumber)) {
      const loanNumbers = loansNumber.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
      const inputValueList = new Set(loanNumbers);
      if (selectedStagerTaskOptions) {
        statusName = selectedStagerTaskOptions;
      } else {
        statusName = value === 'modReversal' ? modReversalReason : selectedState;
      }
      const inputKey = (value === 'Recordation' && statusName === 'Re-Order') ? 'evalId' : 'loanNumber';
      const payload = {
        [inputKey]: [...inputValueList],
        eventName: (value === 'Recordation' && statusName === 'Re-Order') ? 'recordationReorder' : value,
        status: statusName,
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

  renderOptionDropdown(value, selectedStagerTaskOptions, stagerTaskOptions) {
    if (nonDispositionList.indexOf(value) === -1) {
      return (
        <div>
          <Grid item style={{ marginLeft: '2rem' }} styleName="drop-down" xs={1}>
            <Select
              // native
              onChange={this.handleOptionStagerTask}
              value={selectedStagerTaskOptions}
            >
              {stagerTaskOptions.map(item => (
                <MenuItem value={item.value}>{item.displayName}</MenuItem>
              ))}
            </Select>
          </Grid>
        </div>
      );
    }
    return null;
  }

  renderDropDown(taskName, LoanStates) {
    const {
      value, selectedState, modReversalReason, stagerTaskOptions, selectedStagerTaskOptions,
    } = this.state;
    const { modReversalReasons } = this.props;
    return (
      <>
        <Grid item styleName="drop-down-select" xs={1}>
          <Select
            // native
            onChange={event => this.onValueChange(event)}
            value={value}
          >
            {taskName.map(item => (
              <MenuItem value={item.value}>{item.displayName}</MenuItem>
            ))}
          </Select>
        </Grid>
        {selectedState ? (
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
        ) : null}

        {value === 'modReversal' ? (
          <div>
            <Grid item style={{ marginLeft: '2rem' }} styleName="drop-down" xs={1}>
              <Select
                // native
                onChange={this.handleChangeModReversalReasons}
                value={modReversalReason}
              >
                {Array.isArray(modReversalReasons) && modReversalReasons.map(item => (
                  <MenuItem value={item}>{item}</MenuItem>
                ))}
              </Select>
            </Grid>

          </div>
        ) : this.renderOptionDropdown(value, selectedStagerTaskOptions, stagerTaskOptions)
        }
      </>
    );
  }

  renderDownloadButton() {
    const { tableData } = this.props;
    return (
      <Grid
        style={{
          right: '0', position: 'absolute', paddingRight: '64px', paddingTop: '4px',
        }}
        xs={4}
      >
        {(tableData && tableData.length > 0) && (
          <Button color="primary" onClick={() => this.onDownloadCSV()} variant="contained">
            <DownloadIcon styleName="download-icon" />
            <CSVLink
              // eslint-disable-next-line no-return-assign
              ref={event => this.csvLink = event}
              data={R.flatten(tableData)}
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
              data={R.flatten(tableData) || []}
              defaultPageSize={100}
              /* eslint-disable-next-line */
              getTrProps={(state, rowInfo, column) => {
                return {
                  /* eslint-disable-next-line */
                  style: { background: !rowInfo ? '' : (rowInfo.row.statusMessage === 'Successful' ? '' : '#ffe1e1') },
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
    const { value, selectedStagerTaskOptions } = this.state;
    const { inProgress } = this.props;
    const title = '';
    const { resultOperation, bulkOrderPageType } = this.props;
    let taskName = [];
    let LoanStates = [];
    const inputTitle = (value === 'Recordation' && selectedStagerTaskOptions === 'Re-Order') ? 'Enter Eval Ids' : 'Enter Loan Numbers';
    switch (bulkOrderPageType) {
      case 'BULKUPLOAD_ALL_STAGER':
        taskName = [...getStagerTaskName(), ...getPostModStagerTaskNames()];
        LoanStates = getStagerValues(value) || getPostModStagerValues(value);
        break;
      case 'BULKUPLOAD_POSTMOD_STAGER':
        taskName = getPostModStagerTaskNames();
        LoanStates = getPostModStagerValues(value);
        break;
      default:
        taskName = getStagerTaskName();
        LoanStates = getStagerValues(value);
        break;
    }
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
              ? this.renderDropDown(taskName, LoanStates)
              : <Grid item xs={3} />}
            <Grid item xs={4}>
              <div styleName="title-row">
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
            <span styleName="loan-numbers">
              {inputTitle}
            </span>
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
  onCleanResult: () => { },
  onLoansSubmit: () => { },
  onFailedLoanValidation: () => { },
  tableData: [
    {
      loanNumber: '', pid: 0, evalId: 0, statusMessage: '',
    },
  ],
  onSelectModReversal: () => { },
  modReversalReasons: [],
  setStagerValueAndState: () => { },
};

DocsIn.propTypes = {
  bulkOrderPageType: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  inProgress: PropTypes.bool,
  modReversalReasons: PropTypes.arrayOf(PropTypes.string),
  onCleanResult: PropTypes.func,
  onFailedLoanValidation: PropTypes.func,
  onLoansSubmit: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onSelectModReversal: PropTypes.func,
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
  setPageType: PropTypes.func.isRequired,
  setStagerValueAndState: PropTypes.func,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      evalId: PropTypes.string,
      loanNumber: PropTypes.string,
      pid: PropTypes.string,
      statusMessage: PropTypes.string,
    }),
  ),
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
  inProgress: selectors.inProgress(state),
  resultOperation: selectors.resultOperation(state),
  tableData: selectors.tableData(state),
  user: LoginSelectors.getUser(state),
  bulkOrderPageType: selectors.bulkOrderPageType(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
  modReversalReasons: selectors.getModReversalReasons(state),
  groupName: selectors.groupName(state),
});

const mapDispatchToProps = dispatch => ({
  onCleanResult: operations.onCleanResult(dispatch),
  onLoansSubmit: operations.onLoansSubmit(dispatch),
  onFailedLoanValidation: operations.onFailedLoanValidation(dispatch),
  onSelectModReversal: operations.selectModReversal(dispatch),
  setStagerValueAndState: operations.setStagerValueAndState(dispatch),
  setPageType: operations.setPageType(dispatch),
});


const DocsInContainer = connect(mapStateToProps, mapDispatchToProps)(DocsIn);

const TestHooks = {
  DocsIn,
};

export default withRouter(DocsInContainer);
export { TestHooks };
