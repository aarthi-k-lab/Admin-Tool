import React from 'react';
import * as PropTypes from 'prop-types';

import Dropzone from 'react-dropzone';
import Typography from '@material-ui/core/Typography';
import './DropZone.css';

function DropZone(props) {
  const { onDrop } = props;
  return (
    <div styleName="dropZone">
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div styleName="dropzone">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img alt="upload" src="/static/img/uploadIcon.png" style={{ width: '40px' }} />
              </div>
              <Typography
                noWrap
                styleName="dropMessage"
              >
                <p>Drag and drop documents to upload</p>
              </Typography>
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
}

DropZone.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

export default DropZone;
