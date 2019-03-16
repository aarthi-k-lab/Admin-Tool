/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import './TrailDetails.css';
import CardCreator from 'containers/Dashboard/BackEndDisposition/CardCreator';

const items = [
  {
    id: 'ID1',
    name: 'N1',
    activities: [{ id: 'I1', activityName: 'AN1', verbiage: 'V1' }],
    labelDisplay: 'LD1',
    expanded: false,
  },
  {
    id: 'ID2',
    name: 'N2',
    activities: [{ id: 'I2', activityName: 'AN2', verbiage: 'V2' }],
    labelDisplay: 'LD2',
    expanded: false,
  },
];


const TrailDetails = ({ details }) => (
  <div>
    <Card>
      <CardContent>
        <div styleName="trail-detail">
          <Typography color="textSecondary" gutterBottom>
            Trail Letter Sent On
            <div styleName="field-value">{details.sentOn}</div>
          </Typography>
          <div styleName="inner-columns">
            <Typography color="textSecondary" gutterBottom>
              Acceptance Date
              <div styleName="field-value">{details.acceptanceDate}</div>
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              DownPayment
              <div styleName="field-value">{details.downPayment}</div>
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              FHA Trail Letter Received
              <div styleName="field-value">{details.receivedDate}</div>
            </Typography>
          </div>
        </div>
      </CardContent>
    </Card>
    <button
      styleName="OperateButton"
      type="submit"
    >
      Expand ALL
    </button>
    {items.map(m => (
      <CardCreator
        status={m}
      />
    ))}
  </div>
);


TrailDetails.propTypes = {
  details: PropTypes.shape({
    acceptanceDate: PropTypes.string.isRequired,
    downPayment: PropTypes.string.isRequired,
    receivedDate: PropTypes.string.isRequired,
    sentOn: PropTypes.string.isRequired,
  }).isRequired,
};

export default TrailDetails;
