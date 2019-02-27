import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import styles from './RadioButtons.css';

function RadioButtons({
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
          options.map(({ displayName, value }) => (
            <FormControlLabel
              classes={{
                label: styles['radio-control-option-label'],
              }}
              control={<Radio styleName="radio-control-bubble" />}
              label={displayName}
              styleName="radio-control"
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
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  selectedValue: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default RadioButtons;
