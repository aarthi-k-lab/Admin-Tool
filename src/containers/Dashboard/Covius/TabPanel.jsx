import React from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

const TabPanel = ({
  children, value, index, ...other
}) => (
  <div {...other}>
    {value === index && <Box p={3}>{children}</Box>}
  </div>
);

TabPanel.defaultProps = {
  onClick: () => { },
  children: null,
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  value: PropTypes.number.isRequired,
};

export default TabPanel;
