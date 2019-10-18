import React from 'react';
import PropTypes from 'prop-types';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
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
    this.renderBackendRoute = this.renderBackendRoute.bind(this);
    this.renderFrontendRoute = this.renderFrontendRoute.bind(this);
    this.renderMoveForwardRoute = this.renderMoveForwardRoute.bind(this);
    this.renderFrontendChecklistRoute = this.renderFrontendChecklistRoute.bind(this);
    this.renderDocProcessorRoute = this.renderDocProcessorRoute.bind(this);
    this.renderLoanActivity = this.renderLoanActivity.bind(this);
    this.renderBackendChecklistRoute = this.renderBackendChecklistRoute.bind(this);
    this.renderDocGenBackRoute = this.renderDocGenBackRoute.bind(this);
    this.renderDocsInBackRoute = this.renderDocsInBackRoute.bind(this);
    this.renderDocGenChecklistRoute = this.renderDocGenChecklistRoute.bind(this);
    this.renderDocsInMainRoute = this.renderDocsInMainRoute.bind(this);
    this.renderDocsInPageRoute = this.renderDocsInPageRoute.bind(this);
  }

  componentDidMount() {
    const { location, setUserSchemaTrigger, getFeaturesTrigger } = this.props;
    Auth.login(location.pathname)
      .then((auth) => {
        this.auth = auth;
        if (auth.sessionValid) {
          this.setState({ loading: false });
          if (auth.groups) {
            const redirectPath = Auth.getGroupHomePage(auth.groups);
            this.shouldRedirect = location.pathname === '/' && redirectPath !== location.pathname;
            this.setState({
              loading: false,
              redirectPath,
            });
            setUserSchemaTrigger(auth.user);
          }
        }
      });
    getFeaturesTrigger();
  }

  getGroups() {
    const { user } = this.props;
    return user && user.groupList;
  }

  renderFrontendRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasFrontendUnderwriterAccess(groups)
        ? <Dashboard />
        : <Redirect to="/unauthorized?error=FRONTEND_UNDERWRITER_ACCESS_NEEDED" />
    );
  }

  renderFrontendChecklistRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasFrontendChecklistAccess(groups)
        ? <Dashboard group={DashboardModel.FEUW} />
        : <Redirect to="/unauthorized?error=FRONTEND_UNDERWRITER_ACCESS_NEEDED" />
    );
  }

  renderBackendRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasBackendUnderwriterAccess(groups)
        ? <Dashboard group="BEUW" />
        : <Redirect to="/unauthorized?error=BACKEND_UNDERWRITER_ACCESS_NEEDED" />
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
    if (RouteAccess.hasDocGenBackAccess(groups)) {
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
    if (RouteAccess.hasDocGenBackAccess(groups)) {
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

  renderDocsInPageRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasDocInsAccess(groups)
        ? <DocsIn group={DashboardModel.DOCS_IN} />
        : <Redirect to="/unauthorized?error=DOCSIN_ACCESS_NEEDED" />
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
          <Route exact path="/stager" render={() => <StagerDashboard groups={groups} />} />
          <Route path="/backend-evaluation" render={this.renderBackendRoute} />
          <Route path="/doc-processor" render={this.renderDocProcessorRoute} />
          <Route path="/frontend-checklist" render={this.renderFrontendChecklistRoute} />
          <Route path="/frontend-evaluation" render={this.renderFrontendRoute} />
          <Route path="/backend-checklist" render={this.renderBackendChecklistRoute} />
          <Route exact path="/loan-activity" render={this.renderLoanActivity} />
          <Route path="/doc-gen-back" render={this.renderDocGenBackRoute} />
          <Route path="/docs-in-back" render={this.renderDocsInBackRoute} />
          <Route path="/doc-gen" render={this.renderDocGenChecklistRoute} />
          <Route exact path="/move-forward" render={this.renderMoveForwardRoute} />
          <Route path="/docs-in" render={this.renderDocsInMainRoute} />
          <Route path="/docs-in-page" render={this.renderDocsInPageRoute} />
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
});

const mapDispatchToProps = dispatch => ({
  onExpandTrigger: dashboardOperations.onExpand(dispatch),
  setUserSchemaTrigger: loginOperations.setUserSchemaTrigger(dispatch),
  getFeaturesTrigger: config.operations.getFeaturesTrigger(dispatch),
});

ProtectedRoutes.defaultProps = {
  items: [],
  loanNumber: '',
};
ProtectedRoutes.propTypes = {
  expandView: PropTypes.bool.isRequired,
  getFeaturesTrigger: PropTypes.func.isRequired,
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
