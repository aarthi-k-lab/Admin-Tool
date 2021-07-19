import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import { ERROR, SUCCESS } from 'constants/common';
import styles from './AlertBox.css';

class AlertBox extends React.PureComponent {
  static getIcon(level) {
    switch (level) {
      case ERROR:
        return <WarningIcon styleName="error-icon" />;
      case SUCCESS:
        return <CheckCircleIcon styleName="success-icon" />;
      default:
        return null;
    }
  }

  static getBoxStyle(level) {
    switch (level) {
      case ERROR:
        return 'alert-box--error';
      case SUCCESS:
        return 'alert-box--success';
      default:
        return 'alert-box';
    }
  }

  render() {
    const { className, level, message } = this.props;
    const icon = this.constructor.getIcon(level);
    return (
      <div className={classnames(className, styles[this.constructor.getBoxStyle(level)])}>
        {icon}
        <span styleName="message">{message}</span>
      </div>
    );
  }
}


AlertBox.defaultProps = {
  className: '',
};

AlertBox.propTypes = {
  className: PropTypes.string,
  level: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default AlertBox;
