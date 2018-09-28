import React from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import './AlertBox.css';

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
    const { level, message } = this.props;
    const icon = this.constructor.getIcon(level);
    return (
      <div styleName={this.constructor.getBoxStyle(level)}>
        {icon}
        <span styleName="message">{message}</span>
      </div>
    );
  }
}

AlertBox.ERROR = 'error';
AlertBox.SUCCESS = 'success';

AlertBox.propTypes = {
  level: PropTypes.oneOf([AlertBox.ERROR, AlertBox.SUCCESS]).isRequired,
  message: PropTypes.string.isRequired,
};

export default AlertBox;
