/* eslint-disable no-unused-vars */
import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Checkbox from '@material-ui/core/Checkbox';
import WarningIcon from '@material-ui/icons/Warning';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './StagerPopup.css';


class StagerPopup extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.getLoanStatus = this.getLoanStatus.bind(this);
    this.state = {

      mockArray: [
        {
          loancount: 2,
          loanStatus: 'success',
        },
        {
          loancount: 3,
          loanStatus: 'failure',
          loanArray: [{
            loannnumber: 345657564,
            loantext: "EvalSubstatus should be 'Sent For Reject'",
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

  getTotalLoanCount() {
    const { mockArray } = this.state;
    let successcount = 0;
    // eslint-disable-next-line no-unused-vars
    let totalloancount = 0;
    mockArray.forEach((loanDetails) => {
      totalloancount += loanDetails.loancount;
      successcount += loanDetails.loanStatus === 'success' ? loanDetails.loancount : 0;
    });
    return (` ${successcount} / ${totalloancount} Loans ordered successfully [SENT FOR REJECT]`);
  }

  render() {
    const { mockArray } = this.state;
    return (
      <div>
        <ExpansionPanel styleName="card-header">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon styleName="card-header-title" />} styleName="card-title">
            <Typography styleName="card-header-title">
              {this.getTotalLoanCount()}
            </Typography>
          </ExpansionPanelSummary>

          {mockArray.map(loanDetails => (
            <>
              <ExpansionPanelDetails styleName="card-success-title">
                <Grid
                  container
                >
                  <Grid item xs={1}>
                    <span styleName="sucessedloan">{loanDetails.loancount}</span>
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
                        <Checkbox style={{ height: '15px' }} />
                      </Grid>
                      <Grid item xs={4}>
                        <span styleName="loans-font">{loanArrayDetails.loannumber}</span>
                      </Grid>
                      <Grid item xs={7}>
                        <span styleName="loans-font alert-font">
                          <WarningIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} styleName="alert-font" />
                          {loanArrayDetails.loantext}
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

export default StagerPopup;
