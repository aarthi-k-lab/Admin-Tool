import React from 'react';
import Report from 'powerbi-report-component';
import Auth from 'lib/Auth';
import ContentHeader from 'components/ContentHeader';
import Center from 'components/Center';
import Controls from 'containers/Controls';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DashboardModel from 'models/Dashboard';
import { operations, selectors } from 'ducks/config';
import * as R from 'ramda';
import './UserReport.css';

class UserReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mapRepo = {
      '/frontend-checklist': 'INCOME CALCULATION Agent Dashboard',
      '/frontend-evaluation': 'INCOME CALCULATION Agent Dashboard',
      '/backend-evaluation': 'UNDERWRITNG Agent Dashboard',
      '/backend-checklist': 'UNDERWRITNG Agent Dashboard',
      '/doc-processor': 'PROCESSING Agent Dashboard',
    };
    this.accessToken = Auth.getPowerBIAccessToken();
    this.reportStyle = { width: '100%', height: '100%' };
    this.renderReport = this.renderReport.bind(this);
  }

  componentDidMount() {
    const { fetchPowerBIConstants } = this.props;
    fetchPowerBIConstants();
  }

  renderReport(powerBIConstants) {
    const { location } = this.props;
    const nameRepo = this.mapRepo[location.pathname];
    const report = R.find(R.propEq('reportName', nameRepo))(powerBIConstants);
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

  renderTitle() {
    const { location } = this.props;
    const el = DashboardModel.GROUP_INFO.find(page => page.path === location.pathname);
    return el.task;
  }

  render() {
    const { powerBIConstants } = this.props;
    return (
      <>
        <ContentHeader title={this.renderTitle()}>
          <Controls
            showGetNext
          />
        </ContentHeader>
        <div styleName="reportsDiv">
          {this.renderReport(powerBIConstants)}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  powerBIConstants: selectors.powerBIConstants(state),
});

const mapDispatchToProps = dispatch => ({
  fetchPowerBIConstants: operations.fetchPowerBIConstants(dispatch),
});

UserReport.defaultProps = {
  location: {
    pathname: '',
  },
  powerBIConstants: [
    {
      groupId: 'Loan #',
      reportId: '67845985',
      reportName: '',
      reportUrl: '',
    },
  ],
};

UserReport.propTypes = {
  fetchPowerBIConstants: PropTypes.func.isRequired,
  // groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
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
  UserReport,
};

const UserReportContainer = connect(mapStateToProps, mapDispatchToProps)(UserReport);
export default withRouter(UserReportContainer);

export { TestHooks };
