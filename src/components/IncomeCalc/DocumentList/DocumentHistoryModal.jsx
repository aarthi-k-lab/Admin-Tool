import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
import { selectors as documentChecklistSelectors } from 'ducks/document-checklist';
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
        styleName="doc-title"
        variant="h6"
      >
        {title}
      </Typography>
      <Typography styleName="title" variant="h6">
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
            {R.isNil(expirationDate) ? 'MM/DD/YYYY' : DateFormatter(expirationDate)}
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

function DocumentHistoryModal(props) {
  const {
    isOpen, handleClose, documentName, historyData,
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
          {R.isEmpty(historyData) || R.isNil(historyData)
            ? (
              <Typography
                styleName="no-history"
                variant="h6"
              >
                {'No History Found'}
              </Typography>
            )

            : (
              <List styleName="doc-history-list">
                {
            historyData.map((val, index, arr) => generate(index, val, !(arr.length - 1 === index)))
            }
              </List>
            )
}
        </DialogContent>
      </Dialog>
    </div>
  );
}

DocumentHistoryModal.propTypes = {
  documentName: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  historyData: PropTypes.shape().isRequired,
  isOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  historyData: documentChecklistSelectors.getDocHistory(state),
});

export default connect(mapStateToProps, null)(DocumentHistoryModal);
