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
import StagerDetailsTable from '../StagerDetailsTable';


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
    const { triggerDispositionOperationCall, action } = this.props;
    triggerDispositionOperationCall(
      StagerDetailsTable.getDispositionOperationPayload(checkedData), action,
    );
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
    this.succeedLoancount = 0;
    Object.keys(popupData).forEach((status) => {
      if (this.isSucceedLoan(status)) {
        this.succeedLoancount = popupData[status].length;
      }
      this.totalLoansCount += popupData[status].length;
    });
    this.failedLoancount = this.totalLoansCount - this.succeedLoancount;
    if (this.failedLoancount === 0) {
      setTimeout(() => {
        this.onCloseClick();
      }, 5000);
    }
    return (` ${this.succeedLoancount} / ${this.totalLoansCount} Loans ordered successfully [${action}]`);
  }

  handleCheckbox(event, loanDetails) {
    const { checkedData } = this.state;
    if (event.target.checked) {
      checkedData.push({ 'Eval ID': loanDetails.evalId, TKIID: loanDetails.taskId });
    } else {
      const index = checkedData.findIndex(data => data['Eval ID'] === loanDetails.evalId);
      checkedData.splice(index, 1);
    }
    this.setState({ checkedData });
  }

  // eslint-disable-next-line class-methods-use-this
  isSucceedLoan(loanStatus) {
    return R.equals(loanStatus, 'succeedLoans');
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

          {Object.keys(popupData).map(loanStatus => (
            <>
              <ExpansionPanelDetails styleName={this.isSucceedLoan(loanStatus) ? 'expansion-succeedLoan-title' : 'expansion-failedLoan-title'}>
                <Grid
                  container
                >
                  <Grid item style={{ paddingBottom: '0.5rem' }} xs={1}>
                    <span styleName={this.isSucceedLoan(loanStatus) ? 'succeedloan' : 'failedloan'}>
                      {this.isSucceedLoan(loanStatus)
                        ? this.succeedLoancount : this.failedLoancount}
                    </span>
                  </Grid>
                  <Grid item xs={10}>
                    <span styleName="popup-font">{this.isSucceedLoan(loanStatus) ? 'Loans ordered successfully' : 'Loans failed'}</span>
                  </Grid>
                  <Grid item xs={1}>
                    <span styleName="popup-font">
                      {this.isSucceedLoan(loanStatus) ? (<div styleName="eye-icon-div"><RemoveRedEyeIcon onClick={() => this.onEyeIconClick()} styleName="eye-icon" /></div>) : (
                        (!this.isSucceedLoan(loanStatus) && !R.isEmpty(popupData.failedLoans))
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
              <div styleName={!this.isSucceedLoan(loanStatus) ? 'failed' : `success${showSuccess ? 'View' : 'Hide'}`}>
                {
                  popupData[loanStatus].map(details => (
                    <ExpansionPanelDetails styleName="expansion-failedLoan-title">
                      <Grid
                        container
                      >
                        <Grid item xs={1}>
                          {!this.isSucceedLoan(loanStatus) ? (
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
                        <Grid item xs={4}>
                          <span styleName="popup-font">{details.evalId}</span>
                        </Grid>
                        <Grid item xs={7}>
                          {!this.isSucceedLoan(loanStatus) ? (
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
  onClearDocsOutAction: PropTypes.func.isRequired,
  popupData: PropTypes.shape({
    failedLoans: PropTypes.array.isRequired,
    succeedLoans: PropTypes.array.isRequired,
  }),
  triggerDispositionOperationCall: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  triggerDispositionOperationCall: stagerOperations.triggerDispositionOperationCall(dispatch),
  onClearDocsOutAction: stagerOperations.onClearDocsOutAction(dispatch),
});

export default connect(null, mapDispatchToProps)(StagerPopup);
