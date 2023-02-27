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
    disabled, title, onChange, value, additionalInfo, failureReason, editable,
  } = props;
  let date = null;
  if (!R.isNil(value)) {
    date = moment(value).isValid() ? moment(value).format(DATE_FORMAT) : null;
  }
  if (!editable) {
    date = moment(new Date()).isValid() ? moment(new Date()).format(DATE_FORMAT) : null;
  }

  const [datePicker, setDatePicker] = useState(date);
  const { hasTitle, styleName, disableFuture } = additionalInfo;
  const onChangeDatePickerHandler = (selectedDate) => {
    if (selectedDate && selectedDate.isValid()) {
      setDatePicker(selectedDate.format(DATE_FORMAT));
    } else {
      date = R.propOr('', '_i', selectedDate);
      setDatePicker(date);
    }
  };

  const onBlur = () => {
    onChange(datePicker);
  };

  const onAccept = (newDate) => {
    const formattedDate = moment(newDate).format(DATE_FORMAT);
    setDatePicker(formattedDate);
    onChange(formattedDate);
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
          disableFuture={disableFuture}
          error={isError}
          format={DATE_FORMAT}
          helperText=""
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
          onAccept={onAccept}
          onBlur={onBlur}
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
  editable: true,
};

BasicDatePicker.propTypes = {
  additionalInfo: PropTypes.shape({
    disableFuture: PropTypes.bool,
    hasTitle: PropTypes.bool,
    styleName: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  editable: PropTypes.bool,
  failureReason: PropTypes.arrayOf(PropTypes.shape()),
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default BasicDatePicker;
