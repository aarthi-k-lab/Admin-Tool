import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as R from 'ramda';
import { FormControlLabelWithTooltip } from 'components/RadioButtonGroup';
import styles from './RadioButtons.css';

function RadioButtons({
  disabled,
  onChange,
  options,
  title,
  selectedValue,
}) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" styleName="radio-control-label">{title}</FormLabel>
      <RadioGroup
        aria-label="Gender"
        name="gender1"
        onChange={onChange}
        value={selectedValue}
      >
        {
          options.map(({ displayName, value, hint }) => (
            <FormControlLabelWithTooltip
              classes={{
                label: styles['radio-control-option-label'],
              }}
              control={<Radio styleName="radio-control-bubble" />}
              disabled={disabled}
              disableTooltip={R.isNil(hint) || R.isEmpty(hint)}
              label={displayName}
              styleName="radio-control"
              tooltip={hint}
              value={value}
            />
          ))
        }
      </RadioGroup>
    </FormControl>
  );
}

RadioButtons.defaultProps = {
  selectedValue: null,
};

RadioButtons.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    value: PropTypes.string.isRequired,
  })).isRequired,
  selectedValue: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default RadioButtons;
