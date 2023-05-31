import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './LockCalculation.css';

const LockCalculation = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName={disabled ? 'lock-disabled' : 'lock'}
    variant="contained"
  >
        LOCK
  </Button>
);

LockCalculation.defaultProps = {
  disabled: false,
  onClick: () => { },
};

LockCalculation.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default LockCalculation;
