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

class ManagerDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { };
    this.accessToken = Auth.getPowerBIAccessToken();
    this.reportStyle = { width: '100%', height: '100%' };
    this.renderReport = this.renderReport.bind(this);
  }

  componentDidMount() {
    const { fetchPowerBIConstants } = this.props;
    fetchPowerBIConstants();
  }

  // Currently rendering report in 0th index as we have only one group.
  // Will be expanded later after we get more info on report groups
  renderReport(powerBIConstants) {
    return (this.accessToken && powerBIConstants && powerBIConstants.length > 0)
      ? (
        <Report
          accessToken={this.accessToken}
          embedId={powerBIConstants[0] ? powerBIConstants[0].reportId : ''}
          embedType="report"
          embedUrl={powerBIConstants[0] ? powerBIConstants[0].reportUrl : ''}
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
    const { groups } = this.props;
    const { powerBIConstants } = this.props;
    if (!RouteAccess.hasManagerDashboardAccess(groups)) {
      return <Redirect to="/unauthorized?error=MANAGER_ACCESS_NEEDED" />;
    }
    return (
      <>
        <ContentHeader title="Manager Dashboard">
          <Controls />
        </ContentHeader>
        <div styleName="reportsDiv">
          { this.renderReport(powerBIConstants) }
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagerDashboard);
