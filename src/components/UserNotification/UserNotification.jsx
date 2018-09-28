import React from 'react';
import PropTypes from 'prop-types';
import AlertBox from './AlertBox';

class UserNotification extends React.PureComponent {
  getProps(type) {
    const { level, message } = this.props;
    switch (type) {
      case this.constructor.ALERT_BOX:
        return { message, level };
      default:
        return {};
    }
  }

  render() {
    const { type } = this.props;
    const Component = this.constructor.components[type];
    const componentProps = this.getProps(type);
    if (Component) {
      return (
        <Component {...componentProps} />
      );
    }
    return null;
  }
}

UserNotification.ALERT_BOX = 'alert-box';
UserNotification.components = {
  [UserNotification.ALERT_BOX]: AlertBox,
};

UserNotification.propTypes = {
  level: PropTypes.oneOf(['error', 'success']).isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    UserNotification.ALERT_BOX,
  ]).isRequired,
};

export default UserNotification;
