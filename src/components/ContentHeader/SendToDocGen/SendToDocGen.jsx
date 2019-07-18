import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './SendToDocGen.css';

const SendToDocGen = ({ onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    onClick={onClick}
    styleName="send-to-doc-gen"
    variant="contained"
  >
    Send To Doc Gen
  </Button>
);

SendToDocGen.defaultProps = {
  onClick: () => {},
};

SendToDocGen.propTypes = {
  onClick: PropTypes.func,
};

export default SendToDocGen;
