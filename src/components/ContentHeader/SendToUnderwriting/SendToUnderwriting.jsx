import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './SendToUnderwriting.css';

const SendToUnderwriting = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName="send-to-underwriting"
    variant="contained"
  >
    Send To Underwriting
  </Button>
);

SendToUnderwriting.defaultProps = {
  onClick: () => {},
  disabled: false,
};

SendToUnderwriting.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SendToUnderwriting;
