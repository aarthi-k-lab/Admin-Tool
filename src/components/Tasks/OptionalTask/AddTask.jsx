import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  custom: {
    color: 'black',
    backgroundColor: 'white',
    borderRadius: '0.15rem',
    minHeight: '25px',
    width: '30px',
    height: '0px',
    '&:hover': {
      backgroundColor: 'var(--grey-300)',
    },
    boxShadow: 'none',
  },
});

const AddTask = ({
  classes, disabled, onClick, toolTipPosition, margin,
}) => (
  <Tooltip aria-label="Add Task" placement={toolTipPosition} title="Add Task">
    <Fab
      aria-label="Add"
      className={classes.custom}
      color="secondary"
      disabled={disabled}
      onClick={onClick}
      style={margin}
    >
      <AddIcon />
    </Fab>
  </Tooltip>
);

AddTask.defaultProps = {
  disabled: false,
  margin: {
    'margin-left': '1rem',
    'margin-right': '1rem',
  },
  onClick: () => {},
  toolTipPosition: 'bottom',
};

AddTask.propTypes = {
  classes: PropTypes.shape().isRequired,
  disabled: PropTypes.bool,
  margin: PropTypes.shape({
    marginLeft: PropTypes.string,
  }),
  onClick: PropTypes.func,
  toolTipPosition: PropTypes.string,
};

export default withStyles(styles)(AddTask);
