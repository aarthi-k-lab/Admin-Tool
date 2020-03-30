import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './CoviusBulkOrder.css';
import * as R from 'ramda';
import Select from '@material-ui/core/Select';
import Loader from 'components/Loader/Loader';
import SweetAlertBox from 'components/SweetAlertBox';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import GetAppIcon from '@material-ui/icons/GetApp';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import * as XLSX from 'xlsx';
import TabView from './TabView';

const events = [
  { category: 'Fulfillment Request', label: 'Get Data', value: 1 },
  { category: 'X Request', label: 'Post Data', value: 2 },
  { category: 'Y Request', label: 'Get Data', value: 3 },
  { category: 'X Request', label: 'Print Data', value: 4 },
  { category: 'Fulfillment Request', label: 'Send Data', value: 5 },
];

const getEventCategories = [
  { label: 'Fulfillment Request', value: 1 },
  { label: 'X Request', value: 2 },
  { label: 'Y Request', value: 3 },
];

const getEventNames = category => R.filter(item => item.category === category, events);

class CoviusBulkOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      caseIds: '',
      isSubmitDisabled: 'disabled',
      selectedEventName: '',
      selectedEventCategory: '',
      eventNames: [],
      isResetDisabled: true,
      isVisible: true,
      isOpen: true,
      tabIndex: 0,
      isDownloadDisabled: 'disabled',
    };
    this.handleReset = this.handleReset.bind(this);
    this.renderNotepadArea = this.renderNotepadArea.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({ isOpen: true });
  }

  onResetClick = () => {
    const { onResetCoviusData } = this.props;
    this.setState({
      selectedEventName: '',
      selectedEventCategory: '',
      caseIds: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: true,
    });
    onResetCoviusData();
  }

  onSubmitCases = () => {
    const { caseIds } = this.state;
    const { onCoviusBulkSubmit } = this.props;
    this.setState({ isSubmitDisabled: 'disabled' });
    const cases = caseIds.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
    const payload = {
      caseIds: R.filter(caseId => !R.isEmpty(caseId), [...cases]),
    };
    onCoviusBulkSubmit(payload);
  }

  handleCaseChange = (event) => {
    const { selectedEventName, selectedEventCategory } = this.state;
    const re = /[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/;
    if (event.target.value === '' || !re.test(event.target.value)) {
      this.setState({
        caseIds: event.target.value,
        isSubmitDisabled: event.target.value.trim() && !R.isEmpty(selectedEventName) && !R.isEmpty(selectedEventCategory) ? '' : 'disabled',
        isResetDisabled: R.isEmpty(event.target.value.trim()) && R.isEmpty(selectedEventName)
          && R.isEmpty(selectedEventCategory),
      });
    }
  }

  handleEventName = (event) => {
    const { caseIds, selectedEventCategory } = this.state;
    const eventName = event.target.value;
    let disableSubmit = '';
    disableSubmit = !R.isEmpty(eventName) && !R.isEmpty(selectedEventCategory) && !R.isEmpty(caseIds) ? '' : 'disabled';
    this.setState({ selectedEventName: eventName, isSubmitDisabled: disableSubmit });
  }

  handleEventCategory = (event) => {
    const eventCategory = event.target.value;
    const eventNames = getEventNames(eventCategory);
    this.setState({
      selectedEventCategory: eventCategory,
      isSubmitDisabled: 'disabled',
      selectedEventName: '',
      eventNames,
      isResetDisabled: false,
    });
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  renderCategoryDropDown = () => {
    const { selectedEventCategory } = this.state;
    return (
      <FormControl variant="outlined">
        <Select
          id="eventCategoryDropdown"
          input={<OutlinedInput name="selectedEventCategory" />}
          label="category"
          onChange={this.handleEventCategory}
          styleName="drop-down-select"
          value={selectedEventCategory}
        >
          {getEventCategories.map(item => (
            <MenuItem key={item} value={item.label}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  handleTabChange = (value, tabIndex) => {
    const downloadDisabled = this.checkDownloadDisabled(tabIndex);
    this.setState({
      isVisible: value,
      tabIndex,
      isDownloadDisabled: downloadDisabled ? 'disabled' : '',
    });
  }

  jsonToExcelDownload = (fileName, data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, fileName);
  }

  checkDownloadDisabled = (tabIndex) => {
    const { resultData } = this.props;
    if (R.isNil(resultData) || R.isEmpty(resultData)) {
      return true;
    }
    switch (tabIndex) {
      case 0: return R.isEmpty(resultData.invalidCases);
      case 1: return R.isEmpty(resultData.DocumentRequests);
      case 3: return R.isEmpty(resultData.uploadFailed);
      default: return true;
    }
  }

  handleDownload = () => {
    const { tabIndex } = this.state;
    const { resultData } = this.props;
    if (tabIndex === 0) {
      const failedData = resultData.invalidCases;
      this.jsonToExcelDownload('failed.xlsx', failedData);
    } else if (tabIndex === 1) {
      const passedData = resultData.DocumentRequests;
      this.jsonToExcelDownload('passed.xlsx', passedData);
    } else if (tabIndex === 3) {
      const passedData = resultData.uploadFailed;
      this.jsonToExcelDownload('uploadFailed.xlsx', passedData);
    }
  }

  handleReset() {
    this.setState({
      selectedEventCategory: ' ',
      selectedEventName: '',
      caseIds: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: true,
      eventNames: [],
    });
  }

  renderNotepadArea() {
    const {
      caseIds, isSubmitDisabled, eventNames, isResetDisabled,
    } = this.state;
    return (
      <div styleName="status-details-parent">
        <span styleName="newBulkUpload">
          {'New Event Request'}
          <FormLabel
            className="filled"
            color="primary"
            disabled={isResetDisabled}
            onClick={() => this.onResetClick()}
            styleName={isResetDisabled ? 'reset-button-style' : 'reset-button-style-blue'}
          >
            RESET
          </FormLabel>
        </span>

        <div styleName="loan-numbers">
          <span>
            {'Event Category'}
          </span>
          <span styleName="errorIcon">
            <Tooltip title="This is the type of action or information that you want to send to Covius. What type of message is this?">
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderCategoryDropDown()}
        <div styleName="loan-numbers">
          <span>
            {'Event Name'}
          </span>
          <span styleName="errorIcon">
            <Tooltip title="This is the specific action or information that you want to send to Covius. What do you want to tell them?">
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderNamesDropDown(eventNames)}
        <span styleName="loan-numbers">
          {'Case id(s)'}
        </span>
        <div styleName="status-details">
          <TextField
            id="caseIds"
            margin="normal"
            multiline
            onChange={event => this.handleCaseChange(event)}
            rows={30}
            style={{ width: '99%', resize: 'none' }}
            value={caseIds}
          />
        </div>
        <div styleName="interactive-button">
          <div>
            <Button
              className="material-ui-button"
              color="primary"
              disabled={isSubmitDisabled}
              id="submitButton"
              margin="normal"
              onClick={() => this.onSubmitCases()}
              styleName="submitButton"
              variant="contained"
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </div>
    );
  }

  renderNamesDropDown(eventNames) {
    const { selectedEventName } = this.state;
    return (
      <FormControl variant="outlined">
        <Select
          id="eventNamesDropdown"
          input={<OutlinedInput name="selectedEventName" />}
          onChange={event => this.handleEventName(event)}
          styleName="drop-down-select"
          value={selectedEventName}
        >
          {eventNames.map(item => <MenuItem value={item.value}>{item.label}</MenuItem>)}

        </Select>
      </FormControl>
    );
  }

  renderResults() {
    const { resultData } = this.props;
    const { isVisible, isDownloadDisabled } = this.state;
    return (
      <Grid item xs={12}>
        <TabView
          onChange={this.handleTabChange}
          onReset={() => this.handleReset()}
          tableData={resultData}
        />
        {isVisible && (
          <div styleName="errorSvginfo">
            <Tooltip title="Create an excel file with the data from this tab for your review.">
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
            {' '}
            <Button
              className="material-ui-button"
              color="primary"
              disabled={isDownloadDisabled}
              id="download"
              margin="normal"
              onClick={this.handleDownload}
              startIcon={<GetAppIcon />
              }
              styleName="submitButton"
              variant="contained"
            >
              DOWNLOAD EXCEL TO VERIFY
            </Button>
          </div>
        )}
      </Grid>
    );
  }

  render() {
    const { inProgress, resultOperation } = this.props;
    const { isOpen } = this.state;
    const title = '';
    let renderAlert = null;
    if (inProgress === false && resultOperation.level === 'error') {
      renderAlert = (
        <SweetAlertBox
          message={resultOperation.status}
          onConfirm={this.handleClose}
          show={isOpen}
          type={resultOperation.level}
        />
      );
    }
    return (
      <>
        <ContentHeader title={title}>
          <Grid container style={{ height: '3rem' }} xs={12}>
            <Grid item xs={1}>
              <div styleName="coviusLabel">
                Covius
              </div>
            </Grid>
            <Grid item xs={4}>
              <div styleName="title-row">
                {renderAlert}
              </div>
            </Grid>
          </Grid>
          <Controls />
        </ContentHeader>
        <Grid container styleName="loan-activity" xs={12}>
          <Grid item xs={2}>
            {this.renderNotepadArea()}
          </Grid>
          <Grid item xs={10}>
            {
              inProgress
                ? <Loader message="Loading" />
                : this.renderResults()
            }
          </Grid>
        </Grid>
      </>
    );
  }
}

CoviusBulkOrder.defaultProps = {
  inProgress: false,
  onCoviusBulkSubmit: () => { },
  onResetCoviusData: () => { },
  resultData: {
    DocumentRequests: [],
    invalidCases: [],
  },
  resultOperation: {},
};

CoviusBulkOrder.propTypes = {
  inProgress: PropTypes.bool,
  onCoviusBulkSubmit: PropTypes.func,
  onResetCoviusData: PropTypes.func,
  resultData: PropTypes.shape({
    DocumentRequests: PropTypes.arrayOf({
      UserFields: PropTypes.shape({
        CASEID: PropTypes.string,
        EVAL_ID: PropTypes.string,
        LOAN_NUMBER: PropTypes.string,
      }),
      RequestId: PropTypes.string,
    }),
    invalidCases: PropTypes.arrayOf({
      caseId: PropTypes.string,
      message: PropTypes.string,
    }),
    uploadFailed: PropTypes.arrayOf({
      caseId: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
  resultOperation: PropTypes.shape({
    level: PropTypes.string,
    status: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  resultData: selectors.resultData(state),
  resultOperation: selectors.resultOperation(state),
});

const mapDispatchToProps = dispatch => ({
  onCoviusBulkSubmit: operations.onCoviusCasesSubmit(dispatch),
  onResetCoviusData: operations.onResetCoviusData(dispatch),
});

const CoviusBulkOrderContainer = connect(mapStateToProps, mapDispatchToProps)(CoviusBulkOrder);

const TestHooks = {
  CoviusBulkOrder,
};

export { TestHooks };
export default withRouter(CoviusBulkOrderContainer);
