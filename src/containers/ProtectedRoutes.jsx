import React from 'react';
import PropTypes from 'prop-types';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import * as R from 'ramda';
import Auth from 'lib/Auth';
import SignInLoader from 'components/SignInLoader';
import HomePage from 'components/HomePage';
import ManagerDashboard from 'containers/ManagerDashboard';
import {
  operations as loginOperations,
  selectors as loginSelectors,
} from 'ducks/login';
import {
  selectors as TombstoneSelectors,
} from 'ducks/tombstone';
import { connect } from 'react-redux';
import App from 'components/App';
import {
  operations as dashboardOperations,
  selectors as dashboardSelectors,
} from 'ducks/dashboard';
import * as config from 'ducks/config';
import RouteAccess from 'lib/RouteAccess';
import DashboardModel from 'models/Dashboard';
import Dashboard from './Dashboard';
import SearchLoan from './Dashboard/SearchLoan';
import StagerDashboard from './StagerDashboard';
import MoveForward from './MoveForward';
import IdleUserHandle from './IdleUserHandler';
import DocGenGoBack from './Dashboard/DocGenGoBack';
import DocsInGoBack from './Dashboard/DocsInGoBack';
import DocsIn from './Dashboard/DocsIn/DocsIn';
import CoviusBulkOrder from './Dashboard/Covius/CoviusBulkOrder';
import FhlmcResolve from './Dashboard/FhlmcResolve/FhlmcResolve';
import Processor from './Dashboard/Processor/Processor';
import MilestoneActivity from './LoanActivity/MilestoneActivity';

class ProtectedRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirectPath: null,
    };
    this.shouldRedirect = false;
    this.auth = null;
    this.getGroups = this.getGroups.bind(this);
    this.renderMoveForwardRoute = this.renderMoveForwardRoute.bind(this);
    this.renderFrontendChecklistRoute = this.renderFrontendChecklistRoute.bind(this);
    this.renderDocProcessorRoute = this.renderDocProcessorRoute.bind(this);
    this.renderLoanActivity = this.renderLoanActivity.bind(this);
    this.renderBackendChecklistRoute = this.renderBackendChecklistRoute.bind(this);
    this.renderDocGenBackRoute = this.renderDocGenBackRoute.bind(this);
    this.renderDocsInBackRoute = this.renderDocsInBackRoute.bind(this);
    this.renderDocGenChecklistRoute = this.renderDocGenChecklistRoute.bind(this);
    this.renderDocsInMainRoute = this.renderDocsInMainRoute.bind(this);
    this.renderSlaPageRoute = this.renderSlaPageRoute.bind(this);
    this.renderCoviusPageRoute = this.renderCoviusPageRoute.bind(this);
    this.renderBulkOrderPageRoute = this.renderBulkOrderPageRoute.bind(this);
    this.rendercoviusBulkOrderPageRoute = this.rendercoviusBulkOrderPageRoute.bind(this);
    this.renderBulkEvalInsertionPageRoute = this.renderBulkEvalInsertionPageRoute.bind(this);
    this.renderMilestoneActivity = this.renderMilestoneActivity.bind(this);
    this.renderfhlmcPageRoute = this.renderfhlmcPageRoute.bind(this);
    this.renderfhlmcBulkOrderPageRoute = this.renderfhlmcBulkOrderPageRoute.bind(this);
    this.renderInvestorSettlementRoute = this.renderInvestorSettlementRoute.bind(this);
    this.renderSecondLookPageRoute = this.renderSecondLookPageRoute.bind(this);
    this.getHiddenRoutes = this.getHiddenRoutes.bind(this);
  }

  componentDidMount() {
    const {
      location, setUserSchemaTrigger, getAllConfig,
    } = this.props;
    Auth.login(location.pathname)
      .then((auth) => {
        this.auth = auth;
        if (auth.sessionValid) {
          setUserSchemaTrigger(auth.user);
          this.setState({ loading: false });
          if (auth.groups) {
            let redirectPath = '';
            redirectPath = this.getHiddenRoutes() || Auth.getGroupHomePage(auth.groups);
            this.shouldRedirect = !R.isNil(this.getHiddenRoutes()) || (location.pathname === '/' && redirectPath !== location.pathname);
            this.setState({
              loading: false,
              redirectPath,
            });
          }
        }
      });
    getAllConfig();
  }

  getHiddenRoutes() {
    const { hiddenRoutes, location } = this.props;
    if (!R.isEmpty(hiddenRoutes) && hiddenRoutes.includes(location.pathname)) {
      return '/unauthorized?error=LOCATION_ACCESS_FAILED';
    }
    return null;
  }

  getGroups() {
    const { user } = this.props;
    return user && user.groupList;
  }

  renderFrontendChecklistRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasFrontendChecklistAccess(groups)
        ? <Dashboard group={DashboardModel.FEUW} />
        : <Redirect to="/unauthorized?error=FRONTEND_UNDERWRITER_ACCESS_NEEDED" />
    );
  }

  renderDocProcessorRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasDocProcessorAccess(groups)
        ? <Dashboard group="PROC" />
        : <Redirect to="/unauthorized?error=DOC_PROCESSOR_ACCESS_NEEDED" />
    );
  }

  renderBackendChecklistRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasBackendChecklistAccess(groups)
        ? <Dashboard group={DashboardModel.BEUW} />
        : <Redirect to="/unauthorized?error=BACKEND_UNDERWRITER_ACCESS_NEEDED" />
    );
  }

  renderDocGenBackRoute() {
    const { items, loanNumber } = this.props;
    const groups = this.getGroups();
    let renderComponent = null;
    if (groups.length > 0) {
      renderComponent = (items.length > 0 || loanNumber) ? <DocGenGoBack /> : <Redirect to="/" />;
    } else {
      renderComponent = <Redirect to="/unauthorized?error=DOC_GEN_ACCESS_NEEDED" />;
    }
    return renderComponent;
  }

  renderDocsInBackRoute() {
    const { items, loanNumber } = this.props;
    const groups = this.getGroups();
    let renderComponent = null;
    if (groups.length > 0) {
      renderComponent = (items.length > 0 || loanNumber) ? <DocsInGoBack /> : <Redirect to="/" />;
    } else {
      renderComponent = <Redirect to="/unauthorized?error=DOCS_IN_ACCESS_NEEDED" />;
    }
    return renderComponent;
  }

  renderDocGenChecklistRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasDocGenAccess(groups)
        ? <Dashboard group={DashboardModel.DOC_GEN} />
        : <Redirect to="/unauthorized?error=DOC_GEN_ACCESS_NEEDED" />
    );
  }

  renderLoanActivity() {
    const { items, loanNumber } = this.props;
    const groups = this.getGroups();
    let renderComponent = null;
    if (RouteAccess.hasLoanActivityAccess(groups)) {
      renderComponent = (items.length > 0 || loanNumber) ? <Dashboard group="LA" /> : <Redirect to="/" />;
    } else {
      renderComponent = <Redirect to="/unauthorized?error=LOAN_ACTIVITY_ACCESS_NEEDED" />;
    }
    return renderComponent;
  }

  renderMilestoneActivity() {
    const { items, loanNumber } = this.props;
    const groups = this.getGroups();
    let renderComponent = null;
    if (RouteAccess.hasMilestoneActivityAccess(groups)) {
      renderComponent = (items.length > 0 || loanNumber) ? <MilestoneActivity /> : <Redirect to="/" />;
    } else {
      renderComponent = <Redirect to="/unauthorized?error=MILESTONE_ACTIVITY_ACCESS_NEEDED" />;
    }
    return renderComponent;
  }

  renderMoveForwardRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasMoveForwardAccess(groups)
        ? <MoveForward />
        : <Redirect to="/unauthorized?error=MOVE_FORWARD_ACCESS_NEEDED" />
    );
  }

  renderDocsInMainRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasDocInsAccess(groups)
        ? <Dashboard group={DashboardModel.DOCS_IN} />
        : <Redirect to="/unauthorized?error=DOCSIN_ACCESS_NEEDED" />
    );
  }

  renderBulkOrderPageRoute() {
    const groups = this.getGroups();
    return (
      (RouteAccess.hasDocInsAccess(groups) || RouteAccess.hasStagerDashboardAccess(groups))
        ? <DocsIn group={DashboardModel.DOCS_IN} groupName={RouteAccess.getStagerGroup(groups)} />
        : <Redirect to="/unauthorized?error=DOCSIN_ACCESS_NEEDED" />
    );
  }

  renderBulkEvalInsertionPageRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasDocProcessorAccess(groups)
        ? <Processor group={DashboardModel.PROCMGR} />
        : <Redirect to="/unauthorized?error=PROCMGR_ACCESS_NEEDED" />
    );
  }

  renderSlaPageRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasSlaAccess(groups)
        ? <Dashboard group={DashboardModel.BOOKING} />
        : <Redirect to="/unauthorized?error=SLA_ACCESS_NEEDED" />
    );
  }

  renderCoviusPageRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasCoviusAccess(groups)
        ? <Dashboard group={DashboardModel.COVIUS} />
        : <Redirect to="/unauthorized?error=COVIUS_ACCESS_NEEDED" />
    );
  }

  rendercoviusBulkOrderPageRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasCoviusAccess(groups)
        ? <CoviusBulkOrder />
        : <Redirect to="/unauthorized?error=COVIUS_ACCESS_NEEDED" />
    );
  }

  renderfhlmcPageRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasFhlmcResolveAccess(groups)
        ? <Dashboard group={DashboardModel.FHLMCRESOLVE} />
        : <Redirect to="/unauthorized?error=FHHLMC_RESOLVE_ACCESS_NEEDED" />
    );
  }

  renderfhlmcBulkOrderPageRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasFhlmcResolveAccess(groups)
        ? <FhlmcResolve />
        : <Redirect to="/unauthorized?error=FHHLMC_RESOLVE_ACCESS_NEEDED" />
    );
  }

  renderStagerRoute = () => {
    const groups = this.getGroups();
    return (
      RouteAccess.hasStagerDashboardAccess(groups)
        ? <StagerDashboard group={RouteAccess.getStagerGroup(groups)} />
        : <Redirect to="/unauthorized?error=STAGER_DASHBOARD_ACCESS_NEEDED" />
    );
  }

  renderInvestorSettlementRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasInvestorSettlementAccess(groups)
        ? <Dashboard group={DashboardModel.INVSET} />
        : <Redirect to="/unauthorized?error=INVESTOR_SETTLEMENT_ACCESS_NEEDED" />
    );
  }

  renderSecondLookPageRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasSecondLookAccess(groups)
        ? <Dashboard group={DashboardModel.SECONDLOOK} />
        : <Redirect to="/unauthorized?error=SECONDLOOK_ACCESS_NEEDED" />
    );
  }

  render() {
    const { loading, redirectPath } = this.state;
    const { expandView, location, user } = this.props;
    const groups = this.getGroups();
    if (loading) {
      return <SignInLoader />;
    }
    if (this.shouldRedirect) {
      this.shouldRedirect = false;
      return <Redirect to={redirectPath} />;
    }
    return (
      <App expandView={expandView} location={location.pathname} user={user}>
        <IdleUserHandle />
        <Switch>
          <Route exact path="/reports" render={() => <ManagerDashboard groups={groups} />} />
          <Route exact path="/stager" render={this.renderStagerRoute} />
          <Route path="/doc-processor" render={this.renderDocProcessorRoute} />
          <Route path="/frontend-checklist" render={this.renderFrontendChecklistRoute} />
          <Route path="/backend-checklist" render={this.renderBackendChecklistRoute} />
          <Route exact path="/loan-activity" render={this.renderLoanActivity} />
          <Route path="/doc-gen-back" render={this.renderDocGenBackRoute} />
          <Route path="/docs-in-back" render={this.renderDocsInBackRoute} />
          <Route path="/doc-gen" render={this.renderDocGenChecklistRoute} />
          <Route exact path="/milestone-activity" render={this.renderMilestoneActivity} />
          <Route exact path="/move-forward" render={this.renderMoveForwardRoute} />
          <Route path="/docs-in" render={this.renderDocsInMainRoute} />
          <Route path="/bulkOrder-page" render={this.renderBulkOrderPageRoute} />
          <Route path="/bulkEvalInsertion" render={this.renderBulkEvalInsertionPageRoute} />
          <Route path="/special-loan" render={this.renderSlaPageRoute} />
          <Route path="/dg-vendor" render={this.renderCoviusPageRoute} />
          <Route path="/fhlmc-resolve" render={this.renderfhlmcPageRoute} />
          <Route path="/coviusBulkOrder" render={this.rendercoviusBulkOrderPageRoute} />
          <Route path="/fhlmcBulkOrder" render={this.renderfhlmcBulkOrderPageRoute} />
          <Route path="/investor-settlement" render={this.renderInvestorSettlementRoute} />
          <Route path="/postmodstager" render={() => <Dashboard group={DashboardModel.POSTMODSTAGER} />} />
          <Route path="/uwstager" render={() => <Dashboard group={DashboardModel.UWSTAGER} />} />
          <Route path="/second-look" render={this.renderSecondLookPageRoute} />
          <Route component={SearchLoan} exact path="/search" />
          <Route component={HomePage} />
        </Switch>
      </App>
    );
  }
}

const mapStateToProps = state => ({
  expandView: dashboardSelectors.expandView(state),
  user: loginSelectors.getUser(state),
  items: TombstoneSelectors.getTombstoneData(state),
  loanNumber: dashboardSelectors.loanNumber(state),
  hiddenRoutes: config.selectors.hiddenRoutes(state),
});

const mapDispatchToProps = dispatch => ({
  onExpandTrigger: dashboardOperations.onExpand(dispatch),
  setUserSchemaTrigger: loginOperations.setUserSchemaTrigger(dispatch),
  getAllConfig: config.operations.fetchConfig(dispatch),
});

ProtectedRoutes.defaultProps = {
  items: [],
  loanNumber: '',
  hiddenRoutes: [],
};
ProtectedRoutes.propTypes = {
  expandView: PropTypes.bool.isRequired,
  getAllConfig: PropTypes.func.isRequired,
  hiddenRoutes: PropTypes.objectOf(PropTypes.array),
  items: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.any.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
  loanNumber: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  setUserSchemaTrigger: PropTypes.func.isRequired,
  user: PropTypes.shape({
    groupList: PropTypes.array,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoutes);
