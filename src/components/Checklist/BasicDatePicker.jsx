import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

function BasicDatePicker(props) {
  const {
    disabled, label, format, refCallback,
  } = props;
  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
    refCallback(selectedDate);
  }, [selectedDate]);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        disabled={disabled}
        disableFuture
        format={format}
        label={label}
        onChange={handleDateChange}
        value={selectedDate}
        views={['year', 'month', 'date']}
      />
    </MuiPickersUtilsProvider>
  );
}

BasicDatePicker.defaultProps = {
  disabled: false,
  label: '',
};

BasicDatePicker.propTypes = {
  disabled: PropTypes.bool,
  format: PropTypes.string.isRequired,
  label: PropTypes.string,
  refCallback: PropTypes.func.isRequired,
};

export default BasicDatePicker;
