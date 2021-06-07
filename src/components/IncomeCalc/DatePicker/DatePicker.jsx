import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import './DatePicker.css';
import Box from '@material-ui/core/Box';
import moment from 'moment-timezone';
import { getStyleName } from 'constants/incomeCalc/styleName';
import * as R from 'ramda';
import { makeStyles } from '@material-ui/core/styles';

const DATE_FORMAT = 'MM-DD-YYYY';
const useStyles = makeStyles({
  root: {},
  warning: {
    borderColor: '#ffa400',
  },
});
function BasicDatePicker(props) {
  const {
    disabled, title, onChange, value, additionalInfo, failureReason,
  } = props;
  const [datePicker, setDatePicker] = useState(value);
  const { hasTitle, styleName, disableFuture } = additionalInfo;
  const onChangeDatePickerHandler = (event) => {
    const date = moment(event);
    setDatePicker(date.format(DATE_FORMAT));
    if (date.isValid() && (!disableFuture || date.isBefore())) {
      onChange(date.format(DATE_FORMAT));
    }
  };
  const isError = !R.isNil(failureReason) && !R.isEmpty(R.filter(item => R.equals(item.level, 1),
    failureReason));
  const isWarning = !R.isNil(failureReason)
  && !R.isEmpty(R.filter(item => R.equals(item.level, 2), failureReason));
  const classes = useStyles();
  const getStyles = () => `${getStyleName('datePicker', styleName, 'picker')}`;
  return (
    <Box styleName={getStyleName('datePicker', styleName, 'div')}>
      {hasTitle && (
        <p component="legend" styleName={getStyleName('datePicker', styleName, 'title')}>
          {title}
        </p>
      )}
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          disabled={disabled}
          disableFuture
          error={isError}
          format={DATE_FORMAT}
          InputProps={{
            classes: {
              notchedOutline: isWarning ? classes.warning : classes.root,
            },
          }}
          inputVariant="outlined"
          KeyboardButtonProps={{
            'aria-label': 'change date',
            style: { padding: '0.2rem' },
          }}
          onChange={onChangeDatePickerHandler}
          size="small"
          styleName={getStyles()}
          value={datePicker}
        />
      </MuiPickersUtilsProvider>
    </Box>
  );
}

BasicDatePicker.defaultProps = {
  disabled: false,
  title: '',
  additionalInfo: { hasTitle: false, styleName: '', disableFuture: false },
  failureReason: [],
};

BasicDatePicker.propTypes = {
  additionalInfo: PropTypes.shape({
    disableFuture: PropTypes.bool,
    hasTitle: PropTypes.bool,
    styleName: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  failureReason: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default BasicDatePicker;
