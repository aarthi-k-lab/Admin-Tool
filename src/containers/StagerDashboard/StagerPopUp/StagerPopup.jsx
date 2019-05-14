/* eslint-disable  */
// eslint-disable
import React from 'react';
import { connect } from 'react-redux';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
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
      checkedBoxes: [],
    }
    this.getTotalloanCount = this.getTotalloanCount.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getLoanStatus(status) {
    if (!status) {
      return 'Loans ordered successfully';
    }
    return 'Loans Failed';
  }

  onEyeIconClick() {
    this.setState(prevState => ({
      showSuccess: !prevState.showSuccess
    }));
  }

  getTotalloanCount() {
    const { popupData, action } = this.props;
    this.totalCount = 0;
    popupData.forEach((dataValue) => {
      if (!dataValue.error) {
        this.successCount = dataValue.data.length;
      }
      this.totalCount += dataValue.data.length;
    });
    this.failureCount = this.totalCount - this.successCount;
    return (` ${this.successCount} / ${this.totalCount} Loans ordered successfully [${action}]`);
  }

  handleCheckbox(e, s) {
    const checkedBoxes = [...this.state.checkedBoxes];
    if (e.target.checked) {
      checkedBoxes.push(s)
    } else {
      const index = checkedBoxes.findIndex((ch) => ch.evalId === s.evalId);
      checkedBoxes.splice(index, 1);
    }
    this.setState({ checkedBoxes });
  }
  onRetryClick() {
    const { checkedBoxes } = this.state;
  }

  onRetryClick() {
    const { checkedBoxes } = this.state;
    const { triggerDocsOutCall, action } = this.props;
    const docsOutPayload = R.map(dataUnit => ({
      evalId: dataUnit['evalId'] && dataUnit['evalId'].toString(),
      taskId: dataUnit.taskId && dataUnit.taskId.toString(),
    }), checkedBoxes);
    const payload = {
      type: 'DOCSOUT STAGER',
      data: docsOutPayload,
    };
    triggerDocsOutCall(payload, action);
  }

  render() {
    const { popupData } = this.props;
    const { showSuccess, checkedBoxes } = this.state;
    return (
      <div>
        <ExpansionPanel styleName="card-header">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon styleName="card-header-title" />} styleName="card-title">
            <Typography styleName="card-header-title">
              {this.getTotalloanCount()}
            </Typography>
          </ExpansionPanelSummary>

          {popupData.map(loanDetails => (
            <>
              <ExpansionPanelDetails styleName={!loanDetails.error ? 'card-success-title' : 'card-failure-title'}>
                <Grid
                  container
                >
                  <Grid item xs={1}>
                    <span styleName={!loanDetails.error ? 'sucessedloan' : 'failedloan'}>
                      {!loanDetails.error ? this.successCount : this.failureCount}
                    </span>
                  </Grid>
                  <Grid item xs={10}>
                    <span styleName="loans-font">{this.getLoanStatus(loanDetails.error)}</span>
                  </Grid>
                  <Grid item xs={1}>
                    <span styleName="loans-font">
                      {!loanDetails.error ? (<RemoveRedEyeIcon onClick={() => this.onEyeIconClick()} styleName="eyeicon" />) : (
                        <Button color="primary" variant="contained" onClick={() => this.onRetryClick()} >
                          Retry
                     </Button>
                      )}
                    </span>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>

              <div styleName={loanDetails.error ? 'failed' : `success${showSuccess ? 'View' : 'Hide'}`}>
                {
                  loanDetails.data.map(loanArrayDetails => (
                    <ExpansionPanelDetails styleName="card-failure-title">
                      <Grid
                        container
                      >
                        <Grid item xs={1}>
                          {loanDetails.error ? (<Checkbox onChange={(e) => this.handleCheckbox(e, loanArrayDetails)}
                            id={loanArrayDetails.evalId}
                            checked={checkedBoxes.find((ch) => ch.evalId === loanArrayDetails.evalId)}
                            style={{ height: '15px', padding: '0px' }} />) : null}
                        </Grid>
                        <Grid item xs={4}>
                          <span styleName="loans-font">{loanArrayDetails.evalId}</span>
                        </Grid>
                        <Grid item xs={7}>
                          {loanDetails.error ? (
                            <>
                              <WarningIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} styleName="alert-font" />
                              <span style={{ position: 'relative', top: '-4px' }} styleName="loans-font alert-font">
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
        </ExpansionPanel>
      </div>
    );
  }
}

StagerPopup.defaultProps = {
  popupData: [],
};

StagerPopup.propTypes = {
  operationDetails: PropTypes.node.isRequired,
  triggerDocsOutCall: PropTypes.func.isRequired,
  popupData: PropTypes.arrayOf(
    PropTypes.shape({
      error: PropTypes.bool,
    }),
  ),
};

const mapDispatchToProps = dispatch => ({
  triggerDocsOutCall: stagerOperations.triggerDocsOutCall(dispatch),
});

export default connect(null, mapDispatchToProps)(StagerPopup);