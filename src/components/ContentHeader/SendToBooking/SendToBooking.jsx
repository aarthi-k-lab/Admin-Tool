import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './SendToBooking.css';

const SendToBooking = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName="send-to-docs-in"
    variant="contained"
  >
    Send To Booking
  </Button>
);

SendToBooking.defaultProps = {
  disabled: false,
  onClick: () => {},
};

SendToBooking.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SendToBooking;
