import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
} from '@material-ui/core';
import DialogForm from './DialogForm';
import './ConfirmDialog.css';

const ConfirmationDialog = (props) => {
  const {
    isOpen, handleClose, saveFn = () => {}, cancelFn = () => {}, isMaLoan,
  } = props;
  const defaultValues = {
    mmoSelection: '', mmoDate: '', dispositionOption: '', soiReceived: '', mmoOption: '',
  };
  const [disableSave, setDisableSave] = useState(true);
  const [values, setValues] = useState(defaultValues);

  useEffect(() => {
    if (!isOpen) {
      setValues(defaultValues);
    }
  }, [isOpen]);

  useEffect(() => {
    const {
      dispositionOption, soiReceived, mmoOption, mmoSelection,
    } = values;
    if (dispositionOption && soiReceived) {
      if ((isMaLoan && mmoOption === 'No')
      || (isMaLoan && mmoOption === 'Yes' && mmoSelection)
      || (!isMaLoan && !mmoOption)) {
        setDisableSave(false);
      } else {
        setDisableSave(true);
      }
    } else { setDisableSave(true); }
  }, [values]);

  return (
    <Dialog
      onClose={() => {
        handleClose();
        setValues(defaultValues);
      }}
      open={isOpen}
      PaperProps={{
        style: {
          minWidth: '40%', borderRadius: '10px', backgroundColor: '#FFFFFF',
        },
      }}
      styleName="confirmationDialog"
    >
      <DialogTitle>
        <span styleName="alertTitle">
          {'Confirmation Dialog'}
        </span>
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          <DialogForm isMaLoan={isMaLoan} setValues={setValues} values={values} />
        </Typography>
      </DialogContent>
      <DialogActions styleName="dialogButtons">
        <Button
          disabled={disableSave}
          onClick={() => saveFn(values)}
          styleName={disableSave ? 'disabledSaveButton' : 'saveButton'}
          variant="contained"
        >
Save

        </Button>
        <Button
          color="secondary"
          disabled={false}
          onClick={() => { cancelFn(); setValues({}); }}
          styleName="cancelButton"
          variant="outlined"
        >
        Cancel

        </Button>
      </DialogActions>
    </Dialog>
  );
};


ConfirmationDialog.defaultProps = {
  handleClose: () => {},
  isMaLoan: false,
};

ConfirmationDialog.propTypes = {
  cancelFn: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  isMaLoan: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  saveFn: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
