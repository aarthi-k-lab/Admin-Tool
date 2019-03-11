import React from 'react';
import PropTypes from 'prop-types';
import './WidgetIcon.css';

const WidgetIcon = (props) => {
  const {
    rightAppBarOpen, rightAppBarSelected, data, onWidgetClick,
  } = props;
  return (
    <div
      key={data.id}
      onClick={onWidgetClick}
      role="presentation"
      styleName={(rightAppBarOpen
            && rightAppBarSelected === data.id)
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
};

WidgetIcon.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.string,
    id: PropTypes.string,
  }),
  onWidgetClick: PropTypes.func.isRequired,
  rightAppBarOpen: PropTypes.bool,
  rightAppBarSelected: PropTypes.string,
};

const TestExports = {
  WidgetIcon,
};

export default WidgetIcon;
export { TestExports };
