/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-did-update-set-state */
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
import mapRepo from 'models/powerbi';
import { selectors, operations as configOperations } from 'ducks/config';
import { selectors as LoginSelectors } from 'ducks/login';
import { operations as dashboardOperations } from 'ducks/dashboard';
import Expand from 'components/ContentHeader/Expand';
import * as R from 'ramda';
import './UserReport.css';

const BULKUPLOAD_STAGER = 'BULKUPLOAD_DOCSIN';
class UserReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.showAddDocsIn = false;
    this.accessToken = Auth.getPowerBIAccessToken(window.location.pathname);
    this.reportStyle = { width: '100%', height: '100%' };
    this.renderReport = this.renderReport.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
  }

  componentDidMount() {
    const { fetchConfig } = this.props;
    fetchConfig();
  }

  componentDidUpdate(prevProps) {
    const { location, toggleReports } = prevProps;
    const currentLocationProps = this.props.location;
    const { fetchConfig, clearReports } = this.props;
    if (!R.equals(currentLocationProps.pathname, location.pathname)) {
      clearReports();
      fetchConfig();
    }
  }

  componentWillUnmount() {
    const { clearReports } = this.props;
    clearReports();
  }

  onHandleClick = () => {
    const { history, setPageType, location } = this.props;
    const el = DashboardModel.GROUP_INFO.find(page => page.path === location.pathname);
    if (el.group === 'DOCSIN') {
      history.push('/bulkOrder-page');
      setPageType(BULKUPLOAD_STAGER);
    } else if (el.group === 'PROC') {
      history.push('/bulkEvalInsertion');
    } else if (el.group === 'docgenvendor') {
      history.push('/coviusBulkOrder');
    } else if (el.group === 'fhlmcresolve') {
      history.push('/fhlmcBulkOrder');
    } else if (el.group === 'lossmitigation') {
      history.push('/westWingOrder');
    }
  }

  renderReport(powerBIConstants) {
    const { location, loading } = this.props;
    const currentReport = R.find(R.propEq('reportName', mapRepo[location.pathname]))(powerBIConstants);
    if (R.isNil(currentReport)) {
      return (
        <Center>
          <span styleName="error-message">
            Report is under Construction...
          </span>
        </Center>
      );
    }
    if (loading) {
      return <></>;
    }
    return (this.accessToken && powerBIConstants && powerBIConstants.length > 0)
      ? (
        <Report
          accessToken={this.accessToken}
          embedId={currentReport ? currentReport.reportId : ''}
          embedType="report"
          embedUrl={currentReport ? currentReport.reportUrl : ''}
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
    const { powerBIConstants, userGroupList, onExpand } = this.props;
    const { location } = this.props;
    const el = DashboardModel.GROUP_INFO.find(page => page.path === location.pathname);
    this.showAddDocsIn = el.group === 'DOCSIN'
      || (userGroupList.find(element => element === 'proc-mgr') && el.group === 'PROC')
      || el.group === 'docgenvendor' || el.group === 'fhlmcresolve' || el.group === 'lossmitigation';
    return (
      <>
        <ContentHeader
          handleClick={() => this.onHandleClick}
          showAddButton={this.showAddDocsIn}
          title={el.task}
        >
          {el.group === 'docgenvendor' || el.group === 'fhlmcresolve' || el.group === 'lossmitigation' ? <Expand onClick={onExpand} />
            : (
              <Controls
                showGetNext
              />
            )
          }
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
  userGroupList: LoginSelectors.getGroupList(state),
  loading: selectors.getLoading(state),
});

const mapDispatchToProps = dispatch => ({
  setPageType: dashboardOperations.setPageType(dispatch),
  fetchConfig: configOperations.fetchConfig(dispatch),
  clearReports: configOperations.clearReportsOperation(dispatch),
  toggleReports: configOperations.toggleReportsOperation(dispatch),
});

UserReport.defaultProps = {
  location: {
    pathname: '',
  },
  onExpand: () => { },
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
  clearReports: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onExpand: PropTypes.func,
  powerBIConstants: PropTypes.arrayOf(
    PropTypes.shape({
      groupId: PropTypes.string.isRequired,
      reportId: PropTypes.string.isRequired,
      reportName: PropTypes.string.isRequired,
      reportUrl: PropTypes.string.isRequired,
    }),
  ),
  setPageType: PropTypes.func.isRequired,
  toggleReports: PropTypes.func.isRequired,
  userGroupList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const TestHooks = {
  UserReport,
};

const UserReportContainer = connect(mapStateToProps, mapDispatchToProps)(UserReport);
export default withRouter(UserReportContainer);

export { TestHooks };
