import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';
import ZoomOut from '@material-ui/icons/ZoomOutMap';

const Expand = ({ onClick }) => (
  <IconButton onClick={onClick}>
    <ZoomOut />
  </IconButton>
);

Expand.defaultProps = {
  onClick: () => {},
};

Expand.propTypes = {
  onClick: PropTypes.func,
};

export default Expand;
