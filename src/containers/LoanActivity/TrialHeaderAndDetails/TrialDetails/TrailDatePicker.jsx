import React, { useState } from 'react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';
import './TrialDetails.css';
import { operations } from 'ducks/dashboard';
import { connect } from 'react-redux';


function TrailDatePicker(props) {
  const {
    fbId, seq, fieldToUpdate, setTrialDateInfo, presentDate, disableSaveOperation,
  } = props;

  const [selectedDate, setSelectedDate] = useState(null);

  const onDateChange = (date) => {
    setSelectedDate(date);
    const payload = {
      fbId, seq, fieldToUpdate, updatedDate: date ? date.toISOString() : '',
    };
    setTrialDateInfo(payload);
    disableSaveOperation(false);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        format="MM/DD/YYYY"
        id="date-picker-dialog"
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        margin="normal"
        onChange={onDateChange}
        styleName="datePicker"
        value={presentDate !== '01/01/0001'
          ? presentDate : selectedDate}
      />
    </MuiPickersUtilsProvider>
  );
}

TrailDatePicker.propTypes = {
  disableSaveOperation: PropTypes.func.isRequired,
  fbId: PropTypes.string.isRequired,
  fieldToUpdate: PropTypes.string.isRequired,
  presentDate: PropTypes.string.isRequired,
  seq: PropTypes.string.isRequired,
  setTrialDateInfo: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  setTrialDateInfo: operations.setTrialDateInfo(dispatch),
  disableSaveOperation: operations.disableSaveOperation(dispatch),

});

export default connect(null, mapDispatchToProps)(TrailDatePicker);
