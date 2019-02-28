import React from 'react';
import PropTypes from 'prop-types';
import ChervronLeft from '@material-ui/icons/ChevronLeft';
import ChervronRight from '@material-ui/icons/ChevronRight';

const CollapseIcon = ({ direction }) => (
  direction === 'left'
    ? <ChervronLeft />
    : <ChervronRight />
);

CollapseIcon.propTypes = {
  direction: PropTypes.string,
};

CollapseIcon.defaultProps = {
  direction: 'left',
};

export default CollapseIcon;
