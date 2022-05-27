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
import './FHLMCWidget.css';
import * as R from 'ramda';
import { PropTypes } from 'prop-types';
import CustomTable from 'components/CustomTable';
import getters from 'models/Headers';
import FHLMCDataInsight from '../../containers/Dashboard/FhlmcResolve/FHLMCDataInsight';
import {
  ELIGIBLE, INELIGIBLE, NOCALL, FHLMC,
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
  }

  componentDidMount() {
    const { populateInvestorDropdown } = this.props;
    populateInvestorDropdown(FHLMC);
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
        maxWidth="lg"
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
    const { investorEvents, stagerTaskName, requestTypeData } = this.props;
    const requestType = R.project(['requestType', 'displayText'], investorEvents);
    const handledRequestType = !R.equals(R.pathOr('', ['activeTile'], stagerTaskName), 'Investor Settlement') ? R.reject(e => e.requestType === 'SETReq')(requestType) : requestType;
    const { isOpen } = this.state;
    return (
      <>
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
        {this.getCancellationReason()}
        <div styleName="divider">
          <Divider />
        </div>
      </>
    );
  }

  handleCancelReasons = (event) => {
    const {
      setSelectedCancellationReasonData,
    } = this.props;
    setSelectedCancellationReasonData(event.target.value);
  }


  handleRequestType = (event) => {
    const {
      setRequestTypeData, resolutionId, onFhlmcBulkSubmit, resultData,
      getCancellationReasonsData, clearCancellationReasons,
    } = this.props;
    if (R.equals(event.target.value, 'CXLReq')) {
      getCancellationReasonsData(); // populate Cancellation Reasons
    } else {
      clearCancellationReasons();
    }
    setRequestTypeData(event.target.value);
    if (R.has('message', R.head(resultData))) {
      const payload = {
        caseIds: [resolutionId],
        requestType: event.target.value,
        requestIdType: '',
      };
      onFhlmcBulkSubmit(payload);
    }
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
          isWidget
          portfolioCode={portfolioCode}
          selectedCancellationReason={selectedCancellationReason}
          selectedRequestType={requestTypeData}
          submitCases
        />

      </section>
    );
  }
}

FHLMCWidget.defaultProps = {
  populateInvestorDropdown: () => { },
  investorEvents: [],
  resultData: [],
  resultOperation: {},
  requestTypeData: '',
  stagerTaskName: {},
  onFhlmcModHistoryPopup: {},
  fhlmcModHistoryData: null,
  onTablePopupDataClear: {},
  getCancellationReasonsData: {},
  cancellationReasons: [],
  selectedCancellationReason: '',
  setSelectedCancellationReasonData: {},
  clearCancellationReasons: {},
};

FHLMCWidget.propTypes = {
  cancellationReasons: PropTypes.arrayOf({
    displayText: PropTypes.string,
    requestType: PropTypes.string,
    tooltip: PropTypes.string,
  }),
  clearCancellationReasons: PropTypes.func,
  closeSweetAlert: PropTypes.func.isRequired,
  eligibleData: PropTypes.string.isRequired,
  fhlmcModHistoryData: PropTypes.arrayOf(PropTypes.shape({})),
  getCancellationReasonsData: PropTypes.func,
  investorEvents: PropTypes.arrayOf(PropTypes.String),
  onFhlmcBulkSubmit: PropTypes.func.isRequired,
  onFhlmcModHistoryPopup: PropTypes.func,
  onTablePopupDataClear: PropTypes.func,
  populateInvestorDropdown: PropTypes.func,
  requestTypeData: PropTypes.string,
  resolutionId: PropTypes.string.isRequired,
  resultData: PropTypes.arrayOf({
    caseId: PropTypes.string,
    message: PropTypes.string,
  }),
  resultOperation: PropTypes.shape({
    clearData: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    showConfirmButton: PropTypes.bool,
    status: PropTypes.string,
    title: PropTypes.string,
  }),
  selectedCancellationReason: PropTypes.string,
  setRequestTypeData: PropTypes.func.isRequired,
  setSelectedCancellationReasonData: PropTypes.func,
  stagerTaskName: PropTypes.shape(),
};

const mapStateToProps = state => ({
  cancellationReasons: selectors.cancellationReasons(state),
  fhlmcModHistoryData: selectors.getFhlmcModHistory(state),
  investorEvents: selectors.getInvestorEvents(state),
  resultOperation: selectors.resultOperation(state),
  stagerTaskName: selectors.stagerTaskName(state),
  eligibleData: selectors.eligibleData(state),
  requestTypeData: selectors.getRequestTypeData(state),
  resolutionId: selectors.resolutionId(state),
  resultData: selectors.resultData(state),
  selectedCancellationReason: selectors.getSelectedCancellationReason(state),
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
});

export { FHLMCWidget };

export default connect(mapStateToProps, mapDispatchToProps)(FHLMCWidget);
