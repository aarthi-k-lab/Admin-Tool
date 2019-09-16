import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './AddDocsInReceived.css';

const AddDocsInReceived = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName="add-docs-received"
    variant="contained"
  >
    Add Docs Received
  </Button>
);

AddDocsInReceived.defaultProps = {
  disabled: false,
  onClick: () => {},
};

AddDocsInReceived.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default AddDocsInReceived;
