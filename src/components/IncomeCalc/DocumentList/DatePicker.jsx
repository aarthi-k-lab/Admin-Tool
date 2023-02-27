/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

export default function Date({ date, onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const renderInput = p => (
    <Typography onChange={p.onChange} onClick={p.onClick} style={{ cursor: 'pointer' }}>
      {p.value}
    </Typography>
  );

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        disableToolbar
        emptyLabel="MM/DD/YYYY"
        format="MM/DD/YYYY"
        onChange={onDateChange}
        TextFieldComponent={renderInput}
        value={selectedDate}
      />
    </MuiPickersUtilsProvider>
  );
}

Date.defaultProps = {
  date: null,
};

Date.propTypes = {
  date: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
};
