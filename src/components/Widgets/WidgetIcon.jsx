import React from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import './WidgetIcon.css';

const useStyles = makeStyles(theme => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    fontSize: '1rem',
  },
}));

const WidgetIcon = (props) => {
  const {
    openWidgetList, data, onWidgetClick,
  } = props;
  const isSelected = (R.contains(data.id, openWidgetList));
  return (
    <Grid
      alignItems="center"
      container
      justify="center"
      onClick={onWidgetClick}
      styleName={isSelected
        ? 'component-selected' : 'component-not-selected'}
    >
      <Grid item styleName={data.id === 'History' ? 'history' : ''}>
        <Tooltip arrow classes={useStyles()} placement="left" title={data.id}>{data.icon}</Tooltip>
      </Grid>
    </Grid>
  );
};

WidgetIcon.defaultProps = {
  openWidgetList: [],
  data: [],
};

WidgetIcon.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.string,
    id: PropTypes.string,
  }),
  onWidgetClick: PropTypes.func.isRequired,
  openWidgetList: PropTypes.string,
};

const TestExports = {
  WidgetIcon,
};

export default WidgetIcon;
export { TestExports };
