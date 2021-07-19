import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import './ReUploadFile.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { operations, selectors } from 'ducks/dashboard';

class ReUploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
    };
  }

  onSubmitToCovius = () => {
    const { onSubmitFile } = this.props;
    const status = 'We are processing your request.  Please do not close the browser.';
    const level = 'Info';
    const showConfirmButton = false;
    const sweetAlertPayload = {
      status,
      level,
      showConfirmButton,
    };
    onSubmitFile(sweetAlertPayload);
  }

  render() {
    const { fileName, onChange } = this.props;
    const { response } = this.state;
    return (
      <>
        <div>
          <Grid alignItems="center" container direction="column" styleName="msgblock">
            <Grid alignItems="center" container direction="row" justify="flex-end">
              <Grid alignItems="flex-start" container direction="row" item justify="flex-end" xs={5}>
                <img alt="submit_error_icon" src="/static/img/default_selected_green_small.svg" styleName="largeIcon" />
              </Grid>
              {response}
              <Grid item xs={7}>
                <span styleName="reuploadmsg">Excel document uploaded Successfully.</span>
              </Grid>
            </Grid>
            <Grid alignItems="center" container direction="column" justify="center">
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
            <Grid container direction="row" item>
              <Grid alignItems="center" container direction="row" justify="center">
                <Button
                  color="primary"
                  component="label"
                  id="submit"
                  onClick={this.onSubmitToCovius}
                  styleName="submitToCovius"
                  variant="contained"
                >
                  SUBMIT TO COVIUS
                </Button>
                <Button
                  component="label"
                  id="delete"
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
  }
}

const TestHooks = {
  ReUploadFile,
};
ReUploadFile.defaultProps = {
  fileName: 'hello.xls',
};

const mapStateToProps = state => ({
  fileSubmitResponse: selectors.getFileSubmitResponse(state),
});

const mapDispatchToProps = dispatch => ({
  onSubmitFile: operations.onSubmitFile(dispatch),
});

ReUploadFile.propTypes = {
  fileName: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSubmitFile: PropTypes.func.isRequired,
};

export { TestHooks };
export default connect(mapStateToProps, mapDispatchToProps)(ReUploadFile);
