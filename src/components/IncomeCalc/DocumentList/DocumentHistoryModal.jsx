import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import MessageOutlinedIcon from '@material-ui/icons/MessageOutlined';
import CloseIcon from '@material-ui/icons/Close';
import './DocumentHistory.css';
import { DateFormatter } from '../../../lib/DateUtils';

const styles = theme => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const {
    title, documentTitle, classes, onClose, ...other
  } = props;
  return (
    <MuiDialogTitle className={classes.root} disableTypography {...other}>
      <Typography
        style={{ fontSize: '16px', fontWeight: 700, color: '#4E586E' }}
        variant="h6"
      >
        {title}
      </Typography>
      <Typography style={{ fontSize: '1rem', color: '#939299' }} variant="h6">
        {documentTitle}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}))(MuiDialogContent);

const DocumentCard = (props) => {
  const {
    data: {
      comments, expirationDate, linkedDate, agentName,
    },
    isLast,
  } = props;

  return (
    <ListItem
      alignItems="flex-start"
      disableGutters
      divider={isLast}
      styleName="listItem"
    >
      <Grid container direction="row">
        <Grid direction="column" item xs={2}>
          <Grid item styleName="itemTitle">
            Linked Date
          </Grid>
          <Grid item styleName="itemValue">
            {DateFormatter(linkedDate)}
          </Grid>
        </Grid>
        <Grid direction="column" item xs={4}>
          <Grid item styleName="itemTitle">
            Agent Name
          </Grid>
          <Grid item styleName="itemValue">
            {agentName}
          </Grid>
        </Grid>
        <Grid direction="column" item xs={2}>
          <Grid item styleName="itemTitle">
            Expiration
          </Grid>
          <Grid item styleName="itemValue">
            {DateFormatter(expirationDate)}
          </Grid>
        </Grid>
        <Grid xs={4}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ marginTop: 3, marginRight: 6 }}>
              <MessageOutlinedIcon style={{ color: 'grey' }} />
            </div>
            <div>
              <Typography display="inline" paragraph styleName="itemValue">
                {comments}
              </Typography>
            </div>
          </div>
        </Grid>
      </Grid>
    </ListItem>
  );
};

DocumentCard.propTypes = {
  data: PropTypes.shape({
    agentName: PropTypes.string,
    comments: PropTypes.string,
    expirationDate: PropTypes.string,
    linkedDate: PropTypes.string,
  }),
  isLast: PropTypes.bool.isRequired,
};

DocumentCard.defaultProps = {
  data: {
    comments: '',
    expirationDate: '',
    linkedDate: '',
    agentName: '',
  },
};

function generate(index, val, isLast) {
  return <DocumentCard key={index} data={val} isLast={isLast} />;
}

export default function DocumentHistoryModal(props) {
  const {
    historyData, isOpen, handleClose, documentName,
  } = props;

  return (
    <div>
      <Dialog
        aria-labelledby="dialog-title"
        fullWidth
        onClose={handleClose}
        open={isOpen}
        PaperProps={{
          style: {
            borderRadius: '10px',
            border: '0.5px solid black',
            maxWidth: '900px',
          },
        }}
      >
        <DialogTitle
          documentTitle={documentName}
          id="dialog-title"
          onClose={handleClose}
          title="Document History"
        />
        <DialogContent>
          <List styleName="doc-history-list">
            {
            historyData.map((val, index, arr) => generate(index, val, !(arr.length - 1 === index)))
            }
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}

DocumentHistoryModal.propTypes = {
  documentName: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  historyData: PropTypes.arrayOf(
    PropTypes.shape({
      comments: PropTypes.string,
      expiredDate: PropTypes.string,
      uploadedDate: PropTypes.string,
    }),
  ),
  isOpen: PropTypes.bool.isRequired,
};

DocumentHistoryModal.defaultProps = {
  historyData: [],
};
