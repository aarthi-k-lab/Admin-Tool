import React, { useState } from 'react';
import * as R from 'ramda';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import PropTypes from 'prop-types';
import './TrialDetails.css';
import { operations } from 'ducks/dashboard';
import { selectors as loginSelectors } from 'ducks/login';
import { connect } from 'react-redux';


function TrailDatePicker(props) {
  const {
    fbId, seq, fieldToUpdate, setTrialDateInfo, presentDate, disableSaveOperation, user,
  } = props;
  const { groupList, userGroups } = user;
  const [selectedDate, setSelectedDate] = useState(null);

  let isNonBetaUser = false;
  groupList.forEach((group) => {
    if (userGroups
      && !R.equals(group, 'BETA')
      && !R.equals(R.findIndex(R.propEq('groupName', group.toLowerCase()))(userGroups), -1)
    ) { isNonBetaUser = true; }
  });

  const onDateChange = (date) => {
    setSelectedDate(date);
    const payload = {
      fbId, seq, fieldToUpdate, updatedDate: date ? date.toISOString(true) : '',
    };
    setTrialDateInfo(payload);
    disableSaveOperation(false);
  };

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <KeyboardDatePicker
        disabled={!isNonBetaUser}
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
  user: PropTypes.shape({
    groupList: PropTypes.array,
    userGroups: PropTypes.array,
  }).isRequired,
};

const mapStateToProps = state => ({
  user: loginSelectors.getUser(state),
});

const mapDispatchToProps = dispatch => ({
  setTrialDateInfo: operations.setTrialDateInfo(dispatch),
  disableSaveOperation: operations.disableSaveOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TrailDatePicker);
