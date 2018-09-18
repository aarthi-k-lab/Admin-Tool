import React from 'react';
import Modal from '@material-ui/core/Modal';
import IconButton from '@material-ui/core/IconButton';
import Auth from 'lib/Auth';
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

  static renderName() {
    const auth = Auth.getInstance();
    const { name } = auth.getUserDetails();
    return (
      <span styleName="name">{name}</span>
    );
  }

  handleClick() {
    this.setState({ showProfileDetails: true });
  }

  handleClose() {
    this.setState({ showProfileDetails: false });
  }

  renderProfileDetails() {
    const { showProfileDetails } = this.state;
    return (
      <Modal
        onClose={this.handleClose}
        open={showProfileDetails}
        styleName="modal"
      >
        <Profile email="Jon.Snow@mrcooper.com" groups={['beuw', 'feuw']} name="Jon Snow" />
      </Modal>
    );
  }

  render() {
    return (
      <header styleName="header">
        <img alt="logo" src="/static/img/logo.png" />
        <span styleName="spacer" />
        <img alt="search" src="/static/img/search.png" styleName="search" />
        {this.constructor.renderName()}
        <IconButton aria-label="Profile" onClick={this.handleClick}>
          <img alt="profile" src="/static/img/profile.png" />
        </IconButton>
        {this.renderProfileDetails()}
      </header>
    );
  }
}

export default Header;
