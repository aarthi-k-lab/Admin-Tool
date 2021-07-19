import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import DeleteOutlined from '@material-ui/icons/DeleteOutlined';
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
  classes, disabled, onClick, toolTipPosition, margin,
}) => (
  <Tooltip aria-label="Delete Task" placement={toolTipPosition} title="Delete Task">
    <Fab
      aria-label="Delete"
      className={classes.custom}
      color="secondary"
      disabled={disabled}
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
  classes: PropTypes.shape().isRequired,
  disabled: PropTypes.bool.isRequired,
  margin: PropTypes.shape({
    marginLeft: PropTypes.string,
  }),
  onClick: PropTypes.func,
  toolTipPosition: PropTypes.string,
};

export default withStyles(styles)(DeleteTask);
