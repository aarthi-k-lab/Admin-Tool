import React from 'react';
import './SubmitFileError.css';

const SubmitFileError = () => (
  <>
    <div styleName="msgblock">
      <img alt="submit_error_icon" src="/static/img/default_error_small.svg" styleName="largeIcon" />
      <span styleName="failedmsg">Excel document upload failed.</span>
    </div>
  </>
);

const TestHooks = {
  SubmitFileError,
};

export default SubmitFileError;
export { TestHooks };
