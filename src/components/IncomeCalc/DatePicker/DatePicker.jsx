import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import './DatePicker.css';
import Box from '@material-ui/core/Box';
import moment from 'moment-timezone';
import { getStyleName } from 'constants/incomeCalc/styleName';

const DATE_FORMAT = 'MM-DD-YYYY';

function BasicDatePicker(props) {
  const {
    disabled, title, onChange, value, additionalInfo,
  } = props;
  const [datePicker, setDatePicker] = useState(value);
  const { hasTitle, styleName } = additionalInfo;
  const onChangeDatePickerHandler = (event) => {
    const date = moment(event).format(DATE_FORMAT);
    setDatePicker(date);
    onChange(date);
  };
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
          format={DATE_FORMAT}
          inputVariant="outlined"
          KeyboardButtonProps={{
            'aria-label': 'change date',
            style: { padding: '0.2rem' },
          }}
          onChange={onChangeDatePickerHandler}
          size="small"
          styleName={getStyleName('datePicker', styleName, 'picker')}
          value={datePicker}
        />
      </MuiPickersUtilsProvider>
    </Box>
  );
}

BasicDatePicker.defaultProps = {
  disabled: false,
  title: '',
  additionalInfo: { hasTitle: false, styleName: '' },
};

BasicDatePicker.propTypes = {
  additionalInfo: PropTypes.shape({
    hasTitle: PropTypes.bool,
    styleName: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
};

export default BasicDatePicker;
