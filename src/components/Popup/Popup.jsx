import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import imageUrls from '../../constants/alertTypes';
import './Popup.css';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
  },
}));

const Popup = ({
  message, show, onConfirm, level, confirmButtonText, cancelButtonText,
  showCancelButton, title, onCancel,
}) => {
  let imageUrl = '';
  imageUrl = imageUrls[level] ? imageUrls[level] : imageUrls.Warning;
  const classes = useStyles();
  return (
    <Modal
      onClose={onConfirm}
      open={show}
    >
      <div
        className={classes.paper}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        styleName="popup"
      >
        <img alt="dogGif" src={imageUrl} />
        <h2 id="simple-modal-title">{title}</h2>
        <p id="simple-modal-description" styleName="message">
          {message}
        </p>
        <div styleName="confirm-button">
          {<Button color="primary" onClick={onConfirm} variant="contained">{confirmButtonText}</Button>}
          {showCancelButton && <Button onClick={onCancel} variant="contained">{cancelButtonText}</Button>}
        </div>
      </div>
    </Modal>
  );
};

Popup.defaultProps = {
  show: false,
  onConfirm() {},
  onCancel() {},
  showCancelButton: false,
  cancelButtonText: 'Cancel',
  confirmButtonText: 'Confirm',
  title: '',
};

Popup.propTypes = {
  cancelButtonText: PropTypes.string,
  confirmButtonText: PropTypes.string,
  level: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  show: PropTypes.bool,
  showCancelButton: PropTypes.bool,
  title: PropTypes.string,
};

export default Popup;
