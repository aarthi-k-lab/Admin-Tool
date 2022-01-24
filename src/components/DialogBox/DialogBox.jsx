import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DialogBox = ({
  isOpen, title, message, onClose, fullWidth, maxWidth,
}) => (
  <>
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={isOpen}
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus color="primary" onClick={onClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  </>
);

DialogBox.defaultProps = {
  fullWidth: undefined,
  isOpen: false,
  maxWidth: undefined,
  title: 'Message',
};

DialogBox.propTypes = {
  fullWidth: PropTypes.string,
  isOpen: PropTypes.bool,
  maxWidth: PropTypes.string,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default DialogBox;
