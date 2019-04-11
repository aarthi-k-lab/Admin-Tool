import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import './AddTask.css';

const AddTask = ({ disabled, onClick }) => (
  <Button
    className="material-ui-button"
    color="primary"
    disabled={disabled}
    onClick={onClick}
    styleName="add-task"
    variant="contained"
  >
    <img alt="add-icon" height="25" src="/static/img/add.svg" width="25" />
    <span>ADD TASK</span>
  </Button>
);

AddTask.defaultProps = {
  disabled: false,
  onClick: () => {},
};

AddTask.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default AddTask;
