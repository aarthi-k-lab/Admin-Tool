/* eslint-disable react/prefer-stateless-function */
import React from 'react';
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

const navigationList = [
  {
    header: 'Trail Period',
    assignee: 'Prasad',
    status: 'FAILED',
    statusDate: '11/10/2018',
    startDate: '07/08/2018',
    endDate: '09/10/2017',
    expectedCompletionDate: '02/04/2019',
  },
  {
    header: 'Back End UnderWriting',
    assignee: 'David Hook',
    status: 'COMPLETED',
    statusDate: '11/10/2018',
    startDate: '07/08/2018',
    endDate: '09/10/2017',
    expectedCompletionDate: '02/04/2019',
    child: [{
      header: 'Legal fees',
      assignee: 'Prasad',
      status: 'TO ORDER',
      statusDate: '11/10/2018',
    }, {
      header: 'Value',
      assignee: 'Prasad',
      status: 'ORDERED',
      statusDate: '11/10/2018',
    }, {
      header: 'Escrow',
      assignee: 'Willam White',
      status: 'TO ORDER',
      statusDate: '26/08/2018',
    }],
  }, {
    header: 'Front End UnderWriting',
    assignee: 'Sudhan',
    status: 'COMPLETED',
    statusDate: '11/10/2018',
    startDate: '07/08/2018',
    endDate: '09/10/2017',
    expectedCompletionDate: '02/04/2019',
  },
];

class Trail extends React.PureComponent {
  render() {
    return (
      <>
        <Tombstone />
        <Grid container styleName="container">
          <Grid item styleName="container-item" xs={3}>
            <div styleName="navigation-pane">
              <Navigation navigationList={navigationList} />
            </div>
          </Grid>
          <Grid item styleName="container-item" xs={6}>
            <div styleName="detail-parent">
              <TrailDetails details={details} />
            </div>
          </Grid>
          <Grid item styleName="container-item" xs={3}>
            <div styleName="navigation-pane">
              Custom Communication Letter
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default Trail;
