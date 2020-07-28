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
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import Button from '@material-ui/core/Button';
import './StagerPopup.css';
import * as R from 'ramda';
import StagerDetailsTable from '../StagerDetailsTable';


class StagerPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSuccess: false,
      checkedData: [],
      isPopupClose: true,
      expandPopup: true,
      enableRetryBtn: true,
      isclicked: 0,
    };
    this.expandValue = false;
  }

  onEyeIconClick() {
    this.setState(prevState => ({
      showSuccess: !prevState.showSuccess,
    }));
  }

  onRetryClick() {
    const { checkedData } = this.state;
    const {
      triggerDispositionOperationCall, action, onClearDocGenAction, getStagerGroup,
    } = this.props;
    triggerDispositionOperationCall(
      StagerDetailsTable.getDispositionOperationPayload(checkedData, getStagerGroup), action,
    );
    onClearDocGenAction();
    this.setState({ enableRetryBtn: true });
  }

  onCloseClick() {
    const { onClearDocGenAction } = this.props;
    this.setState({
      isPopupClose: false,
    });
    onClearDocGenAction();
  }

  getTotalLoanCount() {
    const { popupData, action } = this.props;
    this.totalLoansCount = 0;
    this.succeededLoancount = 0;
    Object.keys(popupData).forEach((status) => {
      if (this.isSucceededLoan(status)) {
        this.succeededLoancount = popupData[status].length;
      }
      this.totalLoansCount += popupData[status].length;
    });
    this.failedLoancount = this.totalLoansCount - this.succeededLoancount;
    if (this.failedLoancount === 0) {
      setTimeout(() => {
        this.onCloseClick();
      }, 5000);
    }
    const { isclicked } = this.state;
    if (isclicked === 0) {
      this.expandValue = this.failedLoancount !== 0;
    }
    return ({
      totalCountText: `${this.succeededLoancount} / ${this.totalLoansCount} Loans ordered successfully [${action}]`,
      failedCounts: this.failedLoancount,
    });
  }

  handleCheckbox(event, loanDetails) {
    const { checkedData } = this.state;
    if (event.target.checked) {
      checkedData.push({ 'Eval ID': loanDetails.evalId, TKIID: loanDetails.taskId, 'Loan Number': loanDetails.loanNumber });
      this.enableRetryBtn = false;
    } else {
      const index = checkedData.findIndex(data => data['Eval ID'] === loanDetails.evalId);
      checkedData.splice(index, 1);
      this.enableRetryBtn = true;
    }
    this.setState({ checkedData, enableRetryBtn: this.enableRetryBtn });
  }

  // eslint-disable-next-line class-methods-use-this
  isSucceededLoan(loanStatus) {
    return R.equals(loanStatus, 'hitLoans');
  }

  handlePopUp() {
    const { expandPopup, isclicked } = this.state;
    this.expandValue = !this.expandValue;
    this.setState({ expandPopup: !expandPopup, isclicked: isclicked + 1 });
  }

  render() {
    const { popupData } = this.props;
    const {
      showSuccess, checkedData,
      isPopupClose, expandPopup,
      enableRetryBtn,
    } = this.state;
    const { totalCountText, failedCounts } = this.getTotalLoanCount();
    return (
      <div styleName={isPopupClose ? 'open' : 'close'}>
        <ExpansionPanel expanded={this.expandValue} onChange={() => this.handlePopUp(expandPopup)} styleName="expansion-header">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon styleName={failedCounts === 0 ? 'expansion-header-Icon' : 'expansion-header-title'} />} styleName="expansion-title">
            <Typography styleName="expansion-header-title">
              {totalCountText}
            </Typography>
          </ExpansionPanelSummary>

          {Object.keys(popupData).sort().map(loanStatus => (
            <>
              <ExpansionPanelDetails styleName={this.isSucceededLoan(loanStatus) ? 'expansion-succeededLoan-title' : 'expansion-failedLoan-title'}>
                <Grid
                  container
                >
                  <Grid item style={{ paddingBottom: '0.5rem' }} xs={1}>
                    <span styleName={this.isSucceededLoan(loanStatus) ? 'succeededLoan' : 'failedLoan'}>
                      {this.isSucceededLoan(loanStatus)
                        ? this.succeededLoancount : this.failedLoancount}
                    </span>
                  </Grid>
                  <Grid item xs={10}>
                    <span styleName="popup-font">{this.isSucceededLoan(loanStatus) ? 'Loans ordered successfully' : 'Loans failed'}</span>
                  </Grid>
                  <Grid item xs={1}>
                    <span styleName="popup-font">
                      {this.isSucceededLoan(loanStatus) ? (<div styleName="eye-icon-div"><RemoveRedEyeIcon onClick={() => this.onEyeIconClick()} styleName="eye-icon" /></div>) : (
                        (!this.isSucceededLoan(loanStatus) && !R.isEmpty(popupData.missedLoans))
                          ? (
                            <div styleName="retry">
                              <Button color="primary" disabled={enableRetryBtn} onClick={() => this.onRetryClick()} variant="contained">
                                Retry
                              </Button>
                            </div>
                          ) : null
                      )}
                    </span>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              <div styleName={!this.isSucceededLoan(loanStatus) ? 'failed' : `success${showSuccess ? 'View' : 'Hide'}`}>
                {
                  popupData[loanStatus].map(details => (
                    <ExpansionPanelDetails styleName="expansion-failedLoan-title">
                      <Grid
                        container
                      >
                        <Grid item xs={1}>
                          {!this.isSucceededLoan(loanStatus) ? (
                            <Checkbox
                              checked={checkedData.find(
                                data => data.evalId === details.evalId,
                              )}
                              id={details.evalId}
                              onChange={event => this.handleCheckbox(event, details)}
                              style={{ height: '15px', padding: '0px' }}
                            />
                          ) : null}
                        </Grid>
                        <Grid item xs={2}>
                          <span styleName="popup-font">{details.loanNumber}</span>
                        </Grid>
                        <Grid item xs={2}>
                          <span styleName="popup-font">{details.evalId}</span>
                        </Grid>
                        <Grid item xs={7}>
                          {!this.isSucceededLoan(loanStatus) ? (
                            <>
                              <WarningIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} styleName="alert-font" />
                              <span style={{ position: 'relative', top: '-4px' }} styleName="popup-font alert-font">
                                {details.message}
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
  popupData: {},
};

StagerPopup.propTypes = {
  action: PropTypes.string.isRequired,
  getStagerGroup: PropTypes.func.isRequired,
  onClearDocGenAction: PropTypes.func.isRequired,
  popupData: PropTypes.shape({
    hitLoans: PropTypes.array.isRequired,
    missedLoans: PropTypes.array.isRequired,
  }),
  triggerDispositionOperationCall: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  getStagerGroup: stagerSelectors.getStagerGroup(state),
});

const mapDispatchToProps = dispatch => ({
  triggerDispositionOperationCall: stagerOperations.triggerDispositionOperationCall(dispatch),
  onClearDocGenAction: stagerOperations.onClearDocGenAction(dispatch),
});

const TestHooks = {
  StagerPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(StagerPopup);

export { TestHooks };
