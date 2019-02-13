import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DialogBox extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    const { isDialogOpen } = this.props;
    this.state = {
      open: isDialogOpen,
    };
  }

  componentWillReceiveProps() {
    const { isDialogOpen } = this.props;
    this.state = {
      open: isDialogOpen,
    };
  }

  handleClose() {
    this.setState({ open: false });
  }


  render() {
    const { open: isDialogOpen } = this.state;
    const { message } = this.props;
    return (
      <>
        <Dialog
          aria-describedby="alert-dialog-description"
          aria-labelledby="alert-dialog-title"
          onClose={this.handleClose}
          open={isDialogOpen}
        >
          <DialogTitle id="alert-dialog-title">Message </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { message }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
                  OK
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

DialogBox.defaultProps = {
  isDialogOpen: false,
  message: '',
};

DialogBox.propTypes = {
  isDialogOpen: PropTypes.bool,
  message: PropTypes.string,
};

export default DialogBox;
