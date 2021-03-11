import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import './WidgetIcon.css';

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
        {data.icon}
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
