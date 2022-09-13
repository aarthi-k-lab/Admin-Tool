import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import ContentHeader from 'components/ContentHeader';
import Controls from 'containers/Controls';
import { connect } from 'react-redux';
import './FhlmcResolve.css';
import * as R from 'ramda';
import Select from '@material-ui/core/Select';
import UserNotification from 'components/UserNotification';
import InputLabel from '@material-ui/core/InputLabel';
import Loader from 'components/Loader/Loader';
import SweetAlertBox from 'components/SweetAlertBox';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import { selectors, operations } from 'ducks/dashboard';
import { operations as widgetoperations } from 'ducks/widgets';
import { PropTypes } from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FHLMCPreapproved from './FHLMCPreapproved';
import {
  ID_CATEGORIES, APPROVAL_TYPE, PRE_APPROVAL_TYPE, FHLMC, APPROVAL_REQUEST_TYPE,
  REGEX_FHLMC_COMMON, REGEX_FHLMC_PREAPPROVED_DISASTER,
  LOAN_NUMBERS_IDTYPE, PREAPPROVED_DISASTER_TYPES, VALIDATION_FAILURE_MSG,
  STANDARD, CANCEL_REQ_TYPES,
} from '../../../constants/fhlmc';
import FHLMCDataInsight from './FHLMCDataInsight';

const renderNoDataText = 'Processed loan information will be displayed here';
const title = 'FHLMC RESOLVE';
class FhlmcResolve extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRequestType: '',
      portfolioCode: FHLMC,
      ids: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: true,
      idType: '',
      renderNoData: true,
      selectedApprovalType: '',
      selectedPreApprovalType: '',
      investorName: FHLMC,
    };
    this.handleRequestType = this.handleRequestType.bind(this);
    this.renderFHLMCResolveNotepadArea = this.renderFHLMCResolveNotepadArea.bind(this);
    this.renderCategoryDropDown = this.renderCategoryDropDown.bind(this);
    this.renderSubmitResults = this.renderSubmitResults.bind(this);
    this.renderIdsDropDown = this.renderIdsDropDown.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmitFhlmcResolveRequest = this.onSubmitFhlmcResolveRequest.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.renderApprovalDropDown = this.renderApprovalDropDown.bind(this);
    this.handleApprovalType = this.handleApprovalType.bind(this);
    this.renderPreApprovalDropDown = this.renderPreApprovalDropDown.bind(this);
    this.handlePreApprovalType = this.handlePreApprovalType.bind(this);
    this.renderSubmitType = this.renderSubmitType.bind(this);
    this.getCancellationReason = this.getCancellationReason.bind(this);
    this.handleCancelReasons = this.handleCancelReasons.bind(this);
  }

  componentDidMount() {
    const { populateInvestorDropdown, resetWidget } = this.props;
    const { investorName } = this.state;
    populateInvestorDropdown(investorName);
    resetWidget();
  }

  onResetClick = () => {
    const { onResetData, dismissUserNotification } = this.props;
    this.setState({
      selectedRequestType: '',
      portfolioCode: '',
      ids: '',
      isSubmitDisabled: 'disabled',
      isResetDisabled: true,
      idType: '',
      renderNoData: true,
      selectedApprovalType: '',
      selectedPreApprovalType: '',
      investorName: '',
    });
    onResetData();
    dismissUserNotification();
  }

  processAndValidateInput = (ids) => {
    let error = false;
    let data = [];
    if (this.isPreApprovedDisasterType()) {
      data = R.compose(
        R.map(s => s.trim()),
        R.split(','),
        R.replace(/\n/g, ','),
        R.trim(),
      )(ids);

      const re = /^[0-9]+:[0-9]+$/;
      if (R.any(x => !re.test(x), data)) {
        error = true;
      }
    } else {
      data = (R.filter(id => !R.isEmpty(id), ids.trim().replace(/\n/g, ',').split(','))).map(s => parseInt(s.trim(), 10));
    }
    return {
      error,
      data,
    };
  }

  buildFHLMCBulkPayload = (data) => {
    let payload;
    const {
      selectedRequestType, idType, selectedApprovalType, selectedPreApprovalType,
    } = this.state;
    if (this.isPreApprovedDisasterType()) {
      const loanAndDisasterIds = data.map((loanEntry) => {
        const [loanNumber, disasterId] = loanEntry.split(':');
        return {
          loanNumber,
          disasterId,
        };
      });
      payload = {
        loanAndDisasterIds,
        selectedApprovalType,
        selectedPreApprovalType,
        requestIdType: idType,
      };
    } else if (selectedPreApprovalType === STANDARD
      || (CANCEL_REQ_TYPES.includes(selectedRequestType) && idType === LOAN_NUMBERS_IDTYPE)) {
      const loanAndDisasterIds = data.map((caseId) => {
        const loanNumber = caseId;
        return {
          loanNumber,
        };
      });
      payload = {
        loanAndDisasterIds,
        selectedApprovalType,
        selectedPreApprovalType: STANDARD,
        requestIdType: idType,
      };
    } else {
      payload = {
        caseIds: R.filter(caseId => !R.isEmpty(caseId), [...data]),
        requestType: selectedRequestType,
        requestIdType: idType,
      };
    }
    return payload;
  }

  onSubmitFhlmcResolveRequest = () => {
    const {
      ids,
    } = this.state;
    const { onFhlmcBulkSubmit, openSweetAlert } = this.props;
    const { error, data } = this.processAndValidateInput(ids);
    if (error) {
      const sweetAlertPayload = {
        status: VALIDATION_FAILURE_MSG,
        level: 'Warning',
        showConfirmButton: true,
      };
      openSweetAlert(sweetAlertPayload);
    } else {
      this.setState({ isSubmitDisabled: 'disabled', renderNoData: false });
      const payload = this.buildFHLMCBulkPayload(data);
      onFhlmcBulkSubmit(payload);
    }
  }

  isPreApprovedDisasterType = () => {
    const { idType, selectedApprovalType, selectedPreApprovalType } = this.state;
    return idType === LOAN_NUMBERS_IDTYPE
      && selectedApprovalType === PRE_APPROVAL_TYPE
      && PREAPPROVED_DISASTER_TYPES.includes(selectedPreApprovalType);
  }


  handleInputChange = (event) => {
    const { selectedRequestType, idType } = this.state;
    const re = this.isPreApprovedDisasterType() ? REGEX_FHLMC_PREAPPROVED_DISASTER
      : REGEX_FHLMC_COMMON;
    if (event.target.value === '' || !re.test(event.target.value)) {
      this.setState({
        ids: event.target.value,
        isSubmitDisabled: event.target.value.trim() && !R.isEmpty(selectedRequestType) ? '' : 'disabled',
        isResetDisabled: R.isEmpty(event.target.value.trim()) && R.isEmpty(selectedRequestType),
        idType,
      });
    }
  }

  handlePreApprovalType = (event) => {
    const investorName = APPROVAL_REQUEST_TYPE;
    const { resetWidget } = this.props;
    this.setState({
      selectedPreApprovalType: event.target.value,
      isSubmitDisabled: 'disabled',
      isResetDisabled: false,
      investorName,
    });
    resetWidget();
  }

  handleApprovalType = (event) => {
    const { populateInvestorDropdown, resetWidget } = this.props;
    this.setState({
      selectedApprovalType: event.target.value,
      isSubmitDisabled: 'disabled',
      isResetDisabled: false,
    });
    populateInvestorDropdown(PRE_APPROVAL_TYPE);
    resetWidget();
  }

  handleIdsCategory = (event) => {
    this.onResetClick();
    const idType = event.target.value;
    const { populateInvestorDropdown, resetWidget } = this.props;
    let investorName = FHLMC;
    if (idType === LOAN_NUMBERS_IDTYPE) {
      investorName = APPROVAL_REQUEST_TYPE;
    }

    this.setState({
      idType,
      ids: '',
      investorName,
    });
    populateInvestorDropdown(investorName);
    resetWidget();
  }

  handleClose = () => {
    const { closeSweetAlert, resultOperation } = this.props;
    if (resultOperation.clearData) {
      this.onResetClick();
    }
    closeSweetAlert();
  }


  renderPreApprovalDropDown = () => {
    const { selectedPreApprovalType } = this.state;
    const { preApprovalDropdown } = this.props;
    const preApprovalType = R.project(['requestType', 'displayText'], preApprovalDropdown);
    return (
      <FormControl variant="outlined">
        <Select
          id="ApprovalIdDropdown"
          input={<OutlinedInput name="selectedApproval" />}
          label="approvalcategory"
          onChange={this.handlePreApprovalType}
          styleName="drop-down-select"
          value={selectedPreApprovalType}
        >
          {preApprovalType && preApprovalType.map(item => (
            <MenuItem key={item.requestType} value={item.requestType}>
              {item.displayText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderApprovalDropDown = () => {
    const { selectedApprovalType } = this.state;
    const { approvalDropdown } = this.props;
    const approvalType = R.project(['requestType', 'displayText'], approvalDropdown);
    return (
      <FormControl variant="outlined">
        <Select
          id="ApprovalIdDropdown"
          input={<OutlinedInput name="selectedApproval" />}
          label="approvalcategory"
          onChange={this.handleApprovalType}
          styleName="drop-down-select"
          value={selectedApprovalType}
        >
          {approvalType && approvalType.map(item => (
            <MenuItem key={item.requestType} value={item.requestType}>
              {item.displayText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  renderCategoryDropDown = () => {
    const { selectedRequestType, idType } = this.state;
    const { investorEvents } = this.props;
    const requestType = R.project(['requestType', 'displayText'], investorEvents);
    const resolverequestType = R.reject(e => e.requestType === 'EnquiryReq')(requestType);
    return (
      <>
        <FormControl variant="outlined">
          <Select
            id="requestCategoryDropdown"
            input={<OutlinedInput name="selectedEventCategory" />}
            label="category"
            onChange={this.handleRequestType}
            styleName="drop-down-select"
            value={selectedRequestType}
          >
            {resolverequestType && resolverequestType.map(item => (
              <MenuItem key={item.requestType} value={item.requestType}>
                {item.displayText}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {
          (idType === 'Loan Number(s)' && !(CANCEL_REQ_TYPES.includes(selectedRequestType))) ? (
            <>
              <div styleName="loan-numbers">
                <span>
                  {'Approval Type'}
                </span>
                <span styleName="errorIcon">
                  <Tooltip
                    placement="left-end"
                    title={(
                      <Typography>
                        This is the type of action or information that you
                        want to send to FHLMC. What type of approval is this?
                      </Typography>
                    )}
                  >
                    <ErrorIcon styleName="errorSvg" />
                  </Tooltip>
                </span>
              </div>
              {this.renderApprovalDropDown()}
              <div styleName="loan-numbers">
                <span>
                  {'PreApproval Type'}
                </span>
                <span styleName="errorIcon">
                  <Tooltip
                    placement="left-end"
                    title={(
                      <Typography>
                        This is the type of action or information that you
                        want to send to FHLMC. What type of preapproval is this?
                      </Typography>
                    )}
                  >
                    <ErrorIcon styleName="errorSvg" />
                  </Tooltip>
                </span>
              </div>
              {this.renderPreApprovalDropDown()}
            </>
          ) : ''
        }
      </>

    );
  }

  handleCancelReasons = (event) => {
    const {
      setSelectedCancellationReasonData,
    } = this.props;
    setSelectedCancellationReasonData(event.target.value);
  }

  getCancellationReason = () => {
    const { cancellationReasons, selectedCancellationReason } = this.props;
    const { selectedRequestType } = this.state;
    return ((cancellationReasons && selectedRequestType
      && CANCEL_REQ_TYPES.includes(selectedRequestType))
      ? (
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
      ) : null
    );
  }

  renderIdsDropDown = () => {
    const { idType } = this.state;
    const idsCategories = ID_CATEGORIES;
    return (
      <>
        <FormControl variant="outlined">
          <Select
            id="eventIdsDropdown"
            input={<OutlinedInput name="selectedIds" />}
            label="idcategory"
            onChange={this.handleIdsCategory}
            styleName="drop-down-select"
            value={idType}
          >
            {idsCategories && idsCategories.map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  }

  handleRequestType(event) {
    const {
      getCancellationReasonsData, clearCancellationReasons,
      populateInvestorDropdown,
    } = this.props;
    const { idType } = this.state;
    this.setState({
      selectedRequestType: event.target.value,
      portfolioCode: FHLMC,
      isSubmitDisabled: 'disabled',
      isResetDisabled: false,
    });
    if (CANCEL_REQ_TYPES.includes(event.target.value)) {
      getCancellationReasonsData();
    } else {
      clearCancellationReasons();
    }
    if (idType === LOAN_NUMBERS_IDTYPE && !(CANCEL_REQ_TYPES.includes(event.target.value))) {
      populateInvestorDropdown(APPROVAL_TYPE);
    }
  }

  renderFHLMCResolveNotepadArea() {
    const {
      ids, isSubmitDisabled, isResetDisabled,
      idType,
    } = this.state;
    return (
      <div styleName="status-details-parent">
        <span styleName="newBulkUpload">
          {title}
          <FormLabel
            className="filled"
            color="primary"
            disabled={isResetDisabled}
            onClick={this.onResetClick}
            styleName={isResetDisabled ? 'reset-button-style' : 'reset-button-style-blue'}
          >
            RESET
          </FormLabel>
        </span>
        <div styleName="loan-numbers">
          <span>
            {'ID Type'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              placement="right-end"
              title={(
                <Typography>
                  This is the type of Ids?
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderIdsDropDown()}
        <div styleName="loan-numbers">
          <span>
            {'Request Type'}
          </span>
          <span styleName="errorIcon">
            <Tooltip
              placement="left-end"
              title={(
                <Typography>
                  This is the type of action or information that you
                  want to send to FHLMC. What type of message is this?
                </Typography>
              )}
            >
              <ErrorIcon styleName="errorSvg" />
            </Tooltip>
          </span>
        </div>
        {this.renderCategoryDropDown()}
        {this.getCancellationReason()}
        <span styleName="loan-numbers">
          {idType}
        </span>
        <div styleName="status-details">
          <TextField
            id="ids"
            margin="normal"
            multiline
            onChange={event => this.handleInputChange(event)}
            rows={30}
            style={{ width: '95%', resize: 'none' }}
            value={ids}
          />
        </div>
        <div styleName="interactive-button">
          <Button
            className="material-ui-button"
            color="primary"
            disabled={isSubmitDisabled}
            id="submitButton"
            margin="normal"
            onClick={this.onSubmitFhlmcResolveRequest}
            styleName="submitButton"
            variant="contained"
          >
            SUBMIT
          </Button>
        </div>
      </div>
    );
  }

  renderSubmitType() {
    const { selectedRequestType, portfolioCode, idType } = this.state;
    const { selectedCancellationReason } = this.props;
    return (
      <>
        {idType === LOAN_NUMBERS_IDTYPE ? (
          <FHLMCPreapproved
            portfolioCode={portfolioCode}
            selectedRequestType={selectedRequestType}
            submitCases
          />
        ) : (
          <FHLMCDataInsight
            portfolioCode={portfolioCode}
            selectedCancellationReason={selectedCancellationReason}
            selectedRequestType={selectedRequestType}
            submitCases
          />
        )

        }
      </>
    );
  }

  renderSubmitResults() {
    const { renderNoData } = this.state;
    return (
      <>
        {renderNoData ? (
          <Grid alignItems="center" container justify="center">
            <Grid item>
              <div styleName="nodata">{renderNoDataText}</div>
            </Grid>
          </Grid>
        )
          : this.renderSubmitType()
        }
      </>
    );
  }

  render() {
    const {
      inProgress, resultOperation, userNotificationData, dismissUserNotification,
    } = this.props;
    const { message, level, isOpen } = userNotificationData;
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
      <section styleName="scroll-wrapper">
        <ContentHeader title={
          (
            <Grid alignItems="center" container>
              <Grid item xs={12}>
                <div styleName="investorLabel">
                  {title}
                </div>
              </Grid>
            </Grid>
          )}
        >
          <Controls />
        </ContentHeader>
        {renderAlert}
        <UserNotification
          dismissUserNotification={dismissUserNotification}
          level={level}
          message={message}
          open={isOpen}
          type="message-banner"
        />
        <Grid container styleName="notepad" xs={12}>
          <Grid item xs={2}>
            {this.renderFHLMCResolveNotepadArea()}
          </Grid>
          <Grid item xs={10}>
            {
              inProgress
                ? <Loader message="Loading" />
                : this.renderSubmitResults()
            }
          </Grid>
        </Grid>
      </section>
    );
  }
}

FhlmcResolve.defaultProps = {
  location: {
    pathname: '',
  },
  investorEvents: [],
  inProgress: false,
  onFhlmcBulkSubmit: () => { },
  openSweetAlert: () => { },
  onResetData: () => { },
  populateInvestorDropdown: () => { },
  resultOperation: {},
  userNotificationData: {},
  approvalDropdown: [],
  preApprovalDropdown: [],
  getCancellationReasonsData: {},
  cancellationReasons: [],
  selectedCancellationReason: '',
  clearCancellationReasons: {},
  setSelectedCancellationReasonData: {},
};

FhlmcResolve.propTypes = {
  approvalDropdown: PropTypes.arrayOf(PropTypes.String),
  cancellationReasons: PropTypes.arrayOf({
    displayText: PropTypes.string,
    requestType: PropTypes.string,
    tooltip: PropTypes.string,
  }),
  clearCancellationReasons: PropTypes.func,
  closeSweetAlert: PropTypes.func.isRequired,
  dismissUserNotification: PropTypes.func.isRequired,
  getCancellationReasonsData: PropTypes.func,
  inProgress: PropTypes.bool,
  investorEvents: PropTypes.arrayOf(PropTypes.String),
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onFhlmcBulkSubmit: PropTypes.func,
  onResetData: PropTypes.func,
  openSweetAlert: PropTypes.func,
  populateInvestorDropdown: PropTypes.func,
  preApprovalDropdown: PropTypes.arrayOf(PropTypes.String),
  resetWidget: PropTypes.func.isRequired,
  resultOperation: PropTypes.shape({
    clearData: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    showConfirmButton: PropTypes.bool,
    status: PropTypes.string,
    title: PropTypes.string,
  }),
  selectedCancellationReason: PropTypes.string,
  setSelectedCancellationReasonData: PropTypes.func,
  userNotificationData: PropTypes.shape({
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    message: PropTypes.string,
  }),
};

const mapStateToProps = state => ({
  inProgress: selectors.inProgress(state),
  resultOperation: selectors.resultOperation(state),
  investorEvents: selectors.getInvestorEvents(state),
  userNotificationData: selectors.getUserNotification(state),
  approvalDropdown: selectors.getApprovalEvents(state),
  preApprovalDropdown: selectors.getPreApprovalEvents(state),
  cancellationReasons: selectors.cancellationReasons(state),
  selectedCancellationReason: selectors.getSelectedCancellationReason(state),
});

const mapDispatchToProps = dispatch => ({
  onFhlmcBulkSubmit: operations.onFhlmcCasesSubmit(dispatch),
  onResetData: operations.onResetData(dispatch),
  populateInvestorDropdown: operations.populateInvestorEvents(dispatch),
  closeSweetAlert: operations.closeSweetAlert(dispatch),
  dismissUserNotification: operations.onDismissUserNotification(dispatch),
  resetWidget: widgetoperations.resetWidget(dispatch),
  openSweetAlert: operations.openSweetAlert(dispatch),
  getCancellationReasonsData: operations.getCancellationReasonDetails(dispatch),
  setSelectedCancellationReasonData: operations.setSelectedCancellationReasonData(dispatch),
  clearCancellationReasons: operations.clearCancellationReasons(dispatch),
});

const FhlmcResolveContainer = connect(mapStateToProps, mapDispatchToProps)(FhlmcResolve);

const TestHooks = {
  FhlmcResolve,
};

export { TestHooks };
export default FhlmcResolveContainer;
