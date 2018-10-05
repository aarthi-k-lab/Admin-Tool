import React from 'react';
import PropTypes from 'prop-types';
import ChervronLeft from '@material-ui/icons/ChevronLeft';
import ChervronRight from '@material-ui/icons/ChevronRight';
import './CollapseIcon.css';

const CollapseIcon = ({ direction }) => (
  <span styleName="collapse-icon-container">
    { direction === 'left'
      ? <ChervronLeft styleName="shift-left" />
      : <ChervronRight styleName="shift-left" />
    }
  </span>
);

CollapseIcon.propTypes = {
  direction: PropTypes.string,
};

CollapseIcon.defaultProps = {
  direction: 'left',
};

export default CollapseIcon;
