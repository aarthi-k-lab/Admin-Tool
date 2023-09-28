import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment-timezone';
import * as R from 'ramda';
import { makeStyles } from '@material-ui/core/styles';

const DATE_FORMAT = 'MM-DD-YYYY';
const useStyles = makeStyles({
  dialogroot: {
    '& .MuiDialogActions-root': {
      display: 'none',
    },
    '& .MuiPickersToolbar-toolbar': {
      minHeight: '48px',
      height: '50px',
    },
    '& .MuiPickersModal-dialogRoot': {
      marginTop: '-13%',
      marginLeft: '8%',
    },
  },
});

function BasicDatePicker(props) {
  const {
    disabled, onChange, value, additionalInfo, failureReason,
  } = props;
  let date = null;

  if (!R.isNil(value)) {
    date = moment(value).isValid() ? moment(value).format(DATE_FORMAT) : null;
  }
  const [datePicker, setDatePicker] = useState(date);
  const { disableFuture } = additionalInfo;
  useEffect(() => {
    if (disabled) {
      setDatePicker(null);
    }
  }, [disabled]);
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
  const classes = useStyles();
  return (
    <MuiPickersUtilsProvider
      utils={MomentUtils}
    >
      <KeyboardDatePicker
        autoOk
        DialogProps={{ className: classes.dialogroot }}
        disabled={disabled}
        disableDialogAction
        disableFuture={disableFuture}
        // disableToolbar
        error={isError}
        format={DATE_FORMAT}
        helperText=""
        inputVariant="outlined"
        KeyboardButtonProps={{
          'aria-label': 'change date',
          style: { padding: '0.2rem' },
        }}
        onAccept={onAccept}
        onBlur={onBlur}
        onChange={onChangeDatePickerHandler}
        position="top-start"
        size="small"
        value={datePicker}
      />
    </MuiPickersUtilsProvider>
  );
}

BasicDatePicker.defaultProps = {
  disabled: false,
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
  value: PropTypes.string.isRequired,
};

export default BasicDatePicker;
