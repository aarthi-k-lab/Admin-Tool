import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import './PopupContainer.css';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 700,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '1rem',
    border: '1px solid rgba(0, 0, 0, 0.5)',
  },
}));

const PopupContainer = ({
  show, title, handleClose, children,
}) => {
  const classes = useStyles();
  return (
    <Modal
      open={show}
    >
      <div
        className={classes.paper}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        styleName="popup"
      >
        <Grid alignItems="center" container direction="row" justify="space-between" styleName="popup-title">
          <Grid item>
            <h2 id="simple-modal-title">{title}</h2>
          </Grid>
          <Grid item>
            <IconButton aria-label="close" onClick={() => handleClose(false)}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Grid alignItems="center" container direction="row" justify="space-between">
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};

PopupContainer.defaultProps = {
  show: false,
  title: '',
};

PopupContainer.propTypes = {
  children: PropTypes.node.isRequired,
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  title: PropTypes.string,
};

export default PopupContainer;
