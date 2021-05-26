import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import * as R from 'ramda';
import { FormControlLabelWithTooltip } from 'components/RadioButtonGroup';
import Box from '@material-ui/core/Box';
import styles from './RadioButtons.css';


const getLabel = (displayName, labels, labelValues, labelValueAdornment) => (
  <Box>
    {displayName}
    {labels.map(label => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}
      >
        <Box style={{ fontSize: '0.7rem' }}>{label}</Box>
        <Box style={{ fontWeight: '600', marginLeft: '1.3rem' }}>{`${labelValueAdornment} ${R.propOr('', label, labelValues)}`}</Box>
      </div>
    ))}
  </Box>
);

function RadioButtons({
  disabled,
  onChange,
  options,
  title,
  selectedValue,
  additionalInfo,
}) {
  const [radioButtonValue, setRadioButtonValue] = useState(selectedValue);
  const { labels, styleName, labelValueAdornment } = additionalInfo;
  const isOptionDisabled = (isEnabled) => {
    if (disabled || (isEnabled === false)) {
      return true;
    }
    return false;
  };
  const onChangeRadioGroupHandler = (event) => {
    setRadioButtonValue(event.target.value);
    onChange(event);
  };
  return (
    <div style={{ padding: '1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Typography component="legend">{title}</Typography>
        <RadioGroup
          onChange={onChangeRadioGroupHandler}
          row
          style={{ paddingLeft: '3rem' }}
          value={radioButtonValue}
        >
          {
          options.map(({
            displayName, value, hint, isEnabled, textColor, labelValues,
          }) => (
            <FormControlLabelWithTooltip
              key={displayName}
              classes={{
                label: styles[`radio-control-option-${textColor}`],
                root: styles['radio-control'],
              }}
              control={<Radio styleName="radio-control-bubble" />}
              disabled={isOptionDisabled(isEnabled)}
              disableTooltip={R.isNil(hint) || R.isEmpty(hint)}
              label={labels
                ? getLabel(displayName, labels, labelValues, labelValueAdornment) : displayName}
              styleName={styleName || 'radio-control'}
              tooltip={hint}
              value={value}
            />
          ))
        }
        </RadioGroup>
      </div>
    </div>
  );
}

RadioButtons.defaultProps = {
  selectedValue: null,
  additionalInfo: {
    styleName: 'displayColumn',
    labelValueAdornment: '',
  },
};

RadioButtons.propTypes = {
  additionalInfo: PropTypes.shape({
    customType: PropTypes.string,
    labels: PropTypes.arrayOf(),
    labelValueAdornment: PropTypes.string,
    row: PropTypes.bool,
    styleName: PropTypes.string,
  }),
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    hint: PropTypes.string,
    isEnabled: PropTypes.bool,
    textColor: PropTypes.string,
    value: PropTypes.string.isRequired,
  })).isRequired,
  selectedValue: PropTypes.string,
  title: PropTypes.string.isRequired,

};

export default RadioButtons;
