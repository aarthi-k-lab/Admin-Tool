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
import './FHLMCWidget.css';
import * as R from 'ramda';
import { PropTypes } from 'prop-types';
import FHLMCDataInsight from '../../containers/Dashboard/FhlmcResolve/FHLMCDataInsight';
import { ELIGIBLE, INELIGIBLE, NOCALL } from '../../constants/fhlmc';


const eligibilityIndicator = {
  Eligible: ELIGIBLE,
  Ineligible: INELIGIBLE,
  'No Call': NOCALL,
};

class FHLMCWidget extends Component {
  constructor(props) {
    super(props);
    this.handleRequestType = this.handleRequestType.bind(this);
    this.renderCategoryDropDown = this.renderCategoryDropDown.bind(this);
  }

  componentDidMount() {
    const { populateInvestorDropdown } = this.props;
    populateInvestorDropdown();
  }

  renderCategoryDropDown = () => {
    const { investorEvents, stagerTaskName, requestTypeData } = this.props;
    const requestType = R.compose(R.uniq, R.pluck('requestType'), R.flatten)(investorEvents);
    const handledRequestType = !R.equals(R.pathOr('', ['activeTile'], stagerTaskName), 'Investor Settlement') ? R.reject(R.equals('SETReq'))(requestType) : requestType;
    return (
      <>
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
              {handledRequestType.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div styleName="divider">
          <Divider />
        </div>
      </>
    );
  }

  handleRequestType = (event) => {
    const {
      setRequestTypeData, resolutionId, onFhlmcBulkSubmit, resultData,
    } = this.props;
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

  render() {
    const {
      resultOperation,
      investorEvents,
      requestTypeData,
      eligibleData,
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
};

FHLMCWidget.propTypes = {
  closeSweetAlert: PropTypes.func.isRequired,
  eligibleData: PropTypes.string.isRequired,
  investorEvents: PropTypes.arrayOf(PropTypes.String),
  onFhlmcBulkSubmit: PropTypes.func.isRequired,
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
  setRequestTypeData: PropTypes.func.isRequired,
  stagerTaskName: PropTypes.shape(),
};

const mapStateToProps = state => ({
  investorEvents: selectors.getInvestorEvents(state),
  resultOperation: selectors.resultOperation(state),
  stagerTaskName: selectors.stagerTaskName(state),
  eligibleData: selectors.eligibleData(state),
  requestTypeData: selectors.getRequestTypeData(state),
  resolutionId: selectors.resolutionId(state),
  resultData: selectors.resultData(state),
});

const mapDispatchToProps = dispatch => ({
  closeSweetAlert: operations.closeSweetAlert(dispatch),
  populateInvestorDropdown: operations.populateInvestorEvents(dispatch),
  setRequestTypeData: operations.setRequestTypeDataOperation(dispatch),
  onFhlmcBulkSubmit: operations.onFhlmcCasesSubmit(dispatch),
});

export { FHLMCWidget };

export default connect(mapStateToProps, mapDispatchToProps)(FHLMCWidget);
