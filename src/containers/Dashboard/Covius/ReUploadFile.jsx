import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import './ReUploadFile.css';
import Button from '@material-ui/core/Button';

// const handleChange = () => {
//   const { onChange } = this.props;
//   onChange(true);
// };

const ReUploadFile = ({ fileName, onChange }) => (
  <>
    <div>
      <div styleName="msgblock">
        <img alt="submit_error_icon" src="/static/img/default_selected_green_small.svg" styleName="largeIcon" />
        <span styleName="reuploadmsg">Excel document uploaded Successfully.</span>
      </div>
      <div styleName="msgblock1">
        <TextField
          InputProps={{
            readOnly: true,
            style: {
              fontSize: '1.1rem',
              padding: '5.5px 5.5px !important',
              // margin: '0rem 1rem 0rem 42rem',
            },
          }}
          styleName="fileTextBox"
          value={fileName}
          variant="outlined"
        />
        <Button
          color="secondary"
          component="label"
          onClick={onChange}
          styleName="deletebtn"
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
  onChange: PropTypes.func.isRequired,
};


export default ReUploadFile;
