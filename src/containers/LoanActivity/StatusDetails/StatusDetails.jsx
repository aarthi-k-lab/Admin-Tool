import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ExpandPanel from './ExpandPanel';
import './StatusDetails.css';

class StatusDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    this.renderDetailsCard = this.renderDetailsCard.bind(this);
  }

  renderDetailsCard() {
    const { loanActivityDetails } = this.props;
    return (
      <>
        <div styleName="title-row">
          <div styleName="title-style">
            {loanActivityDetails.title}
          </div>
          <Card>
            <CardContent styleName="card-content">
              <Grid container>
                {loanActivityDetails.statusDetails
                  && loanActivityDetails.statusDetails.map(detail => (
                    <Grid item styleName="item" xs={3}>
                      <span styleName="header-style">{detail.columnName}</span>
                      <span styleName="value-style">{detail.columnValue}</span>
                    </Grid>
                  ))
                }
              </Grid>
            </CardContent>
          </Card>
          <Card>
            {loanActivityDetails.letterSent && loanActivityDetails.letterSent.map(letter => (
              <CardContent style={{ borderBottom: '1px solid rgb(202, 205, 209)' }} styleName="card-contentList">
                <Grid container>
                  <Grid item styleName="item" xs={3}>
                    <span styleName="card-contentHeader-style">{letter.letterSentOnColumn}</span>
                  </Grid>
                  <Grid item styleName="item" xs={2}>
                    <span styleName="card-contentValue-style">{letter.letterSentOn}</span>
                  </Grid>
                  <Grid item styleName="item" xs={4}>
                    <span styleName="card-contentHeader-style">{letter.letterReceivedOnColumn}</span>
                  </Grid>
                  <Grid item styleName="item" xs={2}>
                    <span styleName="card-contentValue-style">{letter.letterReceivedOn}</span>
                  </Grid>
                </Grid>
              </CardContent>
            ))
            }
          </Card>
        </div>
        <ExpandPanel monthlyDetails={loanActivityDetails.monthlyDetails} />
      </>
    );
  }

  render() {
    const { loanActivityDetails } = this.props;
    if (Object.keys(loanActivityDetails).length === 0) {
      return null;
    }
    return (
      this.renderDetailsCard()
    );
  }
}

StatusDetails.propTypes = {
  loanActivityDetails: PropTypes.shape.isRequired,
};

export default StatusDetails;
