/* eslint-disable  */
// eslint-disable
import React from 'react';
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
import Button from '@material-ui/core/Button';
import './StagerPopup.css';


class StagerPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSuccess: false,
    }
    this.getTotalloanCount = this.getTotalloanCount.bind(this);
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

  render() {
    console.log('Stager popup', this.props);
    const { popupData } = this.props;
    const { showSuccess } = this.state;
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
                  <Grid item xs={1} style={{ paddingBottom: '0.5rem'}}>
                    <span styleName={!loanDetails.error ? 'sucessedloan' : 'failedloan'}>
                    {!loanDetails.error ? this.successCount : this.failureCount}
                  </span>
                </Grid>
                <Grid item xs={10}>
                  <span styleName="loans-font">{loanDetails.error ? 'Loans failed' : 'Loans ordered successfully'}</span>
                </Grid>
                <Grid item xs={1}>
                  <span styleName="loans-font">
                    {!loanDetails.error ? (<div styleName='viewHideIcon'><RemoveRedEyeIcon onClick={() => this.onEyeIconClick()} styleName="eyeicon" /></div>) : (
                      (loanDetails.error && loanDetails.data.length !== 0) ?
                        (
                          <div styleName='retry'>
                            <Button color="primary" variant="contained">
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
                  <ExpansionPanelDetails styleName="card-failure-title">
                    <Grid container>
                      <Grid item xs={1}>
                        {loanDetails.error ? (<Checkbox style={{ height: '15px', padding: '0px' }} />) : null}
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
  popupData: PropTypes.arrayOf(
    PropTypes.shape({
      error: PropTypes.bool,
    }),
  ),
};

export default StagerPopup;
