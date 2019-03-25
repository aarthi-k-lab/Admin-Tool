/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Tombstone from 'containers/Dashboard/Tombstone';
import TrailDetails from './TrailDetails';
import Navigation from './NavigationPane';
import { operations } from '../../state/ducks/dashboard';
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
];

const monthlyData = [{
  title: 'Trail1',
  month: 'January 2019',
  status: 'complete',
},
{
  title: 'Trail2',
  month: 'February 2020',
  status: 'failed',
},
{
  title: 'Trail3',
  month: 'February 2020',
  status: 'incomplete',
  monthDetail: [{
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
  }],
},
];

class Trail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cardDetails: {},
      monthlyDetails: [],
    };
    this.handleNavigationClick = this.handleNavigationClick.bind(this);
  }


  componentDidMount() {
    const { onSearchLoan, onSelectEval } = this.props;
    onSearchLoan('596815091');
    onSelectEval('1928799');
  }

  handleNavigationClick() {
    this.setState({ monthlyDetails: monthlyData, cardDetails: details });
  }

  render() {
    const { monthlyDetails, cardDetails } = this.state;
    return (
      <>
        <Tombstone />
        <Grid container styleName="container">
          <Grid item styleName="container-item" xs={3}>
            <div styleName="navigation-pane">
              <Navigation
                navigationList={navigationList}
                onCardClick={this.handleNavigationClick}
              />
            </div>
          </Grid>
          <Grid item styleName="container-item" xs={6}>
            <div styleName="detail-parent">
              <TrailDetails cardDetails={cardDetails} monthlyDetails={monthlyDetails} />
            </div>
          </Grid>
          <Grid item styleName="container-item" xs={3}>
            <div styleName="navigation-pane" />
          </Grid>
        </Grid>
      </>
    );
  }
}
Trail.propTypes = {
  onSearchLoan: PropTypes.func.isRequired,
  onSelectEval: PropTypes.func.isRequired,
};
const mapDispatchToProps = dispatch => ({
  onSearchLoan: operations.onSearchLoan(dispatch),
  onSelectEval: operations.onSelectEval(dispatch),
});
const TrailContainer = connect(
  null,
  mapDispatchToProps,
)(Trail);

const TestHooks = {
  Trail,
};
export default TrailContainer;
export {
  TestHooks,
};
