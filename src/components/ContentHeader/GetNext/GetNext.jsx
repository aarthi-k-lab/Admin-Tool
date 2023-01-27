import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './GetNext.css';

const GetNext = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName={disabled ? 'get-next-disabled' : 'get-next'}
    variant="contained"
  >
    Get Next
  </Button>
);

GetNext.defaultProps = {
  disabled: false,
  onClick: () => {},
};

GetNext.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default GetNext;
