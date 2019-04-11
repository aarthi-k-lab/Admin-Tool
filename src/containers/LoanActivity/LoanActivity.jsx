import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import StatusDetails from './StatusDetails';
import DocWidget from './DocWidget';
import { selectors } from '../../state/ducks/dashboard';
import './LoanActivity.css';

// MockData
// eslint-disable-next-line no-unused-vars
const getMockMonthlyData = (type) => {
  const data = [];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  let index;
  const range = type === 'Trial' ? 3 : 12;
  const constantMoney = 2865555.00;
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  // eslint-disable-next-line no-plusplus
  for (index = 0; index < range; index++) {
    data.push({
      title: `${type} ${index + 1}`,
      month: `${monthNames[index]} 2019`,
      // eslint-disable-next-line no-nested-ternary
      status: type !== 'Trial' ? (index > 3 ? 'incomplete' : 'complete') : 'completed',
      monthDetail: [{
        header: 'Total Trial amount',
        value: formatter.format(constantMoney + index),
      }, {
        header: 'P&I',
        value: '$125.00',
      }, {
        header: 'Escrow',
        value: '$85.00',
      }, {
        header: 'Trial Due On',
        value: `02/${index + 1 < 10 ? `${'0'}${index + 2}` : index + 1}/2019`,
      }, {
        header: 'Deadline On',
        value: `02/${index + 10}/2019`,
      }, {
        header: 'Paid On',
        value: `02/${index + 9}/2019`,
      }],
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
      columnValue: '02/17/2018',
    }, {
      columnName: 'Down Payment',
      columnValue: '$1234.00',
    }, {
      columnName: 'Case Id',
      columnValue: '1',
    }, {
      columnName: 'Case Type',
      columnValue: 'Trial',
    }, {
      columnName: 'FHA Trial Letter Received',
      columnValue: '04/12/2018',
    }],
    letterSent: [{
      letterSentOnColumn: `${type} letter sent on`,
      letterSentOn: '02/17/2018',
      letterReceivedOnColumn: `FHA ${type} letter received on`,
      letterReceivedOn: '02/19/2018',
    }, {
      letterSentOnColumn: `${type} letter sent on`,
      letterSentOn: '02/21/2018',
      letterReceivedOnColumn: `FHA ${type} letter received on`,
      letterReceivedOn: '02/23/2018',
    }],
    monthlyDetails: getMockMonthlyData(type),
  };
};

class LoanActivity extends React.PureComponent {
  render() {
    const { loanActivityDetails } = this.props;
    return (
      <>
        <Grid container>
          <Grid item styleName="status-details-parent" xs={9}>
            <div styleName="status-details">
              <StatusDetails loanActivityDetails={loanActivityDetails} />
            </div>
          </Grid>
          <Grid item xs={3}>
            <div styleName="report-downloader">
              <DocWidget />
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
}
LoanActivity.propTypes = {
  loanActivityDetails: PropTypes.shape.isRequired,
};
const mapStateToProps = state => ({
  loanActivityDetails: selectors.getActivityDetails(state),
});

const TestHooks = {
  LoanActivity,
};
const container = connect(mapStateToProps, null)(LoanActivity);
export default container;
export const mockData = getMockData;
export {
  TestHooks,
};
