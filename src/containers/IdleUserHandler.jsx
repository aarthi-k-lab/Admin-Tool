import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IdleTimer from 'react-idle-timer';
import { connect } from 'react-redux';
import {
  operations as dashboardOperations, selectors,
} from 'ducks/dashboard';

class IdleUserHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.clearTime = undefined;
    this.idleTimer = null;
    this.onAction = () => {};
    this.onActive = () => {};
    this.onIdle = this.onIdle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCloseDisagree = this.handleCloseDisagree.bind(this);
  }

  onIdle() {
    this.logOutOnIdle();
  }

  handleClose() {
    this.setState({ open: false });
    clearTimeout(this.clearTime);
  }

  handleCloseDisagree() {
    this.setState({ open: false });
    this.redirectToLogout();
  }

  logOutOnIdle() {
    this.setState({ open: true });
    this.clearTime = setTimeout(() => {
      this.setState({ open: false });
      this.redirectToLogout();
    }, 30000);// Wait for 30 sec
  }

  redirectToLogout() {
    const {
      onEndShift, onAutoSave, enableGetNext, evalId, isAssigned,
    } = this.props;
    if (!R.isEmpty(evalId) && !R.isNil(evalId) && (!enableGetNext) && isAssigned) {
      onAutoSave('Paused');
      onEndShift();
    }
  }

  render() {
    const { open: isDialogOpen } = this.state;
    return (
      <>
        <IdleTimer
          ref={(ref) => { this.idleTimer = ref; }}
          debounce={250}
          element={document}
          onAction={this.onAction}
          onActive={this.onActive}
          onIdle={this.onIdle}
          timeout={7200000}
        />
        <Dialog
          aria-describedby="alert-dialog-description"
          aria-labelledby="alert-dialog-title"
          onClose={this.handleClose}
          open={isDialogOpen}
        >
          <DialogTitle id="alert-dialog-title">Idle logout?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Session has been expired. Would you like to continue working in this application?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleCloseDisagree}>
                      No
            </Button>
            <Button autoFocus color="primary" onClick={this.handleClose}>
                      Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}
IdleUserHandler.defaultProps = {
  enableGetNext: false,
};
IdleUserHandler.propTypes = {
  enableGetNext: PropTypes.bool,
  evalId: PropTypes.string.isRequired,
  isAssigned: PropTypes.bool.isRequired,
  onAutoSave: PropTypes.func.isRequired,
  onEndShift: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  enableGetNext: selectors.enableGetNext(state),
  evalId: selectors.evalId(state),
  isAssigned: selectors.isAssigned(state),
});
const mapDispatchToProps = dispatch => ({
  onEndShift: dashboardOperations.onEndShift(dispatch),
  onAutoSave: dashboardOperations.onAutoSave(dispatch),

});

export default connect(mapStateToProps, mapDispatchToProps)(IdleUserHandler);
