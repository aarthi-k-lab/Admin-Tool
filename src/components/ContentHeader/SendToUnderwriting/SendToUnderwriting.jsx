import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './SendToUnderwriting.css';

const SendToUnderwriting = ({ onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    onClick={onClick}
    styleName="send-to-underwriting"
    variant="contained"
  >
    Send To Underwriting
  </Button>
);

SendToUnderwriting.defaultProps = {
  onClick: () => {},
};

SendToUnderwriting.propTypes = {
  onClick: PropTypes.func,
};

export default SendToUnderwriting;
