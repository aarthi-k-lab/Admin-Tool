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
import Profile from './Profile';
import { operations, selectors } from '../../state/ducks/dashboard';
import './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
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

  componentWillReceiveProps(nextProps) {
    const { clearSearch } = nextProps;
    if (clearSearch) {
      this.setState({ searchText: '' });
    }
  }

  onSearchTextChange(event) {
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState({ searchText: event.target.value });
    }
  }

  /* eslint class-methods-use-this: 0 */
  /* eslint no-nested-ternary: 0 */
  getEnv() {
    const host = window.location.hostname.toUpperCase().split('.')[0].replace('CMOD', '');
    return (host === 'PROD' || host === '') ? '' : (host === 'LOCALHOST' ? ' - LOCAL' : ` - ${host}`);
  }

  handleSearchLoan(event) {
    if (event.charCode === 13 || event.key === 'Enter') {
      this.handleSearchLoanClick();
    }
  }

  handleSearchLoanClick() {
    const { refreshHook, searchText } = this.state;
    if (searchText) {
      this.shouldSearchLoan = true;
      this.setState({ refreshHook: !refreshHook });
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
      onAutoSave, onEndShift, enableGetNext, evalId, isAssigned,
    } = this.props;
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
    }
    onEndShift(EndShift.CLEAR_DASHBOARD_DATA);
  }

  static renderName(userDetails) {
    return (
      <span styleName="name">{userDetails && userDetails.name}</span>
    );
  }

  renderProfileDetails(user) {
    const { showProfileDetails } = this.state;
    return (
      <Modal
        onClose={this.handleProfileClose}
        open={showProfileDetails}
        styleName="modal"
      >
        <Profile
          groups={user && user.groupList}
          skills={user && user.skills}
          userDetails={user && user.userDetails}
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
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={this.handleSearchLoanClick}>
                  <img alt="search" src="/static/img/search.png" styleName="searchIcon" />
                </IconButton>
              </InputAdornment>
            ),
          }}
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
};

Header.propTypes = {
  clearSearch: PropTypes.bool.isRequired,
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  isAssigned: PropTypes.bool.isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
  user: PropTypes.shape({
    skills: PropTypes.objectOf(PropTypes.string).isRequired,
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
});

const mapDispatchToProps = dispatch => ({
  onAutoSave: operations.onAutoSave(dispatch),
  onEndShift: operations.onEndShift(dispatch),

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
