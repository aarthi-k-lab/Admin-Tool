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
    openWidgetList, data, onWidgetClick, disabledWidgets,
  } = props;
  const isSelected = (R.contains(data.id, openWidgetList));
  const style = {
    background: isSelected ? '#d7d8d9' : 'rgb(242, 242, 242)',
    cursor: R.contains(data.id, disabledWidgets) ? 'not-allowed' : 'pointer',
  };
  return (
    <Grid
      alignItems="center"
      container
      justify="center"
      onClick={onWidgetClick}
      style={style}
      styleName="component"
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
  disabledWidgets: [],
};

WidgetIcon.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.string,
    id: PropTypes.string,
  }),
  disabledWidgets: PropTypes.arrayOf(PropTypes.string),
  onWidgetClick: PropTypes.func.isRequired,
  openWidgetList: PropTypes.string,
};

const TestExports = {
  WidgetIcon,
};

export default WidgetIcon;
export { TestExports };
