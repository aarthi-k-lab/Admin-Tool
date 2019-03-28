import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './RadioButtonGroup.css';

class FormControlLabelWithTooltip extends FormControlLabel {
  render() {
    const { disableTooltip, tooltip } = this.props;
    if (disableTooltip) {
      return super.render();
    }
    return (
      <Tooltip
        classes={{
          tooltip: styles.tooltip,
        }}
        disableFocusListener
        disableTouchListener
        placement="right"
        title={tooltip}
      >
        {super.render()}
      </Tooltip>
    );
  }
}

FormControlLabelWithTooltip.defaultProps = {
  classes: {},
  disableTooltip: false,
};

FormControlLabelWithTooltip.propTypes = {
  classes: PropTypes.object, // eslint-disable-line
  disableTooltip: PropTypes.bool,
  tooltip: PropTypes.string.isRequired,
};

export default FormControlLabelWithTooltip;
