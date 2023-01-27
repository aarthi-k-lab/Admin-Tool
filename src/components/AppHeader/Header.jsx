import React from 'react';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import { Link, withRouter } from 'react-router-dom';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as R from 'ramda';
import EndShift from 'models/EndShift';
import hotkeys from 'hotkeys-js';
import Profile from './Profile';
import { operations, selectors } from '../../state/ducks/dashboard';
import { operations as loginOperations, selectors as loginSelectors } from '../../state/ducks/login';
import { selectors as configSelectors } from '../../state/ducks/config';
import './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      showProfileDetails: false,
      refreshHook: true,
      searchText: '',
    };
    this.shouldSearchLoan = false;
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleProfileClose = this.handleProfileClose.bind(this);
    this.handleSearchLoan = this.handleSearchLoan.bind(this);
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
    this.handleLandingpage = this.handleLandingpage.bind(this);
    this.handleSearchLoanClick = this.handleSearchLoanClick.bind(this);
  }

  componentDidMount() {
    hotkeys('s', (event, handler) => {
      if (event.type === 'keydown') {
        this.handleHotKeyPress(handler);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { clearSearch } = nextProps;
    if (clearSearch) {
      this.setState({ searchText: '' });
    }
  }

  componentWillUnmount() {
    hotkeys.unbind('s');
  }

  onSearchTextChange(event) {
    const re = /^[0-9\b\s]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState({ searchText: event.target.value });
    }
  }

  /* eslint class-methods-use-this: 0 */
  /* eslint no-nested-ternary: 0 */
  getEnv() {
    const host = window.location.hostname.toUpperCase().split('.')[0].replace('CMOD', '');
    return (host === 'PROD' || host === '') ? '' : ((host === 'LOCALHOST' || host === '127') ? ' - LOCAL' : ` - ${host}`);
  }

  handleHotKeyPress = () => {
    this.textInput.current.focus();
  }

  handleSearchLoan(event) {
    if (event.charCode === 13 || event.key === 'Enter') {
      this.handleSearchLoanClick();
    }
  }

  handleSearchLoanClick() {
    const { refreshHook, searchText } = this.state;
    const { setBeginSearch, onClearSelectReject } = this.props;
    if (searchText) {
      this.shouldSearchLoan = true;
      this.setState({ refreshHook: !refreshHook });
      onClearSelectReject();
      setBeginSearch();
    }
  }

  handleProfileClick() {
    this.setState({ showProfileDetails: true });
  }

  handleProfileClose() {
    this.setState({ showProfileDetails: false });
  }

  handleLandingpage() {
    const {
      onAutoSave, onEndShift, enableGetNext, evalId, isAssigned, onClearStagerTaskName,
    } = this.props;
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
    onClearStagerTaskName();
    onEndShift(EndShift.CLEAR_DASHBOARD_DATA);
  }

  renderProfileDetails(user) {
    const { showProfileDetails } = this.state;
    const { getUserRole, setUserRole, features } = this.props;
    return (
      <Modal
        onClose={this.handleProfileClose}
        open={showProfileDetails}
        styleName="modal"
      >
        <Profile
          featureToggle={features.userGroupsToggle}
          groups={user && user.groupList}
          setRoleCallBack={setUserRole}
          skills={user && user.skills}
          userDetails={user && user.userDetails}
          userGroups={user.userGroups}
          userRole={getUserRole}
        />
      </Modal>
    );
  }

  render() {
    const { user, history } = this.props;
    const { searchText } = this.state;
    if (this.shouldSearchLoan) {
      this.shouldSearchLoan = false;
      history.push(`/search?loanNumber=${searchText}`);
    }
    return (
      <header styleName="header">
        <Link onClick={this.handleLandingpage} to="/">
          <img alt="logo" src="/static/img/logo.png" styleName="logo" />
        </Link>
        <span styleName="env">
          {this.getEnv()}
        </span>
        <span styleName="spacer" />
        <TextField
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={this.handleSearchLoanClick}>
                  <img alt="search" src="/static/img/search.png" styleName="searchIcon" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputRef={this.textInput}
          onChange={this.onSearchTextChange}
          onKeyPress={this.handleSearchLoan}
          placeholder="Search (Loan No)"
          styleName="searchStyle"
          value={searchText}
          varirant="filled"
        />
        <IconButton
          aria-label="Profile"
          onClick={this.handleProfileClick}
          styleName="profile-button"
        >
          <img alt="profile" src="/static/img/profile.png" styleName="profile" />
        </IconButton>
        {this.renderProfileDetails(user)}
      </header>
    );
  }
}

Header.defaultProps = {
  enableGetNext: false,
  evalId: '',
};

Header.propTypes = {
  clearSearch: PropTypes.bool.isRequired,
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string,
  features: PropTypes.shape({
    userGroupsToggle: PropTypes.bool,
  }).isRequired,
  getUserRole: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAssigned: PropTypes.bool.isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onClearSelectReject: PropTypes.func.isRequired,
  onClearStagerTaskName: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  setBeginSearch: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
  user: PropTypes.shape({
    skills: PropTypes.objectOf(PropTypes.array),
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  clearSearch: selectors.clearSearch(state),
  isAssigned: selectors.isAssigned(state),
  getUserRole: loginSelectors.getUserRole(state),
  features: configSelectors.getFeatures(state),
});

const mapDispatchToProps = dispatch => ({
  setUserRole: loginOperations.setUserRole(dispatch),
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),
  onClearSelectReject: operations.onClearSelectReject(dispatch),
  onClearStagerTaskName: operations.onClearStagerTaskName(dispatch),
  setBeginSearch: operations.setBeginSearch(dispatch),
});
const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

const TestExports = {
  Header,
};
export { TestExports };

export default withRouter(HeaderContainer);
