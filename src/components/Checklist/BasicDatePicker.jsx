import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import './Checklist.css';

function BasicDatePicker(props) {
  const {
    disabled, title, format, refCallback, value,
  } = props;
  const selectedDate = value && new Date(value);

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend" styleName="text-label">{title}</FormLabel>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          disabled={disabled}
          disableFuture
          format={format}
          onChange={refCallback}
          value={selectedDate}
          views={['year', 'month', 'date']}
        />
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
