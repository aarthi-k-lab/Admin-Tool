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
import Switch from '@material-ui/core/Switch';
import * as XLSX from 'xlsx';
import TabView from './TabView';

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
      getAlert: null,
      holdAutomation: false,
    };
    this.handleReset = this.handleReset.bind(this);
    this.renderNotepadArea = this.renderNotepadArea.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { populateDropdown } = this.props;
    populateDropdown();
  }

  componentWillReceiveProps() {
    this.setState({ isOpen: true });
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const {
      getDownloadResponse, resultData,
      clearSubmitDataResponse,
    } = nextProps;
    const { isOpen } = prevState;
    if (!R.isEmpty(getDownloadResponse)) {
      const { message, level } = getDownloadResponse;
      const alertResponse = (
        <SweetAlertBox
          message={message}
          onConfirm={this.handleClose}
          show={isOpen}
          type={level}
        />
      );
      clearSubmitDataResponse();
      return { getAlert: alertResponse };
    }
    if (!R.isNil(resultData) && !R.isEmpty(resultData) && !R.isEmpty(resultData.invalidCases)) {
      return {
        isDownloadDisabled: '', getAlert: null,
      };
    }
    return { getAlert: null };
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
    const {
      caseIds, selectedEventName, selectedEventCategory, holdAutomation,
    } = this.state;
    const { onCoviusBulkSubmit } = this.props;
    this.setState({ isSubmitDisabled: 'disabled' });
    const cases = caseIds.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
    const payload = {
      caseIds: R.filter(caseId => !R.isEmpty(caseId), [...cases]),
      eventCode: selectedEventName,
      eventCategory: selectedEventCategory,
      holdAutomation,
    };
    onCoviusBulkSubmit(payload);
  }

  onToggleHoldAutomation = (event) => {
    this.setState({ holdAutomation: event.target.checked });
  };

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
    const { coviusEventOptions } = this.props;
    const eventCategory = event.target.value;
    const eventList = R.compose(R.filter(item => item.eventCategory === eventCategory),
      R.flatten)(coviusEventOptions);
    const eventNames = R.pluck('eventCode', eventList);
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
    const { coviusEventOptions } = this.props;
    const eventCategories = R.compose(R.uniq, R.pluck('eventCategory'), R.flatten)(coviusEventOptions);
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
          {eventCategories.map(item => (
            <MenuItem key={item} value={item}>
              {item}
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
    const { resultData, downloadFile } = this.props;
    let fileName = '';
    let data;
    if (tabIndex === 0) {
      fileName = 'failed.xlsx';
      data = resultData.invalidCases;
    } else if (tabIndex === 1) {
      fileName = 'passed.xlsx';
      data = resultData.DocumentRequests;
    } else if (tabIndex === 3) {
      fileName = 'uploadFailed.xlsx';
      data = resultData.uploadFailed;
    }
    const payload = {
      fileName,
      data,
    };
    downloadFile(payload);
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

  renderHoldAutomationToggle = () => (
    <Grid alignItems="center" component="label" container>
      <Grid styleName="loan-numbers">
        {'Hold Automation'}
      </Grid>
      <Grid item>
        <Switch
          color="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
          name="holdAutomation"
          onChange={this.onToggleHoldAutomation}
        />
      </Grid>
    </Grid>
  );

  renderNotepadArea() {
    const {
      caseIds, isSubmitDisabled, eventNames, isResetDisabled,
      selectedEventCategory,
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

        {selectedEventCategory.trim() === 'FulfillmentRequest' && this.renderHoldAutomationToggle()}
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
          {eventNames.map(item => <MenuItem value={item}>{item}</MenuItem>)}

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
    const { isOpen, getAlert } = this.state;
    const title = '';
    let renderAlert = null;
    if (inProgress === false && resultOperation.level === 'error') {
      renderAlert = (
        <SweetAlertBox
          message={resultOperation.status}
          onConfirm={() => this.handleClose()}
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
            {getAlert}
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
  populateDropdown: () => { },
  resultData: {
    DocumentRequests: [],
    invalidCases: [],
  },
  resultOperation: {},
  coviusEventOptions: [],
};

CoviusBulkOrder.propTypes = {
  clearSubmitDataResponse:
    PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  coviusEventOptions: PropTypes.arrayOf({
    eventCode: PropTypes.string,
    eventCategory: PropTypes.string,
  }),
  downloadFile: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  getDownloadResponse:
    PropTypes.shape.isRequired, // eslint-disable-line react/no-unused-prop-types
  inProgress: PropTypes.bool,
  onCoviusBulkSubmit: PropTypes.func,
  onResetCoviusData: PropTypes.func,
  populateDropdown: PropTypes.func,
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
  getDownloadResponse: selectors.getDownloadResponse(state),
  coviusEventOptions: selectors.getcoviusEventOptions(state),
});

const mapDispatchToProps = dispatch => ({
  onCoviusBulkSubmit: operations.onCoviusCasesSubmit(dispatch),
  onResetCoviusData: operations.onResetCoviusData(dispatch),
  downloadFile: operations.downloadFile(dispatch),
  populateDropdown: operations.populateEvents(dispatch),
  clearSubmitDataResponse: operations.onClearSubmitCoviusData(dispatch),
});

const CoviusBulkOrderContainer = connect(mapStateToProps, mapDispatchToProps)(CoviusBulkOrder);

const TestHooks = {
  CoviusBulkOrder,
};

export { TestHooks };
export default withRouter(CoviusBulkOrderContainer);
