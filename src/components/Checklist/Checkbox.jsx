import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import * as R from 'ramda';
import { FormControlLabelWithTooltip } from 'components/RadioButtonGroup';
import styles from './RadioButtons.css';

function CheckBox({
  onChange,
  options,
  title,
  selectedValue,
}) {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" styleName="radio-control-label">{title}</FormLabel>
      <div
        aria-label="Gender"
        name="gender1"
        onChange={onChange}
        value={selectedValue}
      >
        {
          options.map(({
            displayName, hint, value,
          }) => (
            <div>
              <FormControlLabelWithTooltip
                key={displayName}
                classes={{
                  label: styles['radio-control-option-label'],
                  root: styles['radio-control'],
                }}
                control={<Checkbox checked={R.contains(value, selectedValue)} styleName="radio-control-bubble" />}
                disableTooltip={R.isNil(hint) || R.isEmpty(hint)}
                label={displayName}
                styleName="radio-control"
                tooltip={hint}
                value={value}
              />
            </div>
          ))
        }
      </div>
    </FormControl>
  );
}

CheckBox.defaultProps = {
  selectedValue: null,
};

CheckBox.propTypes = {
  //   disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    isEnabled: PropTypes.bool,
    textColor: PropTypes.string,
    value: PropTypes.string.isRequired,
  })).isRequired,
  selectedValue: PropTypes.objectOf(PropTypes.array),
  title: PropTypes.string.isRequired,
};

export default CheckBox;