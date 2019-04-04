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
    const { monthlyDetails, cardDetails } = this.props;
    return (
      <>
        <div styleName="title-row">
          <div styleName="title-style">
            {cardDetails.title}
          </div>
          <Card>
            <CardContent styleName="card-content">
              <Grid container>
                {cardDetails.statusDetails && cardDetails.statusDetails.map(detail => (
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
            {cardDetails.letterSent && cardDetails.letterSent.map(letter => (
              <CardContent style={{ borderBottom: '1px solid rgb(202, 205, 209)' }} styleName="card-contentList">
                <Grid container>
                  <Grid item styleName="item" xs={3}>
                    <span styleName="card-contentHeader-style">{`${'Trial'} Letter Sent on`}</span>
                  </Grid>
                  <Grid item styleName="item" xs={2}>
                    <span styleName="card-contentValue-style">{letter.letterSentOn}</span>
                  </Grid>
                  <Grid item styleName="item" xs={4}>
                    <span styleName="card-contentHeader-style">{`FHA ${'Trial'} Letter Received on`}</span>
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
        <ExpandPanel monthlyDetails={monthlyDetails} />
      </>
    );
  }

  render() {
    const { monthlyDetails, cardDetails } = this.props;
    if (monthlyDetails.length === 0 && Object.keys(cardDetails).length === 0) {
      return null;
    }
    return (
      this.renderDetailsCard()
    );
  }
}

StatusDetails.propTypes = {
  cardDetails: PropTypes.shape({
    details: PropTypes.string.isRequired,
    month: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  monthlyDetails: PropTypes.shape({
    acceptanceDate: PropTypes.string.isRequired,
    downPayment: PropTypes.string.isRequired,
    receivedDate: PropTypes.string.isRequired,
    sentOn: PropTypes.string.isRequired,
  }).isRequired,
};

export default StatusDetails;
