import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './SendToDocGenStager.css';

const SendToDocGenStager = ({ onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    onClick={onClick}
    styleName="send-to-doc-gen-stager"
    variant="contained"
  >
    Send To Doc Gen Stager
  </Button>
);

SendToDocGenStager.defaultProps = {
  onClick: () => {},
};

SendToDocGenStager.propTypes = {
  onClick: PropTypes.func,
};

export default SendToDocGenStager;
