import React from 'react';
import PropTypes from 'prop-types';
import { ERROR, SUCCESS } from 'constants/common';
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
UserNotification.components = {
  [UserNotification.ALERT_BOX]: AlertBox,
};

UserNotification.defaultProps = {
  className: '',
};

UserNotification.propTypes = {
  className: PropTypes.string,
  level: PropTypes.oneOf([ERROR, SUCCESS]).isRequired,
  message: PropTypes.node.isRequired,
  type: PropTypes.oneOf([
    UserNotification.ALERT_BOX,
  ]).isRequired,
};

export default UserNotification;
