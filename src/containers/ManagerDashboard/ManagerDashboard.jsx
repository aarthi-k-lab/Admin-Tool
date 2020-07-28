import React, { Component } from 'react';
import Report from 'powerbi-report-component';
import Auth from 'lib/Auth';
import ContentHeader from 'components/ContentHeader';
import Center from 'components/Center';
import Controls from 'containers/Controls';
import './ManagerDashboard.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RouteAccess from 'lib/RouteAccess';
import {
  operations as dashboardOperations,
} from 'ducks/dashboard';
import { operations, selectors } from 'ducks/config';
import * as R from 'ramda';
import DropDownSelect from './DropDownSelect';

class ManagerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDashboard: 'Manager Dashboard',
    };
    this.accessToken = Auth.getPowerBIAccessToken(window.location.pathname);
    this.reportStyle = { width: '100%', height: '100%' };
    this.renderReport = this.renderReport.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { fetchPowerBIConstants } = this.props;
    fetchPowerBIConstants();
  }

  handleChange(event) {
    this.setState({ selectedDashboard: event.target.value });
  }

  renderReport(powerBIConstants) {
    const { selectedDashboard } = this.state;
    const report = R.find(R.propEq('reportName', selectedDashboard))(powerBIConstants);
    return (this.accessToken && powerBIConstants && powerBIConstants.length > 0)
      ? (
        <Report
          accessToken={this.accessToken}
          embedId={report ? report.reportId : ''}
          embedType="report"
          embedUrl={report ? report.reportUrl : ''}
          permissions="All"
          style={this.reportStyle}
          tokenType="Aad"
        />
      )
      : (
        <Center>
          <span styleName="message">
            <CircularProgress size={30} />
            Authenticating with PowerBI...
          </span>
        </Center>
      );
  }

  render() {
    const { groups, powerBIConstants } = this.props;
    const { selectedDashboard } = this.state;
    if (!RouteAccess.hasManagerDashboardAccess(groups)) {
      return <Redirect to="/unauthorized?error=MANAGER_ACCESS_NEEDED" />;
    }
    return (
      <>
        <ContentHeader title={selectedDashboard}>
          <DropDownSelect
            getDashboardItems={powerBIConstants}
            onChange={this.handleChange}
            selectedValue={selectedDashboard}
          />
          <Controls />
        </ContentHeader>
        <div styleName="report">
          {this.renderReport(powerBIConstants)}
        </div>
      </>
    );
  }
}

ManagerDashboard.propTypes = {
  fetchPowerBIConstants: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  powerBIConstants: selectors.powerBIConstants(state),
});

const mapDispatchToProps = dispatch => ({
  fetchPowerBIConstants: operations.fetchPowerBIConstants(dispatch),
  onExpandTrigger: dashboardOperations.onExpand(dispatch),
});

ManagerDashboard.defaultProps = {
  powerBIConstants: [
    {
      groupId: 'Loan #',
      reportId: '67845985',
      reportName: '',
      reportUrl: '',
    },
  ],
};

ManagerDashboard.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  powerBIConstants: PropTypes.arrayOf(
    PropTypes.shape({
      groupId: PropTypes.string.isRequired,
      reportId: PropTypes.string.isRequired,
      reportName: PropTypes.string.isRequired,
      reportUrl: PropTypes.string.isRequired,
    }),
  ),
};
const TestHooks = {
  ManagerDashboard,
};
export default connect(mapStateToProps, mapDispatchToProps)(ManagerDashboard);

export { TestHooks };
