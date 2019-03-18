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
    const { details } = this.props;
    return (
      <div styleName="parent">
        <div styleName="title-style">
          {details.title}
        </div>
        <br />
        <div styleName="card">
          <Card>
            <CardContent>
              <Grid container spacing={24} styleName="header-Name">
                {details.trailDetails.map(detail => (
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
      </div>
    );
  }

  render() {
    return (
      this.renderDetailsCard()
    );
  }
}

TrailDetails.propTypes = {
  details: PropTypes.shape({
    acceptanceDate: PropTypes.string.isRequired,
    downPayment: PropTypes.string.isRequired,
    receivedDate: PropTypes.string.isRequired,
    sentOn: PropTypes.string.isRequired,
  }).isRequired,
};

export default TrailDetails;
