import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './Close.css';

const Close = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    disabled={disabled}
    onClick={onClick}
    styleName="close-task"
    variant="contained"
  >
    <span>CLOSE</span>
  </Button>
);

Close.defaultProps = {
  disabled: false,
  onClick: () => {},
};

Close.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Close;
