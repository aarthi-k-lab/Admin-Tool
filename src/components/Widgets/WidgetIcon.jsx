import React from 'react';
import PropTypes from 'prop-types';
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
    <div
      key={data.id}
      onClick={onWidgetClick}
      role="presentation"
      styleName={isSelected
        ? 'component-selected' : 'component-not-selected'}
    >
      <div
        id={data.id}
        styleName="icon-component"
        title={data.id}
      >
        {data.icon}
      </div>
    </div>
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
