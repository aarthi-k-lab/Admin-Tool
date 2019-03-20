import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import styles from './AlertBox.css';

class AlertBox extends React.PureComponent {
  static getIcon(level) {
    switch (level) {
      case this.ERROR:
        return <WarningIcon styleName="error-icon" />;
      case this.SUCCESS:
        return <CheckCircleIcon styleName="success-icon" />;
      default:
        return null;
    }
  }

  static getBoxStyle(level) {
    switch (level) {
      case this.ERROR:
        return 'alert-box--error';
      case this.SUCCESS:
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

AlertBox.ERROR = 'error';
AlertBox.SUCCESS = 'success';

AlertBox.defaultProps = {
  className: '',
};

AlertBox.propTypes = {
  className: PropTypes.string,
  level: PropTypes.oneOf([AlertBox.ERROR, AlertBox.SUCCESS]).isRequired,
  message: PropTypes.node.isRequired,
};

export default AlertBox;
