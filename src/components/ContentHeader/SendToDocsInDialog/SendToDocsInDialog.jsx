
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import './SendToDocsInDialog.css';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import SuccessDialogBox from './SuccessDialog';
import {
  selectors,
  operations,
} from '../../../state/ducks/dashboard';
import {
  selectors as loginSelectors,
} from '../../../state/ducks/login';

const useStyles = makeStyles(() => ({
  root: {
    '& .MuiPaper-root': {
      backgroundColor: '#f3f5f9',
    },
  },
  input: {
    '&::placeholder': {
      fontStyle: 'italic',
      color: 'grey',
    },
  },
}));


function SendToDocsInDialog(props) {
  const {
    history,
    redirectDialog,
    closeRedirectDialog,
    disableSendToDocsIn,
    dropdownOptions,
    loader,
    initiateBookingSendToDocsIn,
    loanNumber,
    brandName,
    processId,
    user,
    taskId,
    evalId,
    docsInResp,
  } = props;

  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMeassage, setDialogMessage] = useState('');
  useEffect(() => {
    if (docsInResp && docsInResp.commentId) {
      setDialogOpen(true);
      setDialogMessage('Sent Successfully');
    }
  }, [docsInResp]);
  const classes = useStyles();
  const radioClick = (event) => {
    setReason(event.target.value);
  };

  const closeDialog = () => {
    closeRedirectDialog(false);
    setReason('');
    setComments('');
  };

  const handleRedirect = () => {
    disableSendToDocsIn(false);
    closeDialog();
    history.push('/docs-in');
  };
  return (
    <>
      <Dialog
        className={classes.root}
        fullWidth
        maxWidth="lg"
        onClose={closeDialog}
        open={redirectDialog}
      >
        <Grid container>
          <Grid item xs={6}>
            <Typography styleName="select-reason-text">Select The Reason</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography styleName={!reason ? 'comments-text-disabled' : 'comments-text'}>Comments</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={closeDialog} styleName="closeIcon">
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={0} styleName="radio-group-paper">
              {
                loader
                  ? <CircularProgress size={35} styleName="loader" variant="indeterminate" />
                  : (
                    <RadioGroup
                      name="select-the-reason-radio-group"
                      onChange={radioClick}
                      value={reason}
                    >
                      {
                  dropdownOptions.map(item => (
                    <FormControlLabel
                      key={item.classCode}
                      control={<Radio />}
                      label={item.shortDescription}
                      styleName="radio-group-elements"
                      value={item.classCode}
                    />
                  ))
                }
                    </RadioGroup>
                  )
              }
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <div styleName="comments-wrapper">
              <TextField
                disabled={!reason}
                InputProps={{
                  classes: {
                    input: classes.input,
                  },
                }}
                multiline
                onChange={event => setComments(event.target.value)}
                placeholder="Type your comments here..."
                rows={4}
                styleName={!reason ? 'comment-textbox-disabled' : 'comment-textbox'}
                value={comments}
                variant="outlined"
              />
              <Button
                color="primary"
                disabled={!reason || !comments}
                onClick={() => {
                  initiateBookingSendToDocsIn({
                    payload: {
                      loanNumber,
                      reasonCode: reason,
                      comment: comments,
                      brandName,
                      processId,
                      user: user.userDetails.name,
                      taskId: taskId.includes('_') ? taskId.split('_')[1] : taskId,
                      evalId,
                      email: user.userDetails.email,
                    },
                  });
                }}
                styleName="submit-style"
                variant="contained"
              >
              Submit
              </Button>
              {dialogOpen && (
              <SuccessDialogBox
                btnPress={handleRedirect}
                handleClose={() => setDialogOpen(false)}
                isOpen={dialogOpen}
                modalContent={dialogMeassage}
              />
              )}
            </div>
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
}

SendToDocsInDialog.defaultProps = {
  disableSendToDocsIn: () => {},
  initiateBookingSendToDocsIn: () => {},
  dropdownOptions: [],
  evalId: '',
};

SendToDocsInDialog.propTypes = {
  brandName: PropTypes.string.isRequired,
  closeRedirectDialog: PropTypes.func.isRequired,
  disableSendToDocsIn: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  docsInResp: PropTypes.any.isRequired,
  dropdownOptions: PropTypes.arrayOf(
    PropTypes.shape({
      classCode: PropTypes.any.isRequired,
      shortDescription: PropTypes.string.isRequired,
    }),
  ),
  email: PropTypes.string.isRequired,
  evalId: PropTypes.string,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  initiateBookingSendToDocsIn: PropTypes.func,
  loader: PropTypes.bool.isRequired,
  loanNumber: PropTypes.number.isRequired,
  processId: PropTypes.string.isRequired,
  redirectDialog: PropTypes.bool.isRequired,
  taskId: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
};

const mapDispatchToProps = dispatch => ({
  disableSendToDocsIn: operations.toggleSendToDocsInOperation(dispatch),
  initiateBookingSendToDocsIn: operations.initiateBookingOperation(dispatch),
});

const mapStateToProps = state => ({
  loanNumber: selectors.loanNumber(state),
  brandName: selectors.brand(state),
  processId: selectors.processId(state),
  user: loginSelectors.getUser(state),
  taskId: selectors.taskId(state),
  docsInResp: selectors.getSendToDocsInResponse(state),
  evalId: selectors.evalId(state),
});

// eslint-disable-next-line max-len
const SendToDocsInDialogContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(SendToDocsInDialog));

export default SendToDocsInDialogContainer;
