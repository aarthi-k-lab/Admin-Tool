import React from 'react';
import './SubmitFileError.css';

const SubmitFileError = () => (
  <>
    <div>
      <img alt="submit_error_icon" src="/static/img/default_error.svg" styleName="largeIcon" />
      <span>Excel document upload failed.</span>
    </div>
  </>
);

export default SubmitFileError;
