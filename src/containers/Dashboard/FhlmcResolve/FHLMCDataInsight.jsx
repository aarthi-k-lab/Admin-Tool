import React from 'react';
import Grid from '@material-ui/core/Grid';
import CustomTable from 'components/CustomTable';
import PublishIcon from '@material-ui/icons/Publish';
import getters from 'models/Headers';
import GetAppIcon from '@material-ui/icons/GetApp';
import * as R from 'ramda';
import extName from 'ext-name';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/dashboard';
import { PropTypes } from 'prop-types';
import Loader from 'components/Loader/Loader';
import { EXCEL_FORMATS } from '../../../constants/common';
import './FhlmcResolve.css';


function CustomButton(props) {
  const {
    onClick, title, hasTooltip, tooltipMessage, extraStyle, ...other
  } = props;
  return (
    <div>
      <Button
        className="material-ui-button"
        onClick={onClick}
        styleName={extraStyle}
        {...other}
      >
        {title}
      </Button>
      { hasTooltip && (
        <Tooltip
          placement="top"
          title={(
            <Typography>
              {tooltipMessage}
            </Typography>
          )}
        >
          <ErrorIcon styleName="errorSvg" />
        </Tooltip>
      )}
    </div>
  );
}

CustomButton.defaultProps = {
  onClick: () => { },
  title: '',
  hasTooltip: false,
  tooltipMessage: '',
  extraStyle: '',
};

CustomButton.propTypes = {
  extraStyle: PropTypes.string,
  hasTooltip: PropTypes.bool,
  onClick: PropTypes.func,
  title: PropTypes.string,
  tooltipMessage: PropTypes.string,
};
class FHLMCDataInsight extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSubmitFhlmc: false,
      buttonState: 'UPLOAD EXCEL',
      showLoader: false,
      showMessageProp: false,
    };
    this.submitToFhlmc = this.submitToFhlmc.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillUnmount() {
    const { dismissUserNotification } = this.props;
    dismissUserNotification();
  }

  submitToFhlmc = () => {
    const { onSubmitToFhlmcRequest, selectedRequestType, portfolioCode } = this.props;
    const status = 'We are processing your request.  Please do not close the browser.';
    const level = 'Info';
    const showConfirmButton = false;
    const sweetAlertPayload = {
      status,
      level,
      showConfirmButton,
    };
    onSubmitToFhlmcRequest(selectedRequestType, portfolioCode, sweetAlertPayload);
    this.setState({ showSubmitFhlmc: false, showMessageProp: true });
  }

  handleUpload = (event) => {
    const { onProcessFile, openSweetAlert } = this.props;
    const { files } = event.target;
    this.setState({ buttonState: 'UPLOADING...', showLoader: true });
    if (event.target.files[0]) {
      const fileName = event.target.files[0].name;
      const fileExtension = extName(fileName);
      const ext = R.compose(
        R.prop('ext'),
        R.head,
      )(fileExtension);
      if (EXCEL_FORMATS.includes(ext)) {
        setTimeout(() => {
          this.setState({ showSubmitFhlmc: true });
          onProcessFile(files[0]);
        }, 2000);
      } else {
        const sweetAlertPayload = {
          status: 'Kindly upload an excel File',
          level: 'Warning',
          showConfirmButton: true,
        };
        setTimeout(() => { this.setState({ showSubmitFhlmc: false }); }, 2000);
        openSweetAlert(sweetAlertPayload);
      }
      this.setState({ showLoader: false, buttonState: 'UPLOAD EXCEL' });
    }
  }

  handleDownload = () => {
    const { resultData, downloadFile } = this.props;
    const payload = {};
    if (R.has('message', R.head(resultData))) {
      payload.fileName = 'RESPONSE_FROM _FHLMC.xlsx';
      payload.data = resultData;
    } else {
      const metaData = R.filter(data => data.isValid, resultData);
      payload.fileName = 'FHLMC_DATA.xlsx';
      payload.data = metaData;
    }
    downloadFile(payload);
  }

  render() {
    const {
      showSubmitFhlmc, buttonState, showLoader, showMessageProp,
    } = this.state;
    const {
      resultData, submitCases, selectedRequestType,
    } = this.props;
    const hasIncorrectData = (!R.isEmpty(resultData) && !R.isNil(resultData)) ? !R.has('evalId', R.head(resultData)) : false;
    const showTableHeaders = hasIncorrectData ? 'incorrectData' : 'submitToFhlmc';
    const failedCaseId = R.pluck('resolutionId', R.filter(R.propEq('isValid', false), resultData));
    return (
      <Grid container direction="column">
        <Grid item>
          <CustomTable
            defaultPageSize={25}
            getTrProps={(state, rowInfo) => {
              if (rowInfo) {
                const { original } = rowInfo;
                let style = {};
                if (R.contains(original.resolutionId, failedCaseId)) {
                  style = {
                    background: '#e10c32',
                  };
                }
                return {
                  style,
                };
              }
              return {};
            }}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            styleName="table"
            tableData={R.isEmpty(resultData) ? [] : resultData}
            tableHeader={getters.getFhlmcColumns((submitCases && !showMessageProp) ? 'submitCases' : showTableHeaders, selectedRequestType)}
          />
        </Grid>
        <Grid item>
          <Grid
            alignItems="center"
            container
            justify="flex-end"
            style={{ marginTop: '1rem' }}
            xs={12}
          >
            <Grid item>
              {showSubmitFhlmc && (
                <CustomButton
                  color="primary"
                  extraStyle="submit"
                  hasTooltip={false}
                  onClick={this.submitToFhlmc}
                  title="SUBMIT TO FHLMC"
                  variant="contained"
                />
              )
              }
            </Grid>
            <Grid item>
              <label htmlFor="contained-button-file">
                <CustomButton
                  component="span"
                  extraStyle="uploadBtn"
                  hasTooltip
                  startIcon={showLoader ? <Loader size={20} style={{ height: '1.5rem' }} />
                    : <PublishIcon style={{ height: '1.5rem', color: 'darkblue' }} />}
                  title={buttonState}
                  tooltipMessage="Create an excel file with the data
                      from this tab for your review."
                  variant="contained"
                />
                <input
                  hidden
                  id="contained-button-file"
                  multiple
                  onChange={this.handleUpload}
                  type="file"
                />
              </label>
            </Grid>
            <Grid item>
              <CustomButton
                color="primary"
                hasTooltip
                onClick={this.handleDownload}
                startIcon={<GetAppIcon style={{ height: '1.5rem' }} />}
                title="DOWNLOAD EXCEL TO VERIFY"
                tooltipMessage="Create an excel file with the data from this tab for your review."
                variant="contained"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

FHLMCDataInsight.defaultProps = {
  onSubmitToFhlmcRequest: () => { },
  onProcessFile: () => { },
  openSweetAlert: () => { },
  resultData: [],
  selectedRequestType: '',
  portfolioCode: '',
  submitCases: true,
};

FHLMCDataInsight.propTypes = {
  dismissUserNotification: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  onProcessFile: PropTypes.func,
  onSubmitToFhlmcRequest: PropTypes.func,
  openSweetAlert: PropTypes.func,
  portfolioCode: PropTypes.string,
  resultData: PropTypes.arrayOf({
    caseId: PropTypes.string,
    message: PropTypes.string,
  }),
  selectedRequestType: '',
  submitCases: PropTypes.bool,
};

const mapStateToProps = state => ({
  resultData: selectors.resultData(state),
});

const mapDispatchToProps = dispatch => ({
  onSubmitToFhlmcRequest: operations.onSubmitToFhlmcRequest(dispatch),
  openSweetAlert: operations.openSweetAlert(dispatch),
  onProcessFile: operations.onProcessFile(dispatch),
  downloadFile: operations.downloadFile(dispatch),
  dismissUserNotification: operations.onDismissUserNotification(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FHLMCDataInsight);
