import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './CompleteForbearance.css';

const CompleteForbearance = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName={disabled ? 'complete-forbearance-disabled' : 'complete-forbearance'}
    variant="contained"
  >
    Complete Forbearance
  </Button>
);

CompleteForbearance.defaultProps = {
  disabled: false,
  onClick: () => {},
};

CompleteForbearance.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default CompleteForbearance;
