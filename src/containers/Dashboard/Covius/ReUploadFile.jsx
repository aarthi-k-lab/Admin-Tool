import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import './SubmitFileError.css';
import Button from '@material-ui/core/Button';

const ReUploadFile = ({ fileName }) => (
  <>
    <div>
      <img alt="submit_error_icon" src="/static/img/default_selected_green.svg" styleName="largeIcon" />
      <span>Excel document uploaded Successfully.</span>
      <div>
        <TextField
          InputProps={{
            readOnly: true,
          }}
          size="small"
          value={fileName}
          variant="outlined"
        />
        <Button
          color="secondary"
          component="label"
                    // onChange={this.handleUpload}
          variant="contained"
        >
                    DELETE
        </Button>
      </div>
    </div>
  </>
);

ReUploadFile.defaultProps = {
  fileName: 'hello.xls',
};

ReUploadFile.propTypes = {
  fileName: PropTypes.string,
};


export default ReUploadFile;
