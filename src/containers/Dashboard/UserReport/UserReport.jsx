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
import { operations as dashboardOperations } from 'ducks/dashboard';
import * as R from 'ramda';
import './UserReport.css';

const BULKUPLOAD_STAGER = 'BULKUPLOAD_DOCSIN';
class UserReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.mapRepo = {
      '/frontend-checklist': 'INCOME CALCULATION Agent Dashboard',
      '/frontend-evaluation': 'INCOME CALCULATION Agent Dashboard',
      '/backend-evaluation': 'UNDERWRITNG Agent Dashboard',
      '/backend-checklist': 'UNDERWRITNG Agent Dashboard',
      '/doc-processor': 'PROCESSING Agent Dashboard',
      '/doc-gen': 'DOC GENERATION Agent Dashboard',
      '/docs-in': 'DOCS IN Agent Dashboard',
    };
    this.showAddDocsIn = false;
    this.accessToken = Auth.getPowerBIAccessToken(window.location.pathname);
    this.reportStyle = { width: '100%', height: '100%' };
    this.renderReport = this.renderReport.bind(this);
  }

  componentDidMount() {
    const { fetchPowerBIConstants } = this.props;
    fetchPowerBIConstants();
  }

  onHandleClick = () => {
    const { history, setPageType } = this.props;
    history.push('/bulkOrder-page');
    setPageType(BULKUPLOAD_STAGER);
  }

  renderReport(powerBIConstants) {
    const { location } = this.props;
    const nameRepo = this.mapRepo[location.pathname];
    const report = R.find(R.propEq('reportName', nameRepo))(powerBIConstants);
    if (R.isNil(report)) {
      return (
        <Center>
          <span styleName="error-message">
            Report is under Construction...
          </span>
        </Center>
      );
    }
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
    const { powerBIConstants } = this.props;
    const { location } = this.props;
    const el = DashboardModel.GROUP_INFO.find(page => page.path === location.pathname);
    this.showAddDocsIn = el.group === 'DOCSIN';
    return (
      <>
        <ContentHeader
          handleClick={() => this.onHandleClick}
          showAddButton={this.showAddDocsIn}
          title={el.task}
        >
          <Controls
            showGetNext
          />
        </ContentHeader>
        <div styleName="report">
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
  setPageType: dashboardOperations.setPageType(dispatch),
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
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  setPageType: PropTypes.func.isRequired,
};

const TestHooks = {
  UserReport,
};

const UserReportContainer = connect(mapStateToProps, mapDispatchToProps)(UserReport);
export default withRouter(UserReportContainer);

export { TestHooks };
