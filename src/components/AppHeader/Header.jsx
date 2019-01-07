import React from 'react';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Profile from './Profile';
import './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProfileDetails: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClick() {
    this.setState({ showProfileDetails: true });
  }

  handleClose() {
    this.setState({ showProfileDetails: false });
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
        onClose={this.handleClose}
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
    const { user } = this.props;
    const userDetails = user && user.userDetails;
    return (
      <header styleName="header">
        <Link to="/">
          <img alt="logo" src="/static/img/logo.png" styleName="logo" />
        </Link>
        <span styleName="spacer" />
        <img alt="search" src="/static/img/search.png" styleName="search" />
        {this.constructor.renderName(userDetails)}
        <IconButton
          aria-label="Profile"
          onClick={this.handleClick}
          styleName="profile-button"
        >
          <img alt="profile" src="/static/img/profile.png" styleName="profile" />
        </IconButton>
        {this.renderProfileDetails(user)}
      </header>
    );
  }
}

Header.propTypes = {
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

export default Header;
