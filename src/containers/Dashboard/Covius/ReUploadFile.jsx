import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import './ReUploadFile.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

// const handleChange = () => {
//   const { onChange } = this.props;
//   onChange(true);
// };

const ReUploadFile = ({ fileName, onChange }) => (
  <>
    <div>
      <Grid alignItems="center" container direction="column" styleName="msgblock" xs={12}>
        <Grid alignItems="center" container direction="row" justify="flex-end" xs={12}>
          <Grid alignItems="flex-start" container direction="row" item justify="flex-end" xs={5}>
            <img alt="submit_error_icon" src="/static/img/default_selected_green_small.svg" styleName="largeIcon" />
          </Grid>
          <Grid item xs={7}>
            <span styleName="reuploadmsg">Excel document uploaded Successfully.</span>
          </Grid>
        </Grid>
        <Grid alignItems="center" container direction="column" justify="center" xs={12}>
          <Grid item xs={12}>
            <TextField
              InputProps={{
                readOnly: true,
                style: {
                  fontSize: '1.4rem',
                  padding: '5.5px 5.5px !important',
                  fontStyle: 'italic',
                },
                disableUnderline: 'true',
              }}
              styleName="fileTextBox"
              value={fileName}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" item xs={12}>
          <Grid alignItems="center" container direction="row" justify="center" xs={12}>
            <Button
              color="primary"
              component="label"
              styleName="submitToCovius"
              variant="contained"
            >
          SUBMIT TO COVIUS
            </Button>
            <Button
              component="label"
              onClick={onChange}
              styleName="deletebtn"
              variant="contained"
            >
          DELETE
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  </>
);

ReUploadFile.defaultProps = {
  fileName: 'hedfgsdfgdfgdsgdfgdsfgdsfgllo.xls',
};

ReUploadFile.propTypes = {
  fileName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};


export default ReUploadFile;
