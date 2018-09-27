import React from 'react';
import PropTypes from 'prop-types';
import {
  Route, Switch, Redirect,
} from 'react-router-dom';
import Auth from 'lib/Auth';
import SignInLoader from 'components/SignInLoader';
import ManagerDashboard from 'containers/ManagerDashboard';
import {
  operations as loginOperations,
  selectors as loginSelectors,
} from 'ducks/login';
import { connect } from 'react-redux';
import Dashboard from './Dashboard';

class ProtectedRoutes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirectPath: null,
      shouldRedirect: false,
    };
    this.auth = null;
  }

  componentDidMount() {
    const { location, setUserSchemaTrigger } = this.props;
    Auth.login(location.pathname)
      .then((auth) => {
        this.auth = auth;
        if (auth.sessionValid) {
          this.setState({ loading: false });
          if (auth.groups && auth.groups.length > 0) {
            const redirectPath = Auth.getGroupHomePage(auth.groups);
            setUserSchemaTrigger(auth.user);
            this.setState({
              loading: false,
              redirectPath,
              shouldRedirect: location.pathname === '/' && redirectPath !== location.pathname,
            });
          }
        }
      });
  }

  render() {
    const { loading, redirectPath, shouldRedirect } = this.state;
    const { user } = this.props;
    const groups = user && user.groupList;
    if (loading) {
      return <SignInLoader />;
    }
    if (shouldRedirect) {
      this.setState({ shouldRedirect: false });
      return <Redirect to={redirectPath} />;
    }
    return (
      <Switch>
        <Route exact path="/reports" render={() => <ManagerDashboard groups={groups} />} />
        <Route render={() => <Dashboard user={user} />} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  user: loginSelectors.getUser(state),
});

const mapDispatchToProps = dispatch => ({
  setUserSchemaTrigger: loginOperations.setUserSchemaTrigger(dispatch),
});

ProtectedRoutes.propTypes = {
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
