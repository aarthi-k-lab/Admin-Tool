import React from 'react';
import PropTypes from 'prop-types';
// import EditRoundedIcon from '@material-ui/icons/EditRounded';
import * as R from 'ramda';
// import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import './SlaHeader.css';
import { selectors as dashboardSelectors, operations as dashboardOperations } from 'ducks/dashboard';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import SweetAlert from 'sweetalert2-react';
import SweetAlertBox from 'components/SweetAlertBox';
import { ALERT_PROPS } from '../../models/Alert';

class LabelWithIcon extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      canEdit: false,
    };
    this.handleAlert = this.handleAlert.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handlePushDataClick = this.handlePushDataClick.bind(this);
    this.handleSweetAlertClose = this.handleSweetAlertClose.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { resolutionText } = state;
    if (resolutionText) {
      return null;
    }
    const {
      resolutionData, text, title, triggerSetSLAvalues,
    } = props;
    const sortedResData = R.sort(R.descend(R.prop('resolutionId')), resolutionData);
    let selectedValue = sortedResData[0] ? sortedResData[0].resolutionId : null;
    if (text && !R.isEmpty(text)) {
      selectedValue = text;
    }
    if (!R.isEmpty(selectedValue) && !R.isNil(selectedValue)) {
      triggerSetSLAvalues(selectedValue, title);
    }
    return { resolutionText: selectedValue };
  }

  componentWillUnmount() {
    const { triggerFilterRules } = this.props;
    triggerFilterRules(null);
  }

  getAlertProps = () => {
    const {
      ruleResponse, allRules, passedRules, failedRules,
    } = this.props;
    if (R.has('error', ruleResponse)) {
      return ALERT_PROPS.SOMETHING_WENT_WRONG;
    }

    if (R.has('message', ruleResponse)) {
      return ALERT_PROPS.INVALID_RESOLUTION_ID;
    }

    if (allRules && allRules.length === passedRules.length) {
      return ALERT_PROPS.ALL_RULES_PASSED;
    }

    if (allRules && allRules.length === failedRules.length) {
      return ALERT_PROPS.ALL_RULES_FAILED;
    }

    return {
      show: false,
    };
  };

  handleRunAuditRulesClick = () => {
    const { resolutionText: resolutionId } = this.state;
    const { triggerResolutionIdStats, title, triggerSetSLAvalues } = this.props;
    const auditRuleType = R.contains('Post', title) ? 'post' : 'pre';
    triggerSetSLAvalues(resolutionId, auditRuleType);
    if (resolutionId) {
      triggerResolutionIdStats(resolutionId, auditRuleType);
    }
  }

  handlePushDataClick = () => {
    const { triggerPushData } = this.props;
    triggerPushData();
  }

  handleClick = () => {
    this.setState(prevState => ({
      canEdit: !prevState.canEdit,
    }));
  };

  handleFilterClick = (value) => {
    const { filter, triggerFilterRules } = this.props;
    triggerFilterRules(value === filter ? null : value);
  }

  handleValueChange = (event) => {
    const { title, triggerSetSLAvalues } = this.props;
    this.setState({ resolutionText: event.target.value });
    triggerSetSLAvalues(event.target.value, title);
  };

  handleSweetAlertClose = () => {
    const { closeSweetAlert } = this.props;
    closeSweetAlert();
  }

  handleAlert() {
    const { ruleResponse, clearRuleResponse, resultData } = this.props;
    if (!R.isEmpty(resultData)) {
      return (
        <SweetAlertBox
          confirmButtonColor="#004261"
          message={resultData.status}
          onConfirm={() => this.handleSweetAlertClose()}
          show={resultData.isOpen}
          showConfirmButton={resultData.showConfirmButton}
          title={resultData.title}
          type={resultData.level}
        />
      );
    }
    if (ruleResponse) {
      const props = this.getAlertProps(ruleResponse);
      return (
        <SweetAlert
          imageHeight="500"
          onConfirm={() => clearRuleResponse()}
          padding="3em"
          width="600"
          {...props}
        />
      );
    }
    return null;
  }

  render() {
    const {
      passedRules, failedRules, isAssigned, slaRulesProcessed, resolutionData,
      filter, showContinueMyReview, triggerHeader,
      showPushDataButton, enablePushDataButton, disablePushData, isAllRulesPassed,
    } = this.props;
    const { resolutionText: selectedValue } = this.state;
    const sortedResData = R.sort(R.descend(R.prop('resolutionId')), resolutionData);
    const disabled = enablePushDataButton
      ? (disablePushData || !isAllRulesPassed || !isAssigned || showContinueMyReview) : true;
    return (
      <>
        <Grid container styleName="customresolutiongrid">
          <Grid xs={9}>
            <FormControl style={{ width: 180 }}>
              <InputLabel style={{ fontSize: 13 }}>Select ResolutionId</InputLabel>
              <Select
                onChange={event => this.handleValueChange(event)}
                value={selectedValue}
              >
                {
                  sortedResData.map(
                    items => (
                      <MenuItem value={items.resolutionId}>
                        {items.resolutionId}
                        {' -- '}
                        {items.status}
                      </MenuItem>
                    ),
                  )
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            {!showPushDataButton ? (
              <Button
                className="material-ui-button"
                color="primary"
                disabled={!isAssigned || showContinueMyReview || !slaRulesProcessed}
                onClick={() => this.handleRunAuditRulesClick()}
                style={{ margin: '13px 0px 0px 0px' }}
                styleName="get-next"
                variant="contained"
              >
                RUN AUDIT RULES
              </Button>
            )
              : (
                <Button
                  className="material-ui-button"
                  color="primary"
                  disabled={disabled}
                  onClick={() => this.handlePushDataClick()}
                  style={triggerHeader ? { margin: '13px 19px 0px 0px' } : { margin: '13px 0px 0px 0px' }}
                  styleName="get-next"
                  variant="contained"
                >
                  PUSH DATA
                </Button>
              )
            }
          </Grid>
        </Grid>
        {!showPushDataButton && (
          <Grid container styleName="customgrid">
            <Grid xs={8}>
              <span>
                RUN CHECK AUDIT
              </span>
            </Grid>

            <Grid styleName="customalign" xs={2}>
              <Button
                disabled={passedRules.length === 0}
                onClick={() => this.handleFilterClick(true)}
                style={{ margin: '0px 9px 0px 9.5rem' }}
                styleName={filter ? 'statusbtnClicked' : 'statusbtn'}
                variant="contained"
              >
                Passed
                <b styleName="customfont">{passedRules.length}</b>
              </Button>

            </Grid>
            <Grid styleName="customalign" xs={2}>
              <Button
                disabled={failedRules.length === 0}
                onClick={() => this.handleFilterClick(false)}
                style={{ margin: '0px 8px 0px 0px' }}
                styleName={filter === false ? 'statusbtnClicked' : 'statusbtn'}
                variant="contained"
              >
                Failed
                <b styleName="customfont">{failedRules.length}</b>
              </Button>
            </Grid>
          </Grid>
        )
        }
        {this.handleAlert()}

      </>
    );
  }
}

LabelWithIcon.defaultProps = {
  triggerHeader: false,
};

LabelWithIcon.propTypes = {
  allRules: PropTypes.shape.isRequired,
  clearRuleResponse: PropTypes.func.isRequired,
  closeSweetAlert: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  disablePushData: PropTypes.bool.isRequired,
  enablePushDataButton: PropTypes.bool.isRequired,
  failedRules: PropTypes.shape.isRequired,
  filter: PropTypes.bool.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  isAllRulesPassed: PropTypes.bool.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  passedRules: PropTypes.shape.isRequired,
  resolutionData: PropTypes.arrayOf(PropTypes.string).isRequired,
  resolutionId: PropTypes.string.isRequired,
  resolutionText: PropTypes.string.isRequired,
  resultData: PropTypes.shape({
    clearData: PropTypes.string,
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    showConfirmButton: PropTypes.bool,
    status: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  ruleResponse: PropTypes.shape.isRequired,
  showContinueMyReview: PropTypes.bool.isRequired,
  showPushDataButton: PropTypes.bool.isRequired,
  slaRulesProcessed: PropTypes.bool.isRequired,
  taskCode: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  triggerFilterRules: PropTypes.string.isRequired,
  triggerHeader: PropTypes.bool,
  triggerPushData: PropTypes.func.isRequired,
  triggerResolutionIdStats: PropTypes.func.isRequired,
  triggerSetSLAvalues: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  triggerResolutionIdStats: operations.triggerResolutionIdStats(dispatch),
  triggerFilterRules: operations.triggerFilterRules(dispatch),
  clearRuleResponse: operations.clearRuleResponse(dispatch),
  triggerSetSLAvalues: operations.triggerSetSLAvalues(dispatch),
  triggerPushData: operations.triggerPushData(dispatch),
  closeSweetAlert: dashboardOperations.closeSweetAlert(dispatch),
});

const mapStateToProps = state => ({
  slaRulesProcessed: selectors.getSlaRulesProcessed(state),
  resolutionId: selectors.getResolutionId(state),
  filter: selectors.getFilter(state),
  ruleResponse: selectors.getRuleResponse(state),
  allRules: selectors.getChecklistItems(state),
  passedRules: selectors.getPassedRules(state),
  failedRules: selectors.getFailedRules(state),
  isAllRulesPassed: selectors.getRulesResponse(state),
  isAssigned: dashboardSelectors.isAssigned(state),
  showContinueMyReview: dashboardSelectors.showContinueMyReview(state),
  resultData: dashboardSelectors.resultOperation(state),
  disablePushData: dashboardSelectors.getDisablePushData(state),
});


export default connect(mapStateToProps, mapDispatchToProps)(LabelWithIcon);
