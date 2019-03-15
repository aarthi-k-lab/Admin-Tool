/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import TrailDetails from './TrailDetails';
import './Trail.css';

const details = {
  sentOn: '11/02/95',
  acceptanceDate: '11/02/95',
  downPayment: '11/02/95',
  receivedDate: '11/02/95',
};

class Trail extends React.PureComponent {
  render() {
    return (
      <div styleName="parent">
        <div />
        <div styleName="detail-parent">
          <TrailDetails details={details} />
        </div>
        <div />
      </div>
    );
  }
}

export default Trail;
