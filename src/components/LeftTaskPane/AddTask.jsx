import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  custom: {
    color: 'black',
    backgroundColor: 'var(--grey-300)',
    borderRadius: '0.15rem',
    minHeight: '25px',
    width: '30px',
    height: '0px',
    '&:hover': {
      backgroundColor: 'var(--grey-300)',
    },
  },
});

const AddTask = ({
  classes, onClick, toolTipPosition, margin,
}) => (
  <Tooltip aria-label="Add Task" placement={toolTipPosition} title="Add Task">
    <Fab
      aria-label="Add"
      className={classes.custom}
      color="secondary"
      onClick={onClick}
      style={margin}
    >
      <AddIcon />
    </Fab>
  </Tooltip>
);

AddTask.defaultProps = {
  margin: {
    'margin-left': '10rem',
  },
  onClick: () => {},
  toolTipPosition: 'bottom',
};

AddTask.propTypes = {
  classes: PropTypes.shape.isRequired,
  margin: PropTypes.shape({
    marginLeft: PropTypes.string,
  }),
  onClick: PropTypes.func,
  toolTipPosition: PropTypes.string,
};

export default withStyles(styles)(AddTask);
