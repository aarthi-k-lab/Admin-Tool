import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmationDialogBox = props => (
    <>
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        open={props.isOpen}
      >
        <DialogTitle id="alert-dialog-title">
          { props.title ? props.title : 'Message'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus color="primary" onClick={() => props.onClose(false)}>
                No
          </Button>
          <Button autoFocus onClick={() => props.onClose(true)}>
                Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
);


export default ConfirmationDialogBox;
