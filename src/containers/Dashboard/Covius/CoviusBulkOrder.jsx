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
import Typography from '@material-ui/core/Typography';
import * as XLSX from 'xlsx';
import DashboardModel from 'models/Dashboard';
import TabView from './TabView';

const hasPassedProp = R.has('request');
const hasFailedProp = R.has('invalidCases');

class CoviusBulkOrder extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.state = {
      ids: '',
      isSubmitDisabled: 'disabled',
      selectedEvent: { eventCode: '', hasMetadata: false },
      selectedEventCategory: '',
      eventNames: [],
      isResetDisabled: true,
      response: null,
      holdAutomation: false,
      idType: '',
    };
    this.handleReset = this.handleReset.bind(this);
    this.renderNotepadArea = this.renderNotepadArea.bind(this);
  }

  componentDidMount() {
    const { populateDropdown } = this.props;
    populateDropdown();
  }

  onResetClick = () => {
    const { onResetData } = this.props;
    this.setState({
      selectedEvent: { eventCode: '', hasMetadata: false },
      selectedEventCategory: '',
      ids: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: true,
      idType: '',
    });
    onResetData();
  }

  onSubmitCases = () => {
    const {
      ids, selectedEvent, selectedEventCategory, holdAutomation, idType,
    } = this.state;
    const { onCoviusBulkSubmit } = this.props;
    this.setState({ isSubmitDisabled: 'disabled' });
    const cases = ids.trim().replace(/\n/g, ',').split(',').map(s => s.trim());
    const payload = {
      ids: R.filter(caseId => !R.isEmpty(caseId), [...cases]),
      eventCode: selectedEvent.eventCode,
      eventCategory: selectedEventCategory,
      holdAutomation,
      idType,
    };
    onCoviusBulkSubmit(payload);
  }

  onToggleHoldAutomation = (event) => {
    this.setState({ holdAutomation: event.target.checked });
  };

  handleIdsChange = (event) => {
    const { selectedEvent, selectedEventCategory, idType } = this.state;
    const re = idType === 'Case id(s)' ? /[a-zA-Z]|[~`(@!#$%^&*+._)=\-[\]\\';/{}|\\":<>?]/ : /[~`(@!#$%^&*+.)=\-[\]\\';/{}|\\":<>?]/;
    if (event.target.value === '' || !re.test(event.target.value)) {
      this.setState({
        ids: event.target.value,
        isSubmitDisabled: event.target.value.trim() && !R.isEmpty(selectedEvent.eventCode) && !R.isEmpty(selectedEventCategory) ? '' : 'disabled',
        isResetDisabled: R.isEmpty(event.target.value.trim()) && R.isEmpty(selectedEvent.eventCode)
          && R.isEmpty(selectedEventCategory),
        idType,
      });
    }
  }

  handleEventName = (event) => {
    const { ids, selectedEventCategory } = this.state;
    const { coviusEventOptions } = this.props;
    const eventName = event.target.value;
    const selectedEvent = R.find(item => item.eventCode === eventName, coviusEventOptions);
    let disableSubmit = '';
    disableSubmit = !R.isEmpty(eventName) && !R.isEmpty(selectedEventCategory) && !R.isEmpty(ids) ? '' : 'disabled';
    this.setState({ selectedEvent, isSubmitDisabled: disableSubmit });
  }

  handleEventCategory = (event) => {
    const { coviusEventOptions, onResetData } = this.props;
    const eventCategory = event.target.value;
    onResetData();
    const eventList = R.compose(R.filter(item => item.eventCategory === eventCategory),
      R.flatten)(coviusEventOptions);
    const eventObj = {
      target: {
        value: eventList[0].eventCode,
      },
    };
    this.handleEventName(eventObj);
    this.setState({
      selectedEventCategory: eventCategory,
      isSubmitDisabled: 'disabled',
      eventNames: eventList,
      isResetDisabled: false,
    });
  }

  handleIdsCategory = (event) => {
    const idType = event.target.value;
    this.setState({
      idType,
      ids: '',
    });
  }

  handleClose = () => {
    const { closeSweetAlert, resultOperation } = this.props;
    if (resultOperation.clearData) {
      this.onResetClick();
    }
    closeSweetAlert();
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

  renderIdsDropDown = () => {
    const { idType } = this.state;
    const idsCategories = ['Case id(s)', 'Request id(s)'];
    return (
      <FormControl variant="outlined">
        <Select
          id="eventIdsDropdown"
          input={<OutlinedInput name="selectedIds" />}
          label="idcategory"
          onChange={this.handleIdsCategory}
          styleName="drop-down-select"
          value={idType}
        >
          {idsCategories.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  jsonToExcelDownload = (fileName, data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, fileName);
  }

  isDownloadDisabled = () => {
    const { resultData, coviusTabIndex } = this.props;
    if (R.isNil(resultData) || R.isEmpty(resultData)) {
      return true;
    }
    switch (coviusTabIndex) {
      case 0: return R.isEmpty(resultData.invalidCases) || !hasFailedProp(resultData);
      case 1: return R.isEmpty(resultData.request) || !hasPassedProp(resultData);
      case 3: return R.isEmpty(resultData.uploadFailed);
      default: return true;
    }
  }

  handleDownload = () => {
    const { resultData, downloadFile, coviusTabIndex } = this.props;
    let fileName = '';
    let data;
    if (coviusTabIndex === 0) {
      fileName = 'failed.xlsx';
      data = resultData.invalidCases;
    } else if (coviusTabIndex === 1) {
      fileName = 'passed.xlsx';
      data = resultData.request;
    } else if (coviusTabIndex === 3) {
      fileName = 'uploadFailed.xlsx';
      data = resultData.uploadFailed;
    }
    const payload = {
      fileName,
      data,
    };
    downloadFile(payload);
  }

  onSubmitToCovius = () => {
    const { submitToCovius } = this.props;
    const { selectedEventCategory } = this.state;
    const status = 'We are processing your request.  Please do not close the browser.';
    const level = 'Info';
    const showConfirmButton = false;
    const sweetAlertPayload = {
      status,
      level,
      showConfirmButton,
    };
    submitToCovius(selectedEventCategory, sweetAlertPayload);
  }

  handleReset() {
    this.setState({
      selectedEventCategory: ' ',
      selectedEvent: { eventCode: '', hasMetadata: false },
      ids: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: true,
      eventNames: [],
      idType: '',
    });
  }

  renderHoldAutomationToggle = () => (
    <>
      <div styleName="loan-numbers">
        <span>
          {'Hold Automation'}
        </span>
        <span styleName="errorIcon">
          <Tooltip
            placement="right-end"
            title={(
              <Typography>
                Select Yes if you want to hold the doc gen request file
                from being sent automatically to the vendor for up to 5 days.
              </Typography>
            )}
          >
            <ErrorIcon styleName="errorSvg" />
          </Tooltip>
        </span>
      </div>
      <Grid alignItems="center" component="label" container>
        <Grid item styleName="loan-numbers">NO</Grid>
        <Grid item>
          <Switch
            color="primary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
            name="holdAutomation"
            onChange={this.onToggleHoldAutomation}
          />
        </Grid>
        <Grid item>YES</Grid>
      </Grid>
    </>
  );

  renderNotepadArea() {
    const {
      ids, isSubmitDisabled, eventNames, isResetDisabled,
      selectedEventCategory, idType,
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
            <Tooltip
              placement="left-end"
              title={(
                <Typography>
                  This is the type of action or information that you
                  want to send to Covius. What type of message is this?
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderCategoryDropDown()}
        <div styleName="loan-numbers">
          <span>
            {'Event Name'}
          </span>
          <span styleName="errorIcon ">
            <Tooltip
              placement="left-end"
              title={(
                <Typography>
                  This is the specific action or information
                  that you want to send to Covius. What do you want to tell them?
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderNamesDropDown(eventNames)}
        {selectedEventCategory.trim() === DashboardModel.EVENT_CATEGORY_FILTER
        && this.renderHoldAutomationToggle()}
        <div styleName="loan-numbers">
          <span>
            {'ID Type'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              placement="left-end"
              title={(
                <Typography>
                  This is the type of Ids case/request?
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderIdsDropDown()}
        <span styleName="loan-numbers">
          {idType}
        </span>
        <div styleName="status-details">
          <TextField
            id="ids"
            margin="normal"
            multiline
            onChange={event => this.handleIdsChange(event)}
            rows={30}
            style={{ width: '95%', resize: 'none' }}
            value={ids}
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
    const { selectedEvent } = this.state;
    return (
      <FormControl variant="outlined">
        <Select
          id="eventNamesDropdown"
          input={<OutlinedInput name="selectedEvent" />}
          onChange={event => this.handleEventName(event)}
          styleName="drop-down-select"
          value={selectedEvent.eventCode}
        >
          {eventNames.map(item => (
            <MenuItem
              key={item.eventCode}
              value={item.eventCode}
            >
              {item.eventCode}
            </MenuItem>
          ))}

        </Select>
      </FormControl>
    );
  }


  renderResults() {
    const { resultData, coviusTabIndex } = this.props;
    const {
      selectedEventCategory,
      selectedEvent,
      response,
    } = this.state;
    return (
      <Grid item xs={12}>
        {response}
        <TabView
          eventCategory={selectedEventCategory}
          onReset={() => this.handleReset()}
          tableData={resultData}
        />
        {coviusTabIndex === 1 && !selectedEvent.hasMetadata
        && resultData.request && resultData.request.length
          ? (
            <div styleName="errorSvginfo">
              <Button
                color="primary"
                component="label"
                id="submit"
                onClick={this.onSubmitToCovius}
                styleName="submitButton"
                variant="contained"
              >
                SUBMIT TO COVIUS
              </Button>
            </div>
          )
          : null
        }
        {(coviusTabIndex !== 2) && (
          <div styleName="errorSvginfo">
            <Tooltip
              placement="right-end"
              title={(
                <Typography>
                  Create an excel file with the data from this tab for your review.
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
            <Button
              className="material-ui-button"
              color="primary"
              disabled={this.isDownloadDisabled()}
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
    const title = '';
    const renderAlert = (
      <SweetAlertBox
        confirmButtonColor="#004261"
        message={resultOperation.status}
        onConfirm={() => this.handleClose()}
        show={resultOperation.isOpen}
        showConfirmButton={resultOperation.showConfirmButton}
        title={resultOperation.title}
        type={resultOperation.level}
      />
    );
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
  onResetData: () => { },
  populateDropdown: () => { },
  resultData: {
    request: [],
  },
  resultOperation: {},
  coviusEventOptions: [],
  coviusTabIndex: 0,
};

CoviusBulkOrder.propTypes = {
  closeSweetAlert: PropTypes.func.isRequired,
  coviusEventOptions: PropTypes.arrayOf({
    eventCode: PropTypes.string,
    eventCategory: PropTypes.string,
    hasMetadata: PropTypes.bool,
  }),
  coviusTabIndex: PropTypes.number,
  downloadFile: PropTypes.func.isRequired,
  inProgress: PropTypes.bool,
  onCoviusBulkSubmit: PropTypes.func,
  onResetData: PropTypes.func,
  populateDropdown: PropTypes.func,
  resultData: PropTypes.shape({
    invalidCases: PropTypes.arrayOf({
      caseId: PropTypes.string,
      message: PropTypes.string,
    }),
    request: PropTypes.arrayOf({
      UserFields: PropTypes.shape({
        CASEID: PropTypes.string,
        EVAL_ID: PropTypes.string,
        LOAN_NUMBER: PropTypes.string,
      }),
      RequestId: PropTypes.string,
    }),
    uploadFailed: PropTypes.arrayOf({
      caseId: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
  resultOperation: PropTypes.shape({
    clearData: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    showConfirmButton: PropTypes.bool,
    status: PropTypes.string,
    title: PropTypes.string,
  }),
  submitToCovius: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  resultData: selectors.resultData(state),
  resultOperation: selectors.resultOperation(state),
  coviusEventOptions: selectors.getcoviusEventOptions(state),
  coviusTabIndex: selectors.getCoviusTabIndex(state),
});

const mapDispatchToProps = dispatch => ({
  onCoviusBulkSubmit: operations.onCoviusCasesSubmit(dispatch),
  onResetData: operations.onResetData(dispatch),
  downloadFile: operations.downloadFile(dispatch),
  populateDropdown: operations.populateEvents(dispatch),
  submitToCovius: operations.submitToCovius(dispatch),
  closeSweetAlert: operations.closeSweetAlert(dispatch),
});

const CoviusBulkOrderContainer = connect(mapStateToProps, mapDispatchToProps)(CoviusBulkOrder);

const TestHooks = {
  CoviusBulkOrder,
};

export { TestHooks };
export default withRouter(CoviusBulkOrderContainer);
