import React from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import './TombstoneLoader.css';

function TombstoneError() {
  return (
    <section styleName="tombstone-loader">
      <ErrorIcon fontSize="large" />
    </section>
  );
}

export default TombstoneError;
