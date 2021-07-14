import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Center from 'components/Center';
import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ message }) => (
  <Center>
    <span styleName="message">
      <CircularProgress size={50} />
      {message}
    </span>
  </Center>
);

Loader.defaultProps = {
  message: '',
};
Loader.propTypes = {
  message: PropTypes.string,
};
export default Loader;
