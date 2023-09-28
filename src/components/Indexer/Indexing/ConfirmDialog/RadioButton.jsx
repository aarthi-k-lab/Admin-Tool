import React from 'react';
import {
  FormControl, FormControlLabel, FormLabel, Radio, FormHelperText, RadioGroup,
} from '@material-ui/core';
import {
  arrayOf, any, string, bool, shape, func,
} from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  customRadioSize: {
    '& .MuiFormGroup-root': {
      paddingLeft: '16px',
    },
    '& .MuiSvgIcon-root': {
      width: '12px',
      height: '12px',
    },
    '& .Mui-checked': {
      color: '#5d97f6',
    },
    '& .MuiFormLabel-root': {
      color: '#4E586E',
      fontWeight: '700 !important',
      fontSize: '1.1rem',
      paddingBottom: '4px',
    },
    '& .MuiRadio-root': {
      paddingRight: '5px',
    },
    '& .MuiFormControlLabel-root': {
      marginBottom: '-8px',
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '1.1rem',
      fontWeight: '400',
    },
  },
}));

const RadioButtons = ({
  disabled = false,
  inputRef,
  options,
  title,
  helperText,
  labelPlacement,
  additionalInfo,
  ...rest
}) => {
  const classes = useStyles();
  return (
    <FormControl
      className={`${classes.customRadioSize}`}
      style={additionalInfo.negativeMargin ? { marginTop: '-135px', marginLeft: '25px' } : {}}
    >
      {title && <FormLabel>{title}</FormLabel>}
      <RadioGroup {...rest}>
        {options.map((option, index) => {
          const radioKey = index + 1;
          return (
            <FormControlLabel
              key={radioKey}
              control={<Radio />}
              disabled={option.disabled || disabled}
              inputRef={inputRef}
              label={option.label}
              labelPlacement={labelPlacement || 'end'}
              style={additionalInfo.margin && radioKey === 2 ? { marginTop: '125px' } : {}}
              value={option.value || ''}
            />
          );
        })}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

RadioButtons.defaultProps = {
  disabled: false,
  helperText: '',
  inputRef: () => {},
  labelPlacement: 'end',
  additionalInfo: {},
  title: undefined,
};

RadioButtons.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  additionalInfo: any,
  disabled: bool,
  helperText: string,
  inputRef: func,
  labelPlacement: string,
  options: arrayOf(
    shape({
      label: string.isRequired,
      value: any.isRequired,
      disabled: bool.isRequired,
    }).isRequired,
  ).isRequired,
  title: string,
};

export default RadioButtons;
