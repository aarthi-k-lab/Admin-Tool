import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import './Checklist.css';
import * as R from 'ramda';
import moment from 'moment-timezone';

function BasicDatePicker(props) {
  const {
    disabled, title, format, refCallback, value,
  } = props;
  const StartDate = R.isNil(value) ? moment().format('MM-DD-YYYY') : moment(value).format('MM-DD-YYYY');
  const [selectedDate, setSelectedDate] = useState(StartDate);

  useEffect(() => {
    if (!value) {
      refCallback(selectedDate);
    }
  }, [selectedDate]);

  const onDateChange = (date) => {
    setSelectedDate(date);
    refCallback(date);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" styleName="text-label">
        {title}
      </FormLabel>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <div>
          <DatePicker
            disabled={disabled}
            disableFuture
            format={format}
            onChange={onDateChange}
            value={selectedDate}
            views={['year', 'month', 'date']}
          />
        </div>
      </MuiPickersUtilsProvider>
    </FormControl>
  );
}

BasicDatePicker.defaultProps = {
  disabled: false,
  title: '',
};

BasicDatePicker.propTypes = {
  disabled: PropTypes.bool,
  format: PropTypes.string.isRequired,
  refCallback: PropTypes.func.isRequired,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default BasicDatePicker;
