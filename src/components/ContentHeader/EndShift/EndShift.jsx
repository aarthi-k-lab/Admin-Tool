import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import StopIcon from '@material-ui/icons/Stop';
import './EndShift.css';

const EndShift = ({ onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    onClick={onClick}
    styleName="end-shift"
    variant="outlined"
  >
    <StopIcon />
    End Shift
  </Button>
);

EndShift.defaultProps = {
  onClick: () => {},
};

EndShift.propTypes = {
  onClick: PropTypes.func,
};

export default EndShift;
