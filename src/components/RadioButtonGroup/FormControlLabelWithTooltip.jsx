import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Tooltip from '@material-ui/core/Tooltip';
import styles from './RadioButtonGroup.css';

const FormControlLabelWithTooltip = ({
  classes, control, disabled, disableTooltip, label, styleName, tooltip, value,
}) => {
  if (disableTooltip) {
    return (
      <FormControlLabel
        classes={classes}
        control={control}
        disabled={disabled}
        label={label}
        styleName={styleName}
        value={value}
      />
    );
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
      <FormControlLabel
        classes={classes}
        control={control}
        disabled={disabled}
        label={label}
        styleName={styleName}
        value={value}
      />
    </Tooltip>
  );
};

FormControlLabelWithTooltip.defaultProps = {
  classes: {},
  disabled: false,
  disableTooltip: false,
  styleName: '',
  value: '',
  tooltip: '',
};

FormControlLabelWithTooltip.propTypes = {
  classes: PropTypes.object, // eslint-disable-line
  control: PropTypes.object.isRequired, // eslint-disable-line
  disabled: PropTypes.bool,
  disableTooltip: PropTypes.bool,
  label: PropTypes.string.isRequired,
  styleName: PropTypes.string,
  tooltip: PropTypes.string,
  value: PropTypes.string,
};

export default FormControlLabelWithTooltip;
