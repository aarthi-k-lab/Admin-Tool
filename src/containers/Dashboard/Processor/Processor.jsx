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
import { Link, withRouter } from 'react-router-dom';
import { selectors, operations } from 'ducks/dashboard';
import { selectors as LoginSelectors } from 'ducks/login';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import PropTypes from 'prop-types';
import UserNotification from '../../../components/UserNotification/UserNotification';
import '../DocsIn/DocsIn.css';

const validEvalIdEntries = RegExp(/[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/);
const validateEvalIdFormat = (evalIds) => {
  let isValid = true;
  // eslint-disable-next-line
  if (evalIds === '' || validEvalIdEntries.test(evalIds)) {
    isValid = false;
  }
  return isValid;
};

class Processor extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      hasError: false,
      evalIds: '',
      evalIdList: [],
      // loanNumbersCount: 0,
      isDisabled: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.renderDownloadButton = this.renderDownloadButton.bind(this);
    this.renderNotepadArea = this.renderNotepadArea.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.onDownloadCSV = this.onDownloadCSV.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.showBulkOrderPage = this.showBulkOrderPage.bind(this);
  }

  componentWillUnmount() {
    const { clearEvalResponse } = this.props;
    clearEvalResponse();
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
    let count = 0;
    if (tableData) {
      const data = Object.assign([], R.flatten(tableData));
      const successRecords = R.filter(obj => obj.statusMessage === 'Successful', data);
      count = R.uniq(successRecords.map(o => o.evalId)).length;
    }
    return `${count} Evals have been processed.`;
  }

  handleSubmit = () => {
    const { evalIdList, evalIds } = this.state;
    const { onSubmitEval, onFailedLoanValidation } = this.props;
    if (validateEvalIdFormat(evalIds)) {
      onSubmitEval(evalIdList);
    } else {
      const payload = {
        level: 'error',
        status: 'Please enter loan number(s) in correct format. Only comma and newline separated loan numbers are accepted',
      };
      onFailedLoanValidation(payload);
    }
  }

  showBulkOrderPage() {
    const { onSelect } = this.props;
    onSelect();
  }

  handleChange(event) {
    this.setState({
      evalIds: event.target.value,
    });
    if (validateEvalIdFormat(event.target.value)) {
      const evalIdArray = event.target.value.trim().replace(/\n|\s/g, ',').split(',').map(s => s.trim());
      const evalIds = R.filter(str => str !== '', evalIdArray);
      this.setState({ evalIdList: evalIds });
      if (evalIds.length > 99) {
        this.setState({ isDisabled: true });
      } else {
        this.setState({ isDisabled: false });
      }
    }
    if (!validateEvalIdFormat(event.target.value)) {
      this.setState({ isDisabled: true });
    }
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
    const { evalIds, isDisabled } = this.state;
    return (
      <div styleName="status-details-parent">
        <div styleName="status-details">
          <TextField
            id="loanNumbers"
            margin="normal"
            multiline
            onChange={this.handleChange}
            style={{ height: '98%', width: '99%', resize: 'none' }}
            value={evalIds}
          />
        </div>
        <div styleName="interactive-button">
          <div>
            <Button
              className="material-ui-button"
              color="primary"
              disabled={isDisabled}
              margin="normal"
              onClick={this.handleSubmit}
              variant="contained"
            >
                SUBMIT
            </Button>
          </div>
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
                  Header: 'EVAL ID', accessor: 'evalId', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
                },
                {
                  Header: 'PID', accessor: 'pid', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
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
    const { inProgress, history, resultOperation } = this.props;
    const title = '';
    const inputTitle = 'Enter Eval Ids';
    const DOCPROCESSOR = '/doc-processor';
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
                <Link onClick={() => history.push(DOCPROCESSOR)} to={DOCPROCESSOR}>
                  &lt; BACK
                </Link>
              </div>
            </Grid>
            <Grid item xs={3} />
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

Processor.defaultProps = {
  inProgress: false,
  resultOperation: { level: '', status: '' },
  onFailedLoanValidation: () => { },
  tableData: [
    {
      loanNumber: '', pid: 0, evalId: 0, statusMessage: '',
    },
  ],
};

Processor.propTypes = {
  clearEvalResponse: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  inProgress: PropTypes.bool,
  onFailedLoanValidation: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onSubmitEval: PropTypes.func.isRequired,
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      evalId: PropTypes.string,
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
  tableData: selectors.evalData(state),
  user: LoginSelectors.getUser(state),
  bulkOrderPageType: selectors.bulkOrderPageType(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
  modReversalReasons: selectors.getModReversalReasons(state),
  groupName: selectors.groupName(state),
});

const mapDispatchToProps = dispatch => ({
  clearEvalResponse: operations.clearEvalResponse(dispatch),
  onCleanResult: operations.onCleanResult(dispatch),
  onSubmitEval: operations.onEvalInsertion(dispatch),
  onLoansSubmit: operations.onLoansSubmit(dispatch),
  onClearStagerResponse: stagerOperations.onClearStagerResponse(dispatch),
  onClearStagerTaskName: operations.onClearStagerTaskName(dispatch),
  onFailedLoanValidation: operations.onFailedLoanValidation(dispatch),
  onSelectModReversal: operations.selectModReversal(dispatch),
  setStagerValueAndState: operations.setStagerValueAndState(dispatch),
  setPageType: operations.setPageType(dispatch),
});


const ProcessorContainer = connect(mapStateToProps, mapDispatchToProps)(Processor);

const TestHooks = {
  Processor,
};

export default withRouter(ProcessorContainer);
export { TestHooks };
