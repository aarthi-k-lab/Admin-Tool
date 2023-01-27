import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './SendToDocsIn.css';

const SendToDocsIn = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName={disabled ? 'send-to-docs-in-disabled' : 'send-to-docs-in'}
    variant="contained"
  >
    Send To Docs In
  </Button>
);

SendToDocsIn.defaultProps = {
  disabled: false,
  onClick: () => {},
};

SendToDocsIn.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SendToDocsIn;
