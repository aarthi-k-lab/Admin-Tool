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
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import { operations, selectors } from 'ducks/tasks-and-checklist';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
// import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import SweetAlert from 'sweetalert2-react';
import { ALERT_PROPS } from '../../models/Alert';

class LabelWithIcon extends React.PureComponent {
  constructor(props) {
    super(props);
    // const { resolutionId } = props;
    this.state = {
      // isclicked: false,
      // searchText: resolutionId,
      canEdit: false,
    };
    this.handleAlert = this.handleAlert.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }


  // componentWillReceiveProps(props) {
  //   const { resolutionId } = props;
  //   this.setState({ searchText: resolutionId });
  // }


  // onSearchTextChange= (event) => {
  //   const re = /^[0-9\b]+$/;
  //   if (event.target.value === '' || re.test(event.target.value)) {
  //     this.setState({ searchText: event.target.value });
  //   }
  // }

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
    const { triggerResolutionIdStats, title } = this.props;
    const auditRuleType = R.contains('Post', title) ? 'post' : 'pre';
    if (resolutionId) {
      triggerResolutionIdStats(resolutionId, auditRuleType);
    }
  }

  handleClick = () => {
    this.setState(prevState => ({
      canEdit: !prevState.canEdit,
      // isclicked: false,
    }));
  };

  handleFilterClick = (value) => {
    const { filter, triggerFilterRules } = this.props;
    triggerFilterRules(value === filter ? null : value);
  }

  handleValueChange = (event) => {
    this.setState({ resolutionText: event.target.value });
  };

  handleAlert() {
    const { ruleResponse, clearRuleResponse } = this.props;
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
      passedRules, failedRules, isAssigned, text, slaRulesProcessed,
      filter, resolutionData, showContinueMyReview,
    } = this.props;
    const sortedResData = R.sort(R.descend(R.prop('resolutionId')), resolutionData);
    const { resolutionText } = this.state;
    let selectedValue = sortedResData[0].resolutionId;
    if (text && !R.isEmpty(text)) {
      selectedValue = text;
    }
    if (resolutionText && !R.isEmpty(resolutionText)) {
      selectedValue = resolutionText;
    }
    this.setState({ resolutionText: selectedValue });
    return (
      <>
        <Grid container styleName="customresolutiongrid">
          <Grid xs={10}>
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
          </Grid>
        </Grid>

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
        {this.handleAlert()}

      </>
    );
  }
}

LabelWithIcon.propTypes = {
  allRules: PropTypes.shape.isRequired,
  clearRuleResponse: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  failedRules: PropTypes.shape.isRequired,
  filter: PropTypes.bool.isRequired,
  handleValueChange: PropTypes.func.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  passedRules: PropTypes.shape.isRequired,
  resolutionData: PropTypes.arrayOf(PropTypes.string).isRequired,
  resolutionId: PropTypes.string.isRequired,
  resolutionText: PropTypes.string.isRequired,
  ruleResponse: PropTypes.shape.isRequired,
  showContinueMyReview: PropTypes.bool.isRequired,
  slaRulesProcessed: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  triggerFilterRules: PropTypes.string.isRequired,
  triggerResolutionIdStats: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  triggerResolutionIdStats: operations.triggerResolutionIdStats(dispatch),
  triggerFilterRules: operations.triggerFilterRules(dispatch),
  clearRuleResponse: operations.clearRuleResponse(dispatch),
});

const mapStateToProps = state => ({
  slaRulesProcessed: selectors.getSlaRulesProcessed(state),
  resolutionId: selectors.getResolutionId(state),
  filter: selectors.getFilter(state),
  ruleResponse: selectors.getRuleResponse(state),
  allRules: selectors.getChecklistItems(state),
  passedRules: selectors.getPassedRules(state),
  failedRules: selectors.getFailedRules(state),
  isAssigned: dashboardSelectors.isAssigned(state),
  showContinueMyReview: dashboardSelectors.showContinueMyReview(state),
});


export default connect(mapStateToProps, mapDispatchToProps)(LabelWithIcon);
