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
    this.state = {
      mockArray: [
        {
          id: 1,
          loannumber: 2345675641234234567,
          loantext: "EvalSubstatus should be 'Sent For Reject'",
          loancheck: true,

        },
        {
          id: 2,
          loannumber: 2345675641234234567,
          loantext: "Resolutionstatus should be 'Rejected'",
          loancheck: true,

        },
        {
          id: 3,
          loannumber: 2345675641234234567,
          loantext: "EvalSubstatus should be 'Sent For Reject'",
          loancheck: false,

        },
      ],
    };
  }


  render() {
    const { mockArray } = this.state;
    return (
      <div>
        <ExpansionPanel styleName="card-header">
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon styleName="card-header-title" />} styleName="card-title">
            <Typography styleName="card-header-title">2/5 Loans ordered successfully [SENT FOR REJECT]</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails styleName="card-success-title">
            <Grid
              container
            >
              <Grid item xs={1}>
                <span styleName="sucessedloan">2</span>
              </Grid>
              <Grid item xs={10}>
                <span styleName="loans-font"> Loans ordered successfully</span>
              </Grid>
              <Grid item xs={1}>
                <span styleName="loans-font">
                  <RemoveRedEyeIcon styleName="eyeicon" />
                </span>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>

          <ExpansionPanelDetails styleName="card-failure-title">
            <Grid
              container
            >
              <Grid item xs={1}>
                <span styleName="failedloan">2</span>
              </Grid>
              <Grid item xs={10}>
                <span styleName="loans-font"> Loans Failed</span>
              </Grid>
              <Grid item xs={1}>
                <span styleName="loans-font">
                  <Button color="primary" variant="contained">
                    Retry
                  </Button>
                </span>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
          {
            mockArray.map(loanDetails => (
              <ExpansionPanelDetails styleName="card-failure-title">
                <Grid
                  container
                >
                  <Grid item xs={1}>
                    <Checkbox checked={loanDetails.loancheck} style={{ height: '15px', padding: '0px' }} />
                  </Grid>
                  <Grid item xs={4}>
                    <span styleName="loans-font">{loanDetails.loannumber}</span>
                  </Grid>
                  <Grid item xs={7}>
                    <WarningIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} styleName="alert-font" />
                    <span style={{ position: 'relative', top: '-4px' }} styleName="loans-font alert-font">
                      {loanDetails.loantext}
                    </span>
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            ))
          }

        </ExpansionPanel>
      </div>
    );
  }
}

export default StagerPopup;
