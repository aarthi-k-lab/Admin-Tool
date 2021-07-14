import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Center from 'components/Center';
import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ message, size }) => (
  <Center>
    <span styleName="message">
      <CircularProgress size={size} />
      {message}
    </span>
  </Center>
);

Loader.defaultProps = {
  message: '',
  size: 50,
};
Loader.propTypes = {
  message: PropTypes.string,
  size: PropTypes.number,
};
export default Loader;
