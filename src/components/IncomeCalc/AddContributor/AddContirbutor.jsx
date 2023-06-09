
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Select,
  MenuItem,
  Button,
  TextField,
  FormControl,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './AddContributor.css';
import { operations as docChecklistOperations } from 'ducks/document-checklist';
import { operations as incomeCalcChecklistOperations } from 'ducks/income-calculator';
import { FORMAT } from '../../../lib/Formatters';
import { CONTRIBUTOR_AFFL_CODE, ASSUMPTOR_AFFL_CODE } from '../../../constants/incomeCalc/DocumentList';

function AddContributor(props) {
  const {
    onClose, saveContributor, checklistType, addContributorOperation,
  } = props;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [ssn, setSsn] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [typeOfUser, setTypeOfUser] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);


  const AddContribPopupClose = () => {
    onClose();
  };

  const isRequiredFieldsFilled = () => firstName !== '' && lastName !== '' && typeOfUser !== '';

  const handleAdd = () => {
    if (isRequiredFieldsFilled) {
      const isDobNil = dateOfBirth === '';
      const dob = dateOfBirth.split('-');
      const contributorFields = {
        firstName,
        lastName,
        emailAddress: email !== '' ? email : null,
        phoneNumber: phone !== '' ? phone : null,
        birthDate: !isDobNil ? `${dob[1]}-${dob[2]}-${dob[0]}` : '',
        borrowerAffilCd: typeOfUser,
        taxpyrIdVal: ssn !== '' ? ssn : null,
      };
      if (checklistType === 'Fico') {
        addContributorOperation(contributorFields);
      } else {
        saveContributor(contributorFields);
      }
      AddContribPopupClose();
    }
  };


  const disableDates = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    const minAgeDate = new Date();
    minAgeDate.setFullYear(currentDate.getFullYear());
    return selectedDate > minAgeDate;
  };


  return (
    <Dialog
      onClose={AddContribPopupClose}
      open
      PaperProps={{
        style: {
          borderRadius: '10px',
          border: '1px solid #4E586E',
          maxWidth: '700px',
        },
      }}
    >
      <DialogTitle>
        <Grid container>
          <Grid item styleName="add-contrib-pop-grid-title" xs={20}>
            <Typography
              styleName="add-contrib-pop-grid-title-name"
            >
           Add Contributor
            </Typography>
          </Grid>
          <Grid item styleName="add-contrib-pop-grid-close-icon">
            <IconButton onClick={AddContribPopupClose} style={{ height: '30px', width: '30px' }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{ overflow: 'hidden' }}>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item styleName="add-contrib-label" xs={4}>
                <div>
                 First Name
                  {' '}
                  <span styleName="required">*</span>
                </div>
              </Grid>
              <Grid item xs={3}>
                <TextField id="outlined-required" onChange={e => setFirstName(e.target.value)} size="small" value={firstName} variant="outlined" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item styleName="add-contrib-label" xs={4}>
                <div>
                  Last Name
                  {' '}
                  <span styleName="required">*</span>
                </div>

              </Grid>
              <Grid item xs={3}>
                <TextField id="outlined-required" onChange={e => setLastName(e.target.value)} size="small" value={lastName} variant="outlined" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item styleName="add-contrib-label" xs={4}>
                <div>
                  SSN
                  {' '}
                </div>

              </Grid>
              <Grid item xs={3}>
                <TextField id="outlined-required" onChange={e => setSsn(e.target.value)} size="small" value={FORMAT.ssn(ssn.toString())} variant="outlined" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item styleName="add-contrib-label" xs={4}><div>DOB</div></Grid>
              <Grid item xs={3}>
                <TextField
                  id="outlined-required"
                  inputProps={{
                    max: new Date().toISOString().split('T')[0],
                    disabled: disableDates(dateOfBirth),
                  }}
                  onBlur={() => setIsDatePickerOpen(true)}
                  onChange={e => setDateOfBirth(e.target.value)}
                  onFocus={() => setIsDatePickerOpen(false)}
                  open={isDatePickerOpen}
                  size="small"
                  style={{ width: '14.9rem' }}
                  type="date"
                  value={dateOfBirth}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item styleName="add-contrib-label" xs={4}><div>Email</div></Grid>
              <Grid item xs={3}>
                <TextField id="outlined-required" onChange={e => setEmail(e.target.value)} size="small" value={email} variant="outlined" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item styleName="add-contrib-label" xs={4}><div>Phone</div></Grid>
              <Grid item xs={3}>
                <FormControl>
                  <TextField id="outlined-required" onChange={e => setPhone(e.target.value)} required size="small" value={FORMAT.phone(phone.toString())} variant="outlined" />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={2}>
              <Grid item styleName="add-contrib-label" xs={4}>
                <div>
                  Type Of User
                  {' '}
                  <span styleName="required">*</span>
                </div>

              </Grid>
              <Grid item xs={3}>
                <Select
                  onChange={e => setTypeOfUser(e.target.value)}
                  required
                  size="small"
                  styleName="add-contrib-select"
                  value={typeOfUser}
                  variant="outlined"
                >
                  <MenuItem styleName="user-type-menu-item" value="">Select</MenuItem>
                  <MenuItem styleName="user-type-menu-item" value={CONTRIBUTOR_AFFL_CODE}>Contributor</MenuItem>
                  <MenuItem styleName="user-type-menu-item" value={ASSUMPTOR_AFFL_CODE}>Assumptor</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button disabled={!isRequiredFieldsFilled()} onClick={handleAdd} styleName="add">Add</Button>
        <Button onClick={AddContribPopupClose} styleName="cancel">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

AddContributor.defaultProps = {
  checklistType: '',
};

AddContributor.propTypes = {
  addContributorOperation: PropTypes.func.isRequired,
  checklistType: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  saveContributor: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  saveContributor: docChecklistOperations.addContributorOperation(dispatch),
  addContributorOperation: incomeCalcChecklistOperations.addContributorOperation(dispatch),
});

export default connect(null, mapDispatchToProps)(AddContributor);
