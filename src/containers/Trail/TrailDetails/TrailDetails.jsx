/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import './TrailDetails.css';
// import CardCreator from 'containers/Dashboard/BackEndDisposition/CardCreator';
import Grid from '@material-ui/core/Grid';
import ExpandPanel from './ExpandPanel';

// const items = [
//   {
//     id: 'ID1',
//     name: 'N1',
//     activities: [{ id: 'I1', activityName: 'AN1', verbiage: 'V1' }],
//     labelDisplay: 'LD1',
//     expanded: false,
//   },
//   {
//     id: 'ID2',
//     name: 'N2',
//     activities: [{ id: 'I2', activityName: 'AN2', verbiage: 'V2' }],
//     labelDisplay: 'LD2',
//     expanded: false,
//   },
// ];
class TrailDetails extends React.PureComponent {
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
            <CardContent>
              <Grid container styleName="header-Name">
                {cardDetails.trailDetails && cardDetails.trailDetails.map(detail => (
                  <Grid item xs={3}>
                    <span styleName="header-style">{detail.columnName}</span>
                    <br />
                    <br />
                    <span styleName="value-style">{detail.columnValue}</span>
                  </Grid>
                ))
                }
              </Grid>
            </CardContent>
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

TrailDetails.propTypes = {
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

export default TrailDetails;
