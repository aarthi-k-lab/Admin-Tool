import React from 'react';
import Grid from '@material-ui/core/Grid';
import CustomTable from 'components/CustomTable';
import PublishIcon from '@material-ui/icons/Publish';
import getters from 'models/Headers';
import GetAppIcon from '@material-ui/icons/GetApp';
import * as R from 'ramda';
import extName from 'ext-name';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/dashboard';
import ResultStatus from 'components/ResultStatus';
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
      {hasTooltip && (
        <Tooltip
          placement="top"
          title={(
            <Typography>
              {tooltipMessage}
            </Typography>
          )}
        >
          <ErrorIcon styleName="cstmBtnErrSvg" />
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
      isFileUploaded: false,
    };
    this.submitToFhlmc = this.submitToFhlmc.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.renderWidgetContent = this.renderWidgetContent.bind(this);
    this.renderCustomTable = this.renderCustomTable.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (!R.isEmpty(props.selectedRequestType) && props.isWidget && state.isFileUploaded) {
      return { showSubmitFhlmc: true };
    }
    return null;
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
    this.setState({ showMessageProp: true });
  }

  handleClick = (event) => {
    // eslint-disable-next-line no-param-reassign
    event.target.value = '';
  }

  handleUpload = (event) => {
    const {
      onProcessFile, openSweetAlert, isWidget, selectedRequestType,
    } = this.props;
    const { files } = event.target;
    this.setState({ buttonState: 'UPLOADING...', showLoader: true });
    if (event.target.files[0]) {
      const fileName = event.target.files[0].name;
      const fileExtension = extName(fileName);
      const ext = R.compose(
        R.prop('ext'),
        R.head,
      )(fileExtension);
      if (EXCEL_FORMATS.includes(ext) && !R.isEmpty(selectedRequestType)) {
        setTimeout(() => {
          if (!isWidget || !R.isEmpty(selectedRequestType)) {
            this.setState({ showSubmitFhlmc: true });
          }
          onProcessFile(files[0]);
          this.setState({ showLoader: false, buttonState: 'UPLOAD EXCEL' });
        }, 2000);
      } else {
        const sweetAlertPayload = {
          status: R.isEmpty(selectedRequestType) ? 'Please select request type and upload excel file' : 'Kindly upload an excel File',
          level: 'Warning',
          showConfirmButton: true,
        };
        setTimeout(() => { this.setState({ showSubmitFhlmc: false, showLoader: false, buttonState: 'UPLOAD EXCEL' }); }, 2000);
        openSweetAlert(sweetAlertPayload);
      }
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

  renderWidgetContent = (selectedRequestType, resultData) => {
    if (!R.isNil(resultData) && !R.isEmpty(resultData)) {
      const loan = resultData[0];
      return (
        <Paper styleName="tablealign">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> Case ID</TableCell>
                  <TableCell>Eval Id</TableCell>
                  <TableCell>Loan Number</TableCell>
                  <TableCell>Request Type</TableCell>
                  <TableCell>Result</TableCell>
                  {loan.message ? (
                    <TableCell>
                      Message
                    </TableCell>
                  ) : null}

                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow key={loan.resolutionId}>
                  <TableCell>
                    {loan.resolutionId}
                  </TableCell>
                  <TableCell>{loan.evalId}</TableCell>
                  <TableCell>{loan.servicerLoanIdentifier || loan.loanNumber}</TableCell>
                  {selectedRequestType ? (
                    <TableCell>
                      {selectedRequestType}
                    </TableCell>
                  ) : (
                    <TableCell />
                  )}
                  <TableCell styleName="align-selector">
                    <ResultStatus cellProps={{ original: { isValid: loan.isValid } }} />
                  </TableCell>
                  {loan.message ? (
                    <TableCell styleName="table-content-align">
                      {loan.message}
                    </TableCell>
                  ) : null}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      );
    }
    return null;
  }

  renderCustomTable = (resultData, submitCases, showMessageProp, selectedRequestType) => {
    const hasIncorrectData = (!R.isEmpty(resultData) && !R.isNil(resultData)) ? !R.has('evalId', R.head(resultData)) : false;
    const showTableHeaders = hasIncorrectData ? 'incorrectData' : 'submitToFhlmc';
    const failedCaseId = R.pluck('resolutionId', R.filter(R.propEq('isValid', false), resultData));
    return (
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
    );
  }

  render() {
    const {
      showMessageProp, showSubmitFhlmc, buttonState, showLoader,
    } = this.state;
    const {
      resultData, submitCases, selectedRequestType, isWidget,
    } = this.props;
    return (
      <Grid container direction="column">
        <Grid item>
          {(isWidget)
            ? this.renderWidgetContent(selectedRequestType, resultData, isWidget)
            : this.renderCustomTable(resultData, submitCases, showMessageProp, selectedRequestType)}
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
                  onClick={this.handleClick}
                  type="file"
                />
              </label>
            </Grid>
            <Grid item>
              <CustomButton
                color="primary"
                extraStyle={isWidget ? 'widgetDwnld' : ''}
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
  isWidget: false,
};

FHLMCDataInsight.propTypes = {
  dismissUserNotification: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  isWidget: PropTypes.bool,
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
