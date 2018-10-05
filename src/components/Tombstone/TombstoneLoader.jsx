import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import './TombstoneLoader.css';

function TombstoneLoader() {
  return (
    <section styleName="tombstone-loader">
      <CircularProgress size="2rem" />
    </section>
  );
}

export default TombstoneLoader;
