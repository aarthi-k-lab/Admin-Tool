import React from 'react';
import PropTypes from 'prop-types';
import { ERROR, SUCCESS } from 'constants/common';
import AlertBox from './AlertBox';
import MessageBanner from './MessageBanner';

class UserNotification extends React.PureComponent {
  getProps(type) {
    const {
      level, message, open, dismissUserNotification,
    } = this.props;
    switch (type) {
      case this.constructor.ALERT_BOX:
        return { message, level };
      case this.constructor.MESSAGE_BANNER:
        return {
          message, level, open, dismissUserNotification,
        };
      default:
        return {};
    }
  }

  render() {
    const { className, type } = this.props;
    const Component = this.constructor.components[type];
    const componentProps = this.getProps(type);
    if (Component) {
      return (
        <Component className={className} {...componentProps} />
      );
    }
    return null;
  }
}

UserNotification.ALERT_BOX = 'alert-box';
UserNotification.MESSAGE_BANNER = 'message-banner';

UserNotification.components = {
  [UserNotification.ALERT_BOX]: AlertBox,
  [UserNotification.MESSAGE_BANNER]: MessageBanner,
};


UserNotification.defaultProps = {
  className: '',
  open: false,
  dismissUserNotification: () => {},
};

UserNotification.propTypes = {
  className: PropTypes.string,
  dismissUserNotification: PropTypes.func,
  level: PropTypes.oneOf([ERROR, SUCCESS]).isRequired,
  message: PropTypes.node.isRequired,
  open: PropTypes.bool,
  type: PropTypes.oneOf([
    UserNotification.ALERT_BOX,
    UserNotification.MESSAGE_BANNER,
  ]).isRequired,
};

export default UserNotification;
