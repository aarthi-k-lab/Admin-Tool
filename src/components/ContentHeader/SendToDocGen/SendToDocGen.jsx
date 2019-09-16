import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './SendToDocGen.css';

const SendToDocGen = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName="send-to-doc-gen"
    variant="contained"
  >
    Send To Doc Gen
  </Button>
);

SendToDocGen.defaultProps = {
  disabled: false,
  onClick: () => {},
};

SendToDocGen.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SendToDocGen;
