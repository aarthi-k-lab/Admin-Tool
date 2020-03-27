import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import './ReUploadFile.css';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { operations, selectors } from 'ducks/dashboard';
import * as R from 'ramda';
import SweetAlert from 'sweetalert2-react';
import { Success, Failed } from '../../../constants/alertTypes';


class ReUploadFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: null,
      isOpen: true, // eslint-disable-line react/no-unused-state
    };
    this.onSubmitToCovius = this.onSubmitToCovius.bind(this);
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const {
      getSubmitFileResponse,
      refreshPage,
    } = nextProps;
    const { isOpen, response } = prevState;
    const { message, level } = getSubmitFileResponse;
    if (!R.isEmpty(getSubmitFileResponse)) {
      const alertResponse = (
        <SweetAlert
          fontSize="1rem"
          icon="error"
          imageHeight="500"
          imageUrl={level === 'Failed' || level === 'Faliure' ? Failed : Success}
          onConfirm={refreshPage()}
          padding="3em"
          show={isOpen}
          text={level === 'Failed' ? message.msg : ''}
          title={level === 'Failed' ? message.title : message}
          width="600"
        />
      );
      return { response: alertResponse };
    }
    return { response };
  }

  invokeSubmitToCoviusSweetAlert = () => {
    const { isOpen } = this.state;
    const textMsg = 'Please <b style="font-weight: bold;">&quot;Do Not Close the Browser&quot;</b> and this will lead you to not see the data that was successfully sent/failed';
    const sweetAlert = (
      <SweetAlert
        fontSize="1rem"
        html={textMsg}
        icon="error"
        imageHeight="500"
        imageUrl={Failed}
        padding="3em"
        show={isOpen}
        showConfirmButton={false}
        title="We are almost there to process your request"
        width="600"
      />
    );
    this.setState({ response: sweetAlert });
  }

  onSubmitToCovius = () => {
    const { onSubmitFile } = this.props;
    this.invokeSubmitToCoviusSweetAlert();
    onSubmitFile();
  }

  handleClose = () => {
    this.setState({ isOpen: false }); // eslint-disable-line react/no-unused-state
  }

  render() {
    const { fileName, onChange } = this.props;
    const { response } = this.state;
    // console.log(getSubmitFileResponse, isOpen);
    return (
      <>
        <div>
          <Grid alignItems="center" container direction="column" styleName="msgblock" xs={12}>
            <Grid alignItems="center" container direction="row" justify="flex-end" xs={12}>
              <Grid alignItems="flex-start" container direction="row" item justify="flex-end" xs={5}>
                <img alt="submit_error_icon" src="/static/img/default_selected_green_small.svg" styleName="largeIcon" />
              </Grid>
              {response}
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
  getSubmitFileResponse: selectors.getFileSubmitResponse(state),
});

const mapDispatchToProps = dispatch => ({
  onSubmitFile: operations.onSubmitFile(dispatch),
});

ReUploadFile.propTypes = {
  fileName: PropTypes.string,
  getSubmitFileResponse:
    PropTypes.shape.isRequired, // eslint-disable-line react/no-unused-prop-types
  onChange: PropTypes.func.isRequired,
  onSubmitFile: PropTypes.func.isRequired,
  refreshPage: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
};

export { TestHooks };
export default connect(mapStateToProps, mapDispatchToProps)(ReUploadFile);
