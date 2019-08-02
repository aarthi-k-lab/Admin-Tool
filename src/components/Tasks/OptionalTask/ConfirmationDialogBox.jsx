import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmationDialogBox = ({
  isOpen, title, message, onClose,
}) => (
  <>
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      open={isOpen}
    >
      <DialogTitle id="alert-dialog-title">
        { title }
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={() => onClose(false)}>
                No
        </Button>
        <Button autoFocus onClick={() => onClose(true)}>
                Yes
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

ConfirmationDialogBox.defaultProps = {
  isOpen: false,
  title: 'Message',
};

ConfirmationDialogBox.propTypes = {
  isOpen: PropTypes.bool,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default ConfirmationDialogBox;
