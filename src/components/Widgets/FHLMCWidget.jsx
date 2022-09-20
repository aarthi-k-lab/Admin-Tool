import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/dashboard';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import SweetAlertBox from 'components/SweetAlertBox';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import HistoryIcon from '@material-ui/icons/History';
import TextField from '@material-ui/core/TextareaAutosize';
import './FHLMCWidget.css';
import * as R from 'ramda';
import { PropTypes } from 'prop-types';
import CustomTable from 'components/CustomTable';
import getters from 'models/Headers';
import FHLMCDataInsight from '../../containers/Dashboard/FhlmcResolve/FHLMCDataInsight';
import {
  ELIGIBLE, INELIGIBLE, NOCALL, FHLMC, EXCEPTION_TOGGLE, COMMENT_EXCEPTON_REQUEST_TYPES,
} from '../../constants/fhlmc';
import DialogBox from '../DialogBox';


const eligibilityIndicator = {
  Eligible: ELIGIBLE,
  Ineligible: INELIGIBLE,
  'No Call': NOCALL,
};

class FHLMCWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleRequestType = this.handleRequestType.bind(this);
    this.renderCategoryDropDown = this.renderCategoryDropDown.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.getModHistory = this.getModHistory.bind(this);
    this.handleCancelReasons = this.handleCancelReasons.bind(this);
    this.handleExceptionReviewIndicator = this.handleExceptionReviewIndicator.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleCaseId = this.handleCaseId.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
  }

  componentDidMount() {
    const { populateInvestorDropdown } = this.props;
    populateInvestorDropdown(FHLMC);
  }

  onResetClick = () => {
    const { onResetData, dismissUserNotification } = this.props;
    this.setState({
      isOpen: false,
    });
    onResetData();
    dismissUserNotification();
  }

  getEnquiryRequestOption() {
    const { requestTypeData, enquiryCallCaseIds, enquiryCaseId } = this.props;
    const isEnquiryRequestValid = R.equals(requestTypeData, 'EnquiryReq');
    return (isEnquiryRequestValid) ? (
      <div>
        <div styleName="enquiry-caseId">
          <span>
            {'CaseIds'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              placement="left-end"
              title={(
                <Typography>
                  This is the type of action or information that you
                  want to send to FHLMC.If you do not choose anything
                  then default CaseId will be sent for validation.
                  What is the CaseId?
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        <div>
          <FormControl variant="outlined">
            <InputLabel styleName={!R.isEmpty(enquiryCaseId) ? 'inputLblSelected' : 'inputLbl'}>Please Select a CaseId</InputLabel>
            <Select
              id="CaseIdDropDown"
              input={<OutlinedInput name="selectedCaseId" />}
              label="CaseId"
              onChange={this.handleCaseId}
              styleName="drop-down-select"
              value={enquiryCaseId}
            >
              {enquiryCallCaseIds && enquiryCallCaseIds.map(item => (
                <MenuItem key={item.resolutionId} value={item.resolutionId}>
                  {item.resolutionId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    ) : null;
  }

  getExceptionReviewComments() {
    const { exceptionReviewComments, exceptionReviewRequestIndicator } = this.props;
    const isCommentsValid = R.equals(exceptionReviewRequestIndicator, 'Yes');
    return (isCommentsValid) ? (
      <div>
        <div styleName="exception-indicator-comments">
          <span>
            {'Comments'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              placement="left-end"
              title={(
                <Typography>
                  This is the type of action or information that you
                  want to send to FHLMC. You can write your comments here.
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        <div>
          <TextField
            id="ids"
            margin="normal"
            multiline
            onChange={event => this.handleCommentsChange(event)}
            rows={30}
            styleName="textarea-comments"
            value={exceptionReviewComments}
          />
        </div>
      </div>
    ) : null;
  }

  getExceptionDropdown() {
    const { exceptionReviewRequestIndicator } = this.props;
    return (
      <FormControl variant="outlined">
        <Select
          id="ExceptionReviewDropDown"
          input={<OutlinedInput name="selectedExceptionReview" />}
          label="exceptionRequestReviewValue"
          onChange={this.handleExceptionReviewIndicator}
          styleName="drop-down-select"
          value={exceptionReviewRequestIndicator}
        >
          {EXCEPTION_TOGGLE && EXCEPTION_TOGGLE.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  getExceptionRequestReview() {
    const { requestTypeData } = this.props;
    const isExceptionReviewValid = (requestTypeData
      && !COMMENT_EXCEPTON_REQUEST_TYPES.includes(requestTypeData));
    return (isExceptionReviewValid) ? (
      <div>
        <div>
          <div styleName="exception-indicator">
            <span>
              {'Exception Review Indicator'}
            </span>
            <span styleName="errorIcon">
              <Tooltip
                placement="left-end"
                title={(
                  <Typography>
                    This is the type of action or information that you
                    want to send to FHLMC. Whether the exception review indicator is required?
                  </Typography>
                )}
              >
                <ErrorIcon styleName="errorSvg" />
              </Tooltip>
            </span>
          </div>
          {this.getExceptionDropdown()}
        </div>
        {this.getExceptionReviewComments()}
      </div>
    ) : null;
  }

  getCancellationReason() {
    const { cancellationReasons, requestTypeData, selectedCancellationReason } = this.props;
    return (cancellationReasons && requestTypeData && R.equals(requestTypeData, 'CXLReq')
      ? (
        <div>
          <FormControl variant="outlined">
            <InputLabel styleName={!R.isEmpty(selectedCancellationReason) ? 'inputLblSelected' : 'inputLbl'}>Please Select Cancelation Reason</InputLabel>
            <Select
              id="cancellationReason"
              input={<OutlinedInput name="selectedReason" />}
              label="Reason"
              onChange={this.handleCancelReasons}
              styleName="drop-down-select"
              value={selectedCancellationReason}
            >
              {cancellationReasons && cancellationReasons.map(item => (
                <MenuItem key={item.requestType} value={item.requestType}>
                  <Tooltip
                    placement="left"
                    title={(
                      <Typography>
                        {item.tooltip}
                      </Typography>
                    )}
                  >
                    <span>
                      {item.displayText}
                    </span>
                  </Tooltip>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : null
    );
  }

  getModHistory(isOpen) {
    const { fhlmcModHistoryData } = this.props;
    return (
      <DialogBox
        fullWidth="true"
        isOpen={isOpen}
        maxWidth="xl"
        message={(
          <CustomTable
            defaultPageSize={20}
            loading={R.isNil(fhlmcModHistoryData)}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            styleName="table"
            tableData={fhlmcModHistoryData}
            tableHeader={getters.getFHLMCModHistoryColumns()}
          />
        )}
        onClose={this.handleDialogClose}
        title="Mod History"
      />
    );
  }

  renderCategoryDropDown = () => {
    const { investorEvents, groupName, requestTypeData } = this.props;
    const requestType = R.project(['requestType', 'displayText'], investorEvents);
    const handledRequestType = R.equals('INVSET', groupName) ? requestType : R.reject(e => e.requestType === 'SETReq')(requestType);
    const { isOpen } = this.state;
    return (
      <>
        <div>
          {this.getModHistory(isOpen)}
          <div>
            <div styleName="requestCategoryDropdown">
              <span>
                {'Request Type'}
              </span>
              <span styleName="errorIcon">
                <Tooltip
                  placement="right-end"
                  title={(
                    <Typography>
                      This is the type of action or information that you
                      want to send to FHLMC. What type of message is this?
                    </Typography>
                  )}
                >
                  <ErrorIcon styleName={!R.isEmpty(requestTypeData) ? 'errorSvgSelected' : 'errorSvg'} />
                </Tooltip>
              </span>
            </div>
            <Tooltip aria-label="Mod History" classes="tooltip" placement="left" title={<h3>Mod History</h3>}><span styleName="modHistory"><HistoryIcon onClick={() => this.handleDialogData()} /></span></Tooltip>
          </div>
          <div>
            <FormControl variant="outlined">
              <InputLabel styleName={!R.isEmpty(requestTypeData) ? 'inputLblSelected' : 'inputLbl'}>Please Select</InputLabel>
              <Select
                id="requestCategoryDropdown"
                input={<OutlinedInput name="selectedEventCategory" />}
                label="category"
                onChange={this.handleRequestType}
                styleName="drop-down-select"
                value={requestTypeData}
              >
                {handledRequestType && handledRequestType.map(item => (
                  <MenuItem key={item.requestType} value={item.requestType}>
                    {item.displayText}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {this.getExceptionRequestReview()}
          {this.getCancellationReason()}
          {this.getEnquiryRequestOption()}
          <div styleName="divider">
            <Divider />
          </div>
        </div>

      </>
    );
  }

  handleCommentsChange = (event) => {
    const {
      setExceptionReviewComments,
    } = this.props;
    setExceptionReviewComments(event.target.value);
  }

  handleExceptionReviewIndicator = (event) => {
    const {
      setExceptionReviewIndicator,
    } = this.props;
    setExceptionReviewIndicator(event.target.value);
  }

  handleCancelReasons = (event) => {
    const {
      setSelectedCancellationReasonData,
    } = this.props;
    setSelectedCancellationReasonData(event.target.value);
  }


  handleRequestType = (event) => {
    const {
      setRequestTypeData, resolutionId, onFhlmcBulkSubmit,
      getCancellationReasonsData, clearCancellationReasons, setExceptionReviewIndicator,
      setExceptionReviewComments, getCaseIdsOperation, setEnquiryCaseId,
    } = this.props;
    setExceptionReviewIndicator('No');
    setExceptionReviewComments('');
    setRequestTypeData(event.target.value);
    if (R.equals(event.target.value, 'CXLReq')) {
      getCancellationReasonsData(); // populate Cancellation Reasons
    } else {
      clearCancellationReasons();
    }
    const payload = {
      caseIds: [resolutionId],
      requestType: event.target.value,
      requestIdType: 'caseId(s)',
    };
    onFhlmcBulkSubmit(payload);

    if (R.equals(event.target.value, 'EnquiryReq')) {
      getCaseIdsOperation();
      setEnquiryCaseId(resolutionId);
    }
  }

  handleCaseId = (event) => {
    const { requestTypeData, onFhlmcBulkSubmit, setEnquiryCaseId } = this.props;
    setEnquiryCaseId(event.target.value);
    const payload = {
      caseIds: [event.target.value],
      requestType: requestTypeData,
      requestIdType: 'caseId(s)',
    };
    onFhlmcBulkSubmit(payload);
  }

  handleClose = () => {
    const { closeSweetAlert, resultOperation } = this.props;
    if (resultOperation.clearData) {
      this.onResetClick();
    }
    closeSweetAlert();
  }

  handleDialogClose = () => {
    const { onTablePopupDataClear } = this.props;
    onTablePopupDataClear();
    this.setState({ isOpen: false });
  }

  handleDialogData = () => {
    const { onFhlmcModHistoryPopup } = this.props;
    onFhlmcModHistoryPopup();
    this.setState({ isOpen: true });
  }

  render() {
    const {
      resultOperation,
      investorEvents,
      requestTypeData,
      eligibleData,
      selectedCancellationReason,
      exceptionReviewComments,
      exceptionReviewRequestIndicator,
    } = this.props;
    const portFolio = R.find(item => item.requestType === requestTypeData, investorEvents);
    const portfolioCode = R.pathOr('', ['portfolioCode'], portFolio);
    const eligibileVerify = eligibleData && eligibleData.includes('Ineligible');
    const renderAlert = (
      <SweetAlertBox
        confirmButtonColor="#004261"
        message={resultOperation.status}
        onConfirm={this.handleClose}
        show={resultOperation.isOpen}
        showConfirmButton={resultOperation.showConfirmButton}
        title={resultOperation.title}
        type={resultOperation.level}
      />
    );
    return (
      <div styleName="status-details-parent">
        <section>
          {renderAlert}
          <Typography styleName="title">FHLMC</Typography>
          <span styleName="eligible">
            <FiberManualRecordIcon styleName={eligibileVerify ? 'failedTab' : 'passedTab'} />
          </span>
          <span styleName={eligibileVerify ? 'failed' : 'passed'}>
            {eligibleData && R.prop(eligibleData, eligibilityIndicator)}
          </span>
          <div styleName="divider">
            <Divider />
          </div>
          {this.renderCategoryDropDown()}
          <FHLMCDataInsight
            exceptionReviewComments={exceptionReviewComments}
            exceptionReviewRequestIndicator={exceptionReviewRequestIndicator}
            isWidget
            portfolioCode={portfolioCode}
            selectedCancellationReason={selectedCancellationReason}
            selectedRequestType={requestTypeData}
            submitCases
          />
        </section>
      </div>
    );
  }
}

FHLMCWidget.defaultProps = {
  populateInvestorDropdown: () => { },
  investorEvents: [],
  resultOperation: {},
  requestTypeData: '',
  onFhlmcModHistoryPopup: {},
  fhlmcModHistoryData: null,
  onTablePopupDataClear: {},
  getCancellationReasonsData: {},
  getCaseIdsOperation: {},
  groupName: '',
  cancellationReasons: [],
  selectedCancellationReason: '',
  setSelectedCancellationReasonData: {},
  clearCancellationReasons: {},
  exceptionReviewRequestIndicator: '',
  exceptionReviewComments: '',
  setExceptionReviewComments: {},
  setExceptionReviewIndicator: {},
  enquiryCallCaseIds: [],
  onResetData: () => { },
  setEnquiryCaseId: () => { },
  enquiryCaseId: '',
};

FHLMCWidget.propTypes = {
  cancellationReasons: PropTypes.arrayOf({
    displayText: PropTypes.string,
    requestType: PropTypes.string,
    tooltip: PropTypes.string,
  }),
  clearCancellationReasons: PropTypes.func,
  closeSweetAlert: PropTypes.func.isRequired,
  dismissUserNotification: PropTypes.func.isRequired,
  eligibleData: PropTypes.string.isRequired,
  enquiryCallCaseIds: PropTypes.arrayOf({
    resolutionId: PropTypes.string,
  }),
  enquiryCaseId: PropTypes.string,
  exceptionReviewComments: PropTypes.string,
  exceptionReviewRequestIndicator: PropTypes.string,
  fhlmcModHistoryData: PropTypes.arrayOf(PropTypes.shape({})),
  getCancellationReasonsData: PropTypes.func,
  getCaseIdsOperation: PropTypes.func,
  groupName: PropTypes.string,
  investorEvents: PropTypes.arrayOf(PropTypes.String),
  onFhlmcBulkSubmit: PropTypes.func.isRequired,
  onFhlmcModHistoryPopup: PropTypes.func,
  onResetData: PropTypes.func,
  onTablePopupDataClear: PropTypes.func,
  populateInvestorDropdown: PropTypes.func,
  requestTypeData: PropTypes.string,
  resolutionId: PropTypes.string.isRequired,
  resultOperation: PropTypes.shape({
    clearData: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    showConfirmButton: PropTypes.bool,
    status: PropTypes.string,
    title: PropTypes.string,
  }),
  selectedCancellationReason: PropTypes.string,
  setEnquiryCaseId: PropTypes.func,
  setExceptionReviewComments: PropTypes.func,
  setExceptionReviewIndicator: PropTypes.func,
  setRequestTypeData: PropTypes.func.isRequired,
  setSelectedCancellationReasonData: PropTypes.func,
};

const mapStateToProps = state => ({
  cancellationReasons: selectors.cancellationReasons(state),
  fhlmcModHistoryData: selectors.getFhlmcModHistory(state),
  investorEvents: selectors.getInvestorEvents(state),
  resultOperation: selectors.resultOperation(state),
  groupName: selectors.groupName(state),
  eligibleData: selectors.eligibleData(state),
  requestTypeData: selectors.getRequestTypeData(state),
  resolutionId: selectors.resolutionId(state),
  selectedCancellationReason: selectors.getSelectedCancellationReason(state),
  exceptionReviewRequestIndicator: selectors.getExceptionReviewIndicator(state),
  exceptionReviewComments: selectors.getExceptionReviewComments(state),
  enquiryCallCaseIds: selectors.getCaseIds(state),
  enquiryCaseId: selectors.getEnquiryCaseId(state),
});

const mapDispatchToProps = dispatch => ({
  closeSweetAlert: operations.closeSweetAlert(dispatch),
  populateInvestorDropdown: operations.populateInvestorEvents(dispatch),
  setRequestTypeData: operations.setRequestTypeDataOperation(dispatch),
  onFhlmcBulkSubmit: operations.onFhlmcCasesSubmit(dispatch),
  onFhlmcModHistoryPopup: operations.onFHLMCModHistory(dispatch),
  onTablePopupDataClear: operations.onTablePopupDataClear(dispatch),
  getCancellationReasonsData: operations.getCancellationReasonDetails(dispatch),
  setSelectedCancellationReasonData: operations.setSelectedCancellationReasonData(dispatch),
  clearCancellationReasons: operations.clearCancellationReasons(dispatch),
  setExceptionReviewIndicator: operations.setExceptionReviewIndicatorOperation(dispatch),
  setExceptionReviewComments: operations.setExceptionReviewCommentsOperation(dispatch),
  getCaseIdsOperation: operations.getCaseIdsOperation(dispatch),
  onResetData: operations.onResetData(dispatch),
  dismissUserNotification: operations.onDismissUserNotification(dispatch),
  setEnquiryCaseId: operations.setEnquiryCaseIdOperation(dispatch),
});

export { FHLMCWidget };

export default connect(mapStateToProps, mapDispatchToProps)(FHLMCWidget);
