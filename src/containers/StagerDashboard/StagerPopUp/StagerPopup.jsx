/* eslint-disable no-nested-ternary */

import React from 'react';
import { connect } from 'react-redux';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { operations as stagerOperations } from 'ducks/stager';
import Button from '@material-ui/core/Button';
import './StagerPopup.css';
import * as R from 'ramda';


class StagerPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSuccess: false,
      checkedData: [],
      isPopupClose: true,
    };
    this.getTotalLoanCount = this.getTotalLoanCount.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.onCloseClick = this.onCloseClick.bind(this);
  }

  onEyeIconClick() {
    this.setState(prevState => ({
      showSuccess: !prevState.showSuccess,
    }));
  }

  onRetryClick() {
    const { checkedData } = this.state;
    const { triggerDocsOutCall, action } = this.props;
    const docsOutPayload = R.map(dataUnit => ({
      evalId: dataUnit.evalId && dataUnit.evalId.toString(),
      taskId: dataUnit.taskId && dataUnit.taskId.toString(),
    }), checkedData);
    const payload = {
      type: 'DOCSOUT STAGER',
      data: docsOutPayload,
    };
    triggerDocsOutCall(payload, action);
  }

  onCloseClick() {
    const { onClearDocsOutAction } = this.props;
    this.setState({
      isPopupClose: false,
    });
    onClearDocsOutAction();
  }

  getTotalLoanCount() {
    const { popupData, action } = this.props;
    this.totalLoansCount = 0;
    popupData.forEach((dataValue) => {
      if (!dataValue.error) {
        this.succeedLoancount = dataValue.data.length;
      }
      this.totalLoansCount += dataValue.data.length;
    });
    this.failedLoancount = this.totalLoansCount - this.succeedLoancount;
    if (this.failedLoancount === 0) {
      setTimeout(() => {
        this.onCloseClick();
      }, 2000);
    }
    return (` ${this.succeedLoancount} / ${this.totalLoansCount} Loans ordered successfully [${action}]`);
  }

  handleCheckbox(event, loanDetails) {
    const { checkedData } = this.state;
    if (event.target.checked) {
      checkedData.push(loanDetails);
    } else {
      const index = checkedData.findIndex(data => data.evalId === loanDetails.evalId);
      checkedData.splice(index, 1);
    }
    this.setState({ checkedData });
  }

  render() {
    const { popupData } = this.props;
    const { showSuccess, checkedData, isPopupClose } = this.state;
    return (
      <div styleName={isPopupClose ? 'open' : 'close'}>
        <ExpansionPanel styleName="expansion-header">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon styleName="expansion-header-title" />} styleName="expansion-title">
            <Typography styleName="expansion-header-title">
              {this.getTotalLoanCount()}
            </Typography>
          </ExpansionPanelSummary>

          {popupData.map(loanDetails => (
            <>
              <ExpansionPanelDetails styleName={!loanDetails.error ? 'expansion-succeedLoan-title' : 'expansion-failedLoan-title'}>
                <Grid
                  container
                >
                  <Grid item style={{ paddingBottom: '0.5rem' }} xs={1}>
                    <span styleName={!loanDetails.error ? 'succeedloan' : 'failedloan'}>
                      {!loanDetails.error ? this.succeedLoancount : this.failedLoancount}
                    </span>
                  </Grid>
                  <Grid item xs={10}>
                    <span styleName="popup-font">{loanDetails.error ? 'Loans failed' : 'Loans ordered successfully'}</span>
                  </Grid>
                  <Grid item xs={1}>
                    <span styleName="popup-font">
                      {!loanDetails.error ? (<div styleName="viewHideIcon"><RemoveRedEyeIcon onClick={() => this.onEyeIconClick()} styleName="eyeicon" /></div>) : (
                        (loanDetails.error && loanDetails.data.length !== 0)
                          ? (
                            <div styleName="retry">
                              <Button color="primary" onClick={() => this.onRetryClick()} variant="contained">
                                Retry
                              </Button>
                            </div>
                          ) : null
                      )}
                    </span>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              <div styleName={loanDetails.error ? 'failed' : `success${showSuccess ? 'View' : 'Hide'}`}>
                {
                  loanDetails.data.map(loanArrayDetails => (
                    <ExpansionPanelDetails styleName="expansion-failedLoan-title">
                      <Grid
                        container
                      >
                        <Grid item xs={1}>
                          {loanDetails.error ? (
                            <Checkbox
                              checked={checkedData.find(
                                data => data.evalId === loanArrayDetails.evalId,
                              )}
                              id={loanArrayDetails.evalId}
                              onChange={event => this.handleCheckbox(event, loanArrayDetails)}
                              style={{ height: '15px', padding: '0px' }}
                            />
                          ) : null}
                        </Grid>
                        <Grid item xs={4}>
                          <span styleName="popup-font">{loanArrayDetails.evalId}</span>
                        </Grid>
                        <Grid item xs={7}>
                          {loanDetails.error ? (
                            <>
                              <WarningIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} styleName="alert-font" />
                              <span style={{ position: 'relative', top: '-4px' }} styleName="popup-font alert-font">
                                {loanArrayDetails.taskId}
                              </span>
                            </>
                          ) : null}
                        </Grid>
                      </Grid>
                    </ExpansionPanelDetails>
                  ))}
              </div>

            </>
          ))
          }
          <Divider />
          <ExpansionPanelActions style={{ padding: '0.5rem' }}>
            <Button onClick={() => this.onCloseClick()} size="small" styleName="popup-font">Close</Button>
          </ExpansionPanelActions>
        </ExpansionPanel>
      </div>
    );
  }
}

StagerPopup.defaultProps = {
  popupData: [],
};

StagerPopup.propTypes = {
  action: PropTypes.string.isRequired,
  onClearDocsOutAction: PropTypes.func.isRequired,
  popupData: PropTypes.arrayOf(
    PropTypes.shape({
      error: PropTypes.bool,
    }),
  ),
  triggerDocsOutCall: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  triggerDocsOutCall: stagerOperations.triggerDocsOutCall(dispatch),
  onClearDocsOutAction: stagerOperations.onClearDocsOutAction(dispatch),
});

export default connect(null, mapDispatchToProps)(StagerPopup);
