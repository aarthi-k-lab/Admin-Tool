import React from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import StatusDetails from './StatusDetails';
import StatusTree from './Status';
import { operations } from '../../state/ducks/dashboard';
import './LoanActivity.css';

const statusList = [
  {
    header: 'Trial Period',
    assignee: 'Prasad',
    status: 'FAILED',
    statusDate: '11/10/2018',
    startDate: '06/16/2018',
    endDate: '06/19/2018',
    days: 'In 67 DAYS',
    type: 'Trial',
    expectedCompletionDate: '06/28/2018',
  },
  {
    header: 'Forbearance',
    assignee: 'Sudhan Madhavan',
    status: 'COMPLETED',
    statusDate: '08/14/2018',
    startDate: '08/15/2018',
    endDate: '08/20/2018',
    days: 'In 2 DAYS',
    type: 'Forbearance',
    expectedCompletionDate: '08/20/2018',
  },
];

const monthValue = [{
  header: 'Total Trail amount',
  value: '$283400',
}, {
  header: 'P&I',
  value: '$125.00',
}, {
  header: 'Escrow',
  value: '$85.00',
}, {
  header: 'Trail Due On',
  value: '01/02/2019',
}, {
  header: 'Deadline On',
  value: '01/12/2019',
}, {
  header: 'Paid On',
  value: '17/12/2019',
}];

function getMockStatusData(type) {
  return {
    title: `${type} ${type === 'Trial' ? 'Period' : ''}`,
    statusDetails: [{
      columnName: 'Acceptance Date',
      columnValue: '17/02/2018',
    }, {
      columnName: 'Down Payment',
      columnValue: '$1234',
    }],
    letterSent: [{
      letterSentOnColumn: `${type} letter sent on`,
      letterSentOn: '17/02/2018',
      letterReceivedOnColumn: `FHA ${type} letter received on`,
      letterReceivedOn: '19/02/2018',
    }, {
      letterSentOnColumn: `${type} letter sent on`,
      letterSentOn: '21/02/2018',
      letterReceivedOnColumn: `FHA ${type} letter received on`,
      letterReceivedOn: '23/02/2018',
    }],
  };
}

function getMockData(type) {
  const data = [];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  let index;
  const range = type === 'Trial' ? 3 : 12;
  // eslint-disable-next-line no-plusplus
  for (index = 0; index < range; index++) {
    data.push({
      title: `${type} ${index + 1}`,
      month: `${monthNames[index]} 2019`,
      // eslint-disable-next-line no-nested-ternary
      status: type !== 'Trial' ? (index > 3 ? 'incomplete' : 'complete') : (index === 1 ? 'failed' : 'complete'),
      monthDetail: monthValue,
    });
  }
  return data;
}

class LoanActivity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cardDetails: {},
      monthlyDetails: [],
    };
    this.handleStatusClick = this.handleStatusClick.bind(this);
  }

  handleStatusClick(type) {
    this.setState({ monthlyDetails: getMockData(type), cardDetails: getMockStatusData(type) });
  }

  render() {
    const { monthlyDetails, cardDetails } = this.state;
    return (
      <>
        <Grid container styleName="container">
          <Grid item xs={3}>
            <div styleName="status">
              <StatusTree
                onCardClick={this.handleStatusClick}
                statusList={statusList}
              />
            </div>
          </Grid>
          <Grid item xs={6}>
            <div styleName="detail-parent">
              <StatusDetails cardDetails={cardDetails} monthlyDetails={monthlyDetails} />
            </div>
          </Grid>
          <Grid item xs={3}>
            <div styleName="status" />
          </Grid>
        </Grid>
      </>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  onSearchLoan: operations.onSearchLoan(dispatch),
  onSelectEval: operations.onSelectEval(dispatch),
});
const TrailContainer = connect(
  null,
  mapDispatchToProps,
)(LoanActivity);

const TestHooks = {
  LoanActivity,
};
export default TrailContainer;
export {
  TestHooks,
};
