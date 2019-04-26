import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
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

const DeleteTask = ({
  classes, onClick, toolTipPosition, margin,
}) => (
  <Tooltip aria-label="Delete Task" placement={toolTipPosition} title="Delete Task">
    <Fab
      aria-label="Delete"
      className={classes.custom}
      color="secondary"
      onClick={onClick}
      style={margin}
    >
      <DeleteOutlined />
    </Fab>
  </Tooltip>
);

DeleteTask.defaultProps = {
  margin: {
    'margin-left': '10rem',
  },
  onClick: () => {},
  toolTipPosition: 'bottom',
};

DeleteTask.propTypes = {
  classes: PropTypes.shape.isRequired,
  margin: PropTypes.shape,
  onClick: PropTypes.func,
  toolTipPosition: PropTypes.string,
};

export default withStyles(styles)(DeleteTask);
