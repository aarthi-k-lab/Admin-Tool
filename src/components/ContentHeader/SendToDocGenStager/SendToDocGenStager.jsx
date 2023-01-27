import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './SendToDocGenStager.css';

const SendToDocGenStager = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName={disabled ? 'send-to-doc-gen-stager-disabled' : 'send-to-doc-gen-stager'}
    variant="contained"
  >
    Send To Doc Gen Stager
  </Button>
);

SendToDocGenStager.defaultProps = {
  disabled: false,
  onClick: () => {},
};

SendToDocGenStager.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SendToDocGenStager;
