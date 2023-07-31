import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/dashboard';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import SweetAlertBox from 'components/SweetAlertBox';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import TextField from '@material-ui/core/TextareaAutosize';
import './FHLMCWidget.css';
import * as R from 'ramda';
import { PropTypes } from 'prop-types';
import CustomTable from 'components/CustomTable';
import getters from 'models/Headers';
import {
  Button, FormControlLabel, FormLabel, Radio, RadioGroup,
} from '@material-ui/core/index';
import FHLMCDataInsight from '../../containers/Dashboard/FhlmcResolve/FHLMCDataInsight';
import FHLMCDataInsightDownload from '../../containers/Dashboard/FhlmcResolve/FHLMCDataInsightDownload';
import {
  ELIGIBLE, INELIGIBLE, NOCALL, FHLMC, EXCEPTION_TOGGLE, COMMENT_EXCEPTON_REQUEST_TYPES,
  EXCEPTION_REQUEST, CANCELLATION_REASON, REQ_PRCS,
  COMMENTS_REASON, ENABLE_ODM_RERUN,
} from '../../constants/fhlmc';
import DialogBox from '../DialogBox';


const eligibilityIndicator = {
  Eligible: ELIGIBLE,
  Ineligible: INELIGIBLE,
  'No Call': NOCALL,
  'Exception Request': EXCEPTION_REQUEST,
};

function CustomButton(props) {
  const {
    onClick, title, hasTooltip, tooltipMessage, extraStyle, ...other
  } = props;
  return (
    <div styleName="btns-container">
      <Button
        className="material-ui-button"
        onClick={onClick}
        styleName={extraStyle}
        {...other}
      >
        {title}
      </Button>
      {hasTooltip && (
        <Tooltip
          placement="top"
          title={(
            <Typography>
              {tooltipMessage}
            </Typography>
          )}
        >
          <ErrorIcon styleName="cstmBtnErrSvg" />
        </Tooltip>
      )}
    </div>
  );
}

function compareButtonOrder(a, b) {
  const order = ['Cancel Request', 'Draft Request', 'Trial Period Approve Request', 'Workout Approve Request', 'Enquiry Call', 'Settlement Request'];
  const indexA = order.indexOf(a.displayText);
  const indexB = order.indexOf(b.displayText);
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;
  return indexA - indexB;
}

CustomButton.defaultProps = {
  onClick: () => { },
  title: '',
  hasTooltip: false,
  tooltipMessage: '',
  extraStyle: '',
};

CustomButton.propTypes = {
  extraStyle: PropTypes.string,
  hasTooltip: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
  tooltipMessage: PropTypes.string,
};

class FHLMCWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSubmitFhlmc: false,
    };
    this.handleRequestType = this.handleRequestType.bind(this);
    this.renderCategoryDropDown = this.renderCategoryDropDown.bind(this);
    this.getModHistory = this.getModHistory.bind(this);
    this.handleCancelReasons = this.handleCancelReasons.bind(this);
    this.handleExceptionReviewIndicator = this.handleExceptionReviewIndicator.bind(this);
    this.handleCommentsChange = this.handleCommentsChange.bind(this);
    this.handleCaseId = this.handleCaseId.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.submitForODMRerun = this.submitForODMRerun.bind(this);
    this.submitToFhlmc = this.submitToFhlmc.bind(this);
  }

  componentDidMount() {
    const { populateInvestorDropdown } = this.props;
    populateInvestorDropdown(FHLMC);
    this.setState({ showSubmitFhlmc: true });
  }

  onResetClick = () => {
    const { onResetData, dismissUserNotification } = this.props;
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
              arrow
              placement="right-start"
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
        <div styleName="requestCategoryDropdown">
          <span>
            {'Comments'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              arrow
              placement="right-start"
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


  getExceptionRadioBtns() {
    const { exceptionReviewRequestIndicator } = this.props;
    return (
      <RadioGroup aria-label="position" defaultValue={exceptionReviewRequestIndicator} name="position" onChange={this.handleExceptionReviewIndicator} row>
        {EXCEPTION_TOGGLE && EXCEPTION_TOGGLE.map(item => (
          <FormControlLabel
            key={item}
            control={<Radio color="primary" />}
            label={item}
            labelPlacement="end"
            styleName="requestCategoryDropdown"
            value={item}
          />
        ))}
      </RadioGroup>
    );
  }

  getExceptionRequestReview() {
    const { requestTypeData } = this.props;
    const isExceptionReviewValid = (requestTypeData
      && !COMMENT_EXCEPTON_REQUEST_TYPES.includes(requestTypeData));
    return (isExceptionReviewValid) ? (
      <div>
        <div>
          <div styleName="requestCategoryDropdown">
            <span>
              {'Exception Review'}
            </span>
            <span styleName="errorIcon">
              <Tooltip
                arrow
                placement="right-start"
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
          {this.getExceptionRadioBtns()}
        </div>
        {this.getExceptionReviewComments()}
      </div>
    ) : null;
  }

  getCancellationReason() {
    const { cancellationReasons, requestTypeData, selectedCancellationReason } = this.props;
    return (cancellationReasons && requestTypeData && R.equals(requestTypeData, 'CXLReq')
      ? (
        <div styleName="radio-container">
          <FormControl component="fieldset">
            <FormLabel component="legend">Cancellation Reason</FormLabel>
            <RadioGroup aria-label="gender" name="gender1" onChange={this.handleCancelReasons} value={selectedCancellationReason}>
              {cancellationReasons && cancellationReasons.map(item => (
                <FormControlLabel
                  control={<Radio />}
                  label={item.displayText}
                  value={item.requestType}
                />
              ))}
            </RadioGroup>
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

  submitForODMRerun = () => {
    const { odmRerunOperation } = this.props;
    odmRerunOperation();
  }


  renderCategoryDropDown = () => {
    const {
      investorEvents, groupName, requestTypeData, isAssigned,
      enableODMRerun,
    } = this.props;
    const requestType = R.project(['requestType', 'displayText'], investorEvents);
    const handledRequestType = R.equals('INVSET', groupName) ? requestType : R.reject(e => e.requestType === 'SETReq')(requestType);
    const sortedHandledRequestType = handledRequestType.sort(compareButtonOrder);
    const { showSubmitFhlmc } = this.state;

    const { exceptionReviewComments, exceptionReviewRequestIndicator } = this.props;
    const isCommentsValid = R.equals(exceptionReviewRequestIndicator, 'Yes');

    return (
      <>
        <div styleName="request-type-container">
          <div>
            <div styleName="requestCategoryDropdown">
              <span>
                {'Select Request Type'}
              </span>
            </div>

          </div>
          <div style={{ margin: '8px 0px 20px' }}>
            {
            sortedHandledRequestType && sortedHandledRequestType.map((item) => {
              let displayText = '';
              if (item.displayText && R.endsWith('Request', item.displayText)) {
                displayText = R.dropLast(8, item.displayText);
              }
              if (item.displayText && R.endsWith('Call', item.displayText)) {
                displayText = R.dropLast(5, item.displayText);
              }
              return (
                <Button
                  key={item.requestType}
                  onClick={() => this.handleRequestType(item.requestType)}
                  styleName={requestTypeData === item.requestType ? 'active btn-tabs' : 'btn-tabs'}
                  variant="outlined"
                >
                  {displayText}
                </Button>
              );
            })}
          </div>
          {this.getExceptionRequestReview()}
          {this.getCancellationReason()}
          {this.getEnquiryRequestOption()}
          <div styleName="fhlmc-btn-container">
            <Grid item>
              <CustomButton
                color="primary"
                disabled={!ENABLE_ODM_RERUN.includes(requestTypeData) || !enableODMRerun
                  || !isAssigned || R.isEmpty(requestTypeData)}
                extraStyle="submit"
                hasTooltip={false}
                onClick={this.submitForODMRerun}
                title="RE-RUN ODM"
                variant="contained"
              />
            </Grid>
            <Grid item>
              {showSubmitFhlmc && (
                <CustomButton
                  color="primary"
                  disabled={R.isEmpty(requestTypeData) || (isCommentsValid && exceptionReviewComments === '')}
                  extraStyle="submit"
                  hasTooltip={false}
                  onClick={this.submitToFhlmc}
                  title="SUBMIT TO FHLMC"
                  variant="contained"
                />
              )
              }
            </Grid>
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


  handleRequestType = (request) => {
    const {
      setRequestTypeData, resolutionId, onFhlmcBulkSubmit,
      getCancellationReasonsData, clearCancellationReasons, setExceptionReviewIndicator,
      setExceptionReviewComments, getCaseIdsOperation, setEnquiryCaseId,
    } = this.props;
    setExceptionReviewIndicator('No');
    setExceptionReviewComments('');
    setRequestTypeData(request);
    if (R.equals(request, 'CXLReq')) {
      getCancellationReasonsData(); // populate Cancellation Reasons
    } else {
      clearCancellationReasons();
    }
    const payload = {
      caseIds: [resolutionId],
      requestType: request,
      requestIdType: 'caseId(s)',
    };
    onFhlmcBulkSubmit(payload);

    if (R.equals(request, 'EnquiryReq')) {
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


  submitToFhlmc() {
    const {
      onSubmitToFhlmcRequest,
      selectedCancellationReason, openSweetAlert, exceptionReviewComments,
      exceptionReviewRequestIndicator, requestTypeData, investorEvents,
    } = this.props;

    const portFolio = R.find(item => item.requestType === requestTypeData, investorEvents);
    const portfolioCode = R.pathOr('', ['portfolioCode'], portFolio);
    if (R.equals(requestTypeData, 'CXLReq') && R.isEmpty(selectedCancellationReason)) {
      this.terminateAndShowWarning(CANCELLATION_REASON, openSweetAlert, true);
      return;
    }
    const isExceptionReviewCommentsValid = R.equals(exceptionReviewRequestIndicator, 'Yes') && R.isEmpty(R.trim(exceptionReviewComments));
    const isExceptionReviewValid = !COMMENT_EXCEPTON_REQUEST_TYPES.includes(requestTypeData);
    if (isExceptionReviewCommentsValid && isExceptionReviewValid) {
      const sweetAlertPayload = {
        status: COMMENTS_REASON,
        level: 'Warning',
        showConfirmButton: true,
      };
      openSweetAlert(sweetAlertPayload);
      return;
    }
    const status = REQ_PRCS;
    const level = 'Info';
    const showConfirmButton = false;
    const sweetAlertPayload = {
      status,
      level,
      showConfirmButton,
    };
    onSubmitToFhlmcRequest(requestTypeData, portfolioCode, sweetAlertPayload);
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
          <div styleName="d-flex">
            <Typography styleName="title" variant="h2">FHLMC Operations</Typography>
            <span styleName="eligible">
              <FiberManualRecordIcon styleName={eligibileVerify ? 'failedTab' : 'passedTab'} />
            </span>
            <span styleName={eligibileVerify ? 'failed' : 'passed'}>
              {eligibleData && R.prop(eligibleData, eligibilityIndicator)}
            </span>
            <FHLMCDataInsightDownload
              exceptionReviewComments={exceptionReviewComments}
              exceptionReviewRequestIndicator={exceptionReviewRequestIndicator}
              isWidget
              portfolioCode={portfolioCode}
              selectedCancellationReason={selectedCancellationReason}
              selectedRequestType={requestTypeData}
              submitCases
            />
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
  odmRerunOperation: () => { },
  onSubmitToFhlmcRequest: () => { },
  openSweetAlert: () => { },
  populateInvestorDropdown: () => { },
  investorEvents: [],
  resultOperation: {},
  requestTypeData: '',
  fhlmcModHistoryData: null,
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
  enableODMRerun: PropTypes.bool.isRequired,
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
  isAssigned: PropTypes.bool.isRequired,
  odmRerunOperation: PropTypes.func,
  onFhlmcBulkSubmit: PropTypes.func.isRequired,
  onResetData: PropTypes.func,
  onSubmitToFhlmcRequest: PropTypes.func,
  openSweetAlert: PropTypes.func,
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
  disableSubmitToFhlmc: selectors.disableSubmittofhlmc(state),
  enableODMRerun: selectors.getODMRetryEligibility(state),
  fhlmcModHistoryData: selectors.getFhlmcModHistory(state),
  investorEvents: selectors.getInvestorEvents(state),
  isAssigned: selectors.isAssigned(state),
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
  onSubmitToFhlmcRequest: operations.onSubmitToFhlmcRequest(dispatch),
  populateInvestorDropdown: operations.populateInvestorEvents(dispatch),
  setRequestTypeData: operations.setRequestTypeDataOperation(dispatch),
  odmRerunOperation: operations.odmRerunOperation(dispatch),
  onFhlmcBulkSubmit: operations.onFhlmcCasesSubmit(dispatch),
  onFhlmcModHistoryPopup: operations.onFHLMCModHistory(dispatch),
  onTablePopupDataClear: operations.onTablePopupDataClear(dispatch),
  openSweetAlert: operations.openSweetAlert(dispatch),
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
