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
import { connect } from 'react-redux';
import App from 'components/App';
import {
  operations as dashboardOperations,
  selectors as dashboardSelectors,
} from 'ducks/dashboard';
import * as config from 'ducks/config';
import RouteAccess from 'lib/RouteAccess';
// import DashboardModel from 'models/Dashboard';
import Dashboard from './Dashboard';
import SearchLoan from './Dashboard/SearchLoan';
import StagerDashboard from './StagerDashboard';
import MoveForward from './MoveForward';

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
  }

  componentDidMount() {
    const { location, setUserSchemaTrigger, getFeaturesTrigger } = this.props;
    Auth.login(location.pathname)
      .then((auth) => {
        this.auth = auth;
        if (auth.sessionValid) {
          this.setState({ loading: false });
          if (auth.groups && auth.groups.length > 0) {
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

  renderBackendRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasBackendUnderwriterAccess(groups)
        ? <Dashboard group="BEUW" />
        : <Redirect to="/unauthorized?error=BACKEND_UNDERWRITER_ACCESS_NEEDED" />
    );
  }

  renderMoveForwardRoute() {
    const groups = this.getGroups();
    return (
      RouteAccess.hasMoveForwardAccess(groups)
        ? <MoveForward />
        : <Redirect to="/unauthorized?error=MOVE_FORWARD_ACCESS_NEEDED" />
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
        <Switch>
          <Route exact path="/reports" render={() => <ManagerDashboard groups={groups} />} />
          <Route exact path="/stager" render={() => <StagerDashboard groups={groups} />} />
          <Route path="/backend-evaluation" render={this.renderBackendRoute} />
          {/* eslint-disable-next-line */}
          {/* <Route path="/frontend-checklist" render={() => <Dashboard group={DashboardModel.FEUW_TASKS_AND_CHECKLIST} />} /> */}
          <Route path="/frontend-evaluation" render={this.renderFrontendRoute} />
          <Route exact path="/move-forward" render={this.renderMoveForwardRoute} />
          <Route component={SearchLoan} exact path="/search" />
          <Route component={HomePage} />
        </Switch>
      </App>
    );
  }
}

const mapStateToProps = state => ({
  expandView: dashboardSelectors.expandView(state),
  features: config.selectors.getFeatures(state),
  user: loginSelectors.getUser(state),
});

const mapDispatchToProps = dispatch => ({
  onExpandTrigger: dashboardOperations.onExpand(dispatch),
  setUserSchemaTrigger: loginOperations.setUserSchemaTrigger(dispatch),
  getFeaturesTrigger: config.operations.getFeaturesTrigger(dispatch),
});

ProtectedRoutes.propTypes = {
  expandView: PropTypes.bool.isRequired,
  features: PropTypes.shape({
    taskPane: PropTypes.bool,
  }).isRequired,
  getFeaturesTrigger: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  setUserSchemaTrigger: PropTypes.func.isRequired,
  user: PropTypes.shape({
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoutes);
