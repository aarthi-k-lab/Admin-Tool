import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import ChervronLeft from '@material-ui/icons/ChevronLeft';
import './BackToAllTasks.css';

const BackToAllTasks = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="green"
    disabled={disabled}
    onClick={onClick}
    styleName="back-to-all-tasks"
    variant="contained"
  >
    <ChervronLeft />
    <span>BACK TO ALL TASKS</span>
  </Button>
);

BackToAllTasks.defaultProps = {
  disabled: false,
  onClick: () => {},
};

BackToAllTasks.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default BackToAllTasks;
