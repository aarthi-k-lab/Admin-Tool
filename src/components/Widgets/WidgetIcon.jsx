import React from 'react';
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
    rightAppBarOpen, rightAppBarSelected, data, onWidgetClick,
    isAdditionalInfoOpen, isHistoryOpen, toggleWidget,
  } = props;
  const isSelected = (rightAppBarOpen && rightAppBarSelected === data.id)
    || (isHistoryOpen && data.id === 'History')
    || (isAdditionalInfoOpen && data.id === 'Additional Info')
    || (toggleWidget && data.id === 'BookingAutomation');
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
  rightAppBarOpen: true,
  rightAppBarSelected: '',
  data: [],
  isAdditionalInfoOpen: false,
  isHistoryOpen: false,
  toggleWidget: false,
};

WidgetIcon.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.string,
    id: PropTypes.string,
  }),
  isAdditionalInfoOpen: PropTypes.bool,
  isHistoryOpen: PropTypes.bool,
  onWidgetClick: PropTypes.func.isRequired,

  rightAppBarOpen: PropTypes.bool,
  rightAppBarSelected: PropTypes.string,
  toggleWidget: PropTypes.bool,
};

const TestExports = {
  WidgetIcon,
};

export default WidgetIcon;
export { TestExports };
