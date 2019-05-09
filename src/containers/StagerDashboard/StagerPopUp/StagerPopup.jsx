/* eslint-disable no-unused-vars */
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

      mockArray: [
        {
          loanCount: 2,
          loanStatus: 'success',
        },
        {
          loanCount: 3,
          loanStatus: 'failure',
          loanArray: [{
            loanNumber: 345657564,
            loanText: "EvalSubstatus should be 'Sent For Reject'",
          }],
        },
      ],
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getLoanStatus(status) {
    if (status === 'success') {
      return 'Loans ordered successfully';
    }
    return 'Loans Failed';
  }

  getTotalloanCount() {
    const { mockArray } = this.state;
    const { operationDetails } = this.props;
    let successcount = 0;
    mockArray.forEach((loanDetails) => {
      successcount += loanDetails.loanStatus === 'success' ? loanDetails.loanCount : 0;
    });
    return (` ${successcount} / ${operationDetails.totalCount} Loans ordered successfully [${operationDetails.type}]`);
  }

  render() {
    const { mockArray } = this.state;
    return (
      <div>
        <ExpansionPanel styleName="card-header">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon styleName="card-header-title" />} styleName="card-title">
            <Typography styleName="card-header-title">
              {this.getTotalloanCount()}
            </Typography>
          </ExpansionPanelSummary>

          {mockArray.map(loanDetails => (
            <>
              <ExpansionPanelDetails styleName={loanDetails.loanStatus === 'success' ? 'card-success-title' : 'card-failure-title'}>
                <Grid
                  container
                >
                  <Grid item xs={1}>
                    <span styleName={loanDetails.loanStatus === 'success' ? 'sucessedloan' : 'failedloan'}>{loanDetails.loanCount}</span>
                  </Grid>
                  <Grid item xs={10}>
                    <span styleName="loans-font">{this.getLoanStatus(loanDetails.loanStatus)}</span>
                  </Grid>
                  <Grid item xs={1}>
                    <span styleName="loans-font">
                      {loanDetails.loanStatus === 'success' ? (<RemoveRedEyeIcon styleName="eyeicon" />) : (
                        <Button color="primary" variant="contained">
                          Retry
                        </Button>
                      )}
                    </span>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>

              {loanDetails.loanStatus === 'failure' ? (
                loanDetails.loanArray.map(loanArrayDetails => (
                  <ExpansionPanelDetails styleName="card-failure-title">
                    <Grid
                      container
                    >
                      <Grid item xs={1}>
                        <Checkbox style={{ height: '15px', padding: '0px' }} />
                      </Grid>
                      <Grid item xs={4}>
                        <span styleName="loans-font">{loanArrayDetails.loanNumber}</span>
                      </Grid>
                      <Grid item xs={7}>
                        <WarningIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} styleName="alert-font" />
                        <span style={{ position: 'relative', top: '-4px' }} styleName="loans-font alert-font">
                          {loanArrayDetails.loanText}
                        </span>
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>

                ))
              ) : null}
            </>
          ))
          }
        </ExpansionPanel>
      </div>
    );
  }
}

StagerPopup.propTypes = {
  operationDetails: PropTypes.node.isRequired,
};

export default StagerPopup;
