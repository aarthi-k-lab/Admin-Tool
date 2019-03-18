/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import FullHeightColumn from 'components/FullHeightColumn';
import Grid from '@material-ui/core/Grid';
import Tombstone from 'containers/Dashboard/Tombstone';
import TrailDetails from './TrailDetails';
import Navigation from './NavigationPane';
import './Trail.css';

const details = {
  title: 'Trial Period',
  trailDetails: [{
    columnName: 'Trail Letter Sent on',
    columnValue: '11/02/2018',
  }, {
    columnName: 'Acceptance Date',
    columnValue: '17/02/2018',
  }, {
    columnName: 'Down Payment',
    columnValue: '11/02/2018',
  }, {
    columnName: 'FHA Trail Letter Received',
    columnValue: '18/02/2018',
  }],
};

class Trail extends React.PureComponent {
  render() {
    return (
      <div>
        <Tombstone />
        <FullHeightColumn>
          <div styleName="parent">
            <Grid container spacing={24}>
              <Grid item xs={3}>
                <div styleName="navigation-pane">
                  <Navigation />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div styleName="detail-parent">
                  <TrailDetails details={details} />
                </div>
              </Grid>
              <Grid item xs={3}>
                <div>
                  Download Pane
                </div>
              </Grid>
            </Grid>
          </div>
        </FullHeightColumn>
      </div>
    );
  }
}

export default Trail;
