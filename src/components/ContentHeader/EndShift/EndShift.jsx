import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './EndShift.css';

const EndShift = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName={disabled ? 'end-shift-disabled' : 'end-shift'}
    variant="outlined"
  >
    End Shift
  </Button>
);

EndShift.defaultProps = {
  disabled: false,
  onClick: () => {},
};

EndShift.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default EndShift;
