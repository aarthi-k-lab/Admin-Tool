import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StatusDetails from './StatusDetails';
import { operations, selectors } from '../../state/ducks/dashboard';
import './LoanActivity.css';

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


// MockData
// eslint-disable-next-line no-unused-vars
const getMockMonthlyData = (type) => {
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
};

// This will get called in dashboard sagas
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line arrow-body-style
const getMockData = (type) => {
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
    monthlyDetails: getMockMonthlyData(type),
  };
};

class LoanActivity extends React.PureComponent {
  render() {
    const { loanActivityDetails } = this.props;
    return (
      <>
        <div styleName="detail-parent">
          <StatusDetails loanActivityDetails={loanActivityDetails} />
        </div>
      </>
    );
  }
}
LoanActivity.propTypes = {
  loanActivityDetails: PropTypes.shape.isRequired,
};
const mapDispatchToProps = dispatch => ({
  onSearchLoan: operations.onSearchLoan(dispatch),
  onSelectEval: operations.onSelectEval(dispatch),
});
const mapStateToProps = state => ({
  loanActivityDetails: selectors.getActivityDetails(state),
});

const TestHooks = {
  LoanActivity,
};
const container = connect(mapStateToProps, mapDispatchToProps)(LoanActivity);
export default container;
export const mockData = getMockData;
export {
  TestHooks,
};
