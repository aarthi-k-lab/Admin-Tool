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
import { selectors as widgetsSelectors } from 'ducks/widgets';
import { PropTypes } from 'prop-types';
import Loader from 'components/Loader/Loader';
import FHLMCAccordian from './FHLMCAccordian';
import { EXCEL_FORMATS } from '../../../constants/common';
import {
  REQUEST_TYPE_REQ, FILE_UPLOAD_REQ, CANCELLATION_REASON, REQ_PRCS,
  COMMENTS_REASON, COMMENT_EXCEPTON_REQUEST_TYPES, ENABLE_ODM_RERUN, FHLMC,
} from '../../../constants/fhlmc';
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
    };
    this.submitToFhlmc = this.submitToFhlmc.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.renderWidgetContent = this.renderWidgetContent.bind(this);
    this.renderCustomTable = this.renderCustomTable.bind(this);
    this.submitForODMRerun = this.submitForODMRerun.bind(this);
  }

  componentDidMount() {
    const { isWidget, onFhlmcModHistoryPopup } = this.props;
    if (isWidget) {
      this.setState({ showSubmitFhlmc: true });
    }
    onFhlmcModHistoryPopup();
  }

  componentWillUnmount() {
    const { dismissUserNotification } = this.props;
    dismissUserNotification();
  }

  submitToFhlmc = () => {
    const {
      onSubmitToFhlmcRequest, selectedRequestType, portfolioCode,
      selectedCancellationReason, openSweetAlert, exceptionReviewComments,
      exceptionReviewRequestIndicator, isWidget,
    } = this.props;
    if (R.equals(selectedRequestType, 'CXLReq') && R.isEmpty(selectedCancellationReason)) {
      this.terminateAndShowWarning(CANCELLATION_REASON, openSweetAlert, true);
      return;
    }
    const isExceptionReviewCommentsValid = R.equals(exceptionReviewRequestIndicator, 'Yes') && R.isEmpty(R.trim(exceptionReviewComments));
    const isExceptionReviewValid = !COMMENT_EXCEPTON_REQUEST_TYPES.includes(selectedRequestType);
    if (isExceptionReviewCommentsValid && isExceptionReviewValid && isWidget) {
      const sweetAlertPayload = {
        status: COMMENTS_REASON,
        level: 'Warning',
        showConfirmButton: true,
      };
      openSweetAlert(sweetAlertPayload);
      return;
    }
    const status = REQ_PRCS;
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

  submitForODMRerun = () => {
    const { odmRerunOperation } = this.props;
    odmRerunOperation();
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
        const message = R.isEmpty(selectedRequestType) ? REQUEST_TYPE_REQ : FILE_UPLOAD_REQ;
        this.terminateAndShowWarning(message, openSweetAlert, false);
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
    const { popupTableData, downloadFile } = this.props;
    if (!R.isNil(popupTableData) && !R.isEmpty(popupTableData)) {
      return (
        <FHLMCAccordian
          downloadFile={downloadFile}
          loanData={resultData}
          popupTableData={popupTableData}
          selectedRequestType={selectedRequestType}
        />
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

  terminateAndShowWarning(message, openSweetAlert, showSubmitBtn) {
    const sweetAlertPayload = {
      status: message,
      level: 'Warning',
      showConfirmButton: true,
    };
    setTimeout(() => { this.setState({ showSubmitFhlmc: showSubmitBtn, showLoader: false, buttonState: 'UPLOAD EXCEL' }); }, 2000);
    openSweetAlert(sweetAlertPayload);
  }

  render() {
    const {
      showMessageProp, showSubmitFhlmc, buttonState, showLoader,
    } = this.state;
    const {
      resultData, submitCases, selectedRequestType, isWidget, isAssigned, disableSubmitToFhlmc,
      enableODMRerun, openWidgetList,
    } = this.props;
    const isFhlmcWidget = R.contains(FHLMC, openWidgetList);
    return (
      <Grid container direction="column">
        <div styleName="requestCategoryDropdown">
          <span>
            {'History'}
          </span>
        </div>
        {(isWidget)
          ? this.renderWidgetContent(selectedRequestType, resultData, isWidget)
          : this.renderCustomTable(resultData, submitCases, showMessageProp, selectedRequestType)}
        <Grid item>
          <Grid
            alignItems="center"
            container
            justify="flex-end"
            style={{ marginTop: '1rem' }}
            xs={12}
          >
            {!isFhlmcWidget && (
              <>
                <Grid item>
                  {isWidget && (
                  <CustomButton
                    color="primary"
                    disabled={!ENABLE_ODM_RERUN.includes(selectedRequestType) || !enableODMRerun
                      || !isAssigned || R.isEmpty(selectedRequestType)}
                    extraStyle="submit"
                    hasTooltip={false}
                    onClick={this.submitForODMRerun}
                    title="RE-RUN ODM"
                    variant="contained"
                  />
                  )}
                </Grid>
                <Grid item>
                  {showSubmitFhlmc && (
                  <CustomButton
                    color="primary"
                    disabled={disableSubmitToFhlmc
                        || !isAssigned || R.isEmpty(selectedRequestType)}
                    extraStyle="submit"
                    hasTooltip={false}
                    onClick={this.submitToFhlmc}
                    title="SUBMIT TO FHLMC"
                    variant="contained"
                  />
                  )}
                </Grid>
              </>
            )}

            {
              !isWidget && (
                <Grid item>
                  <label htmlFor="contained-button-file">
                    <CustomButton
                      component="span"
                      disabled={!isAssigned}
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
                      disabled={!isAssigned}
                      hidden
                      id="contained-button-file"
                      multiple
                      onChange={this.handleUpload}
                      onClick={this.handleClick}
                      type="file"
                    />
                  </label>
                </Grid>
              )
            }
            {!isFhlmcWidget && (
              <Grid item>
                <CustomButton
                  color="primary"
                  disabled={!isAssigned}
                  extraStyle={isWidget ? 'widgetDwnld' : ''}
                  hasTooltip
                  onClick={this.handleDownload}
                  startIcon={<GetAppIcon style={{ height: '1.5rem' }} />}
                  title="DOWNLOAD EXCEL TO VERIFY"
                  tooltipMessage="Create an excel file with the data from this tab for your review."
                  variant="contained"
                />
              </Grid>
            )}

          </Grid>
        </Grid>
      </Grid>
    );
  }
}

FHLMCDataInsight.defaultProps = {
  onSubmitToFhlmcRequest: () => { },
  onFhlmcModHistoryPopup: () => { },
  onProcessFile: () => { },
  odmRerunOperation: () => { },
  openSweetAlert: () => { },
  openWidgetList: [],
  resultData: [],
  selectedRequestType: '',
  portfolioCode: '',
  submitCases: true,
  isWidget: false,
  selectedCancellationReason: '',
  exceptionReviewRequestIndicator: 'No',
  exceptionReviewComments: '',
  popupTableData: [],
};

FHLMCDataInsight.propTypes = {
  disableSubmitToFhlmc: PropTypes.bool.isRequired,
  dismissUserNotification: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  enableODMRerun: PropTypes.bool.isRequired,
  exceptionReviewComments: PropTypes.string,
  exceptionReviewRequestIndicator: PropTypes.string,
  isAssigned: PropTypes.bool.isRequired,
  isWidget: PropTypes.bool,
  odmRerunOperation: PropTypes.func,
  onFhlmcModHistoryPopup: PropTypes.func,
  onProcessFile: PropTypes.func,
  onSubmitToFhlmcRequest: PropTypes.func,
  openSweetAlert: PropTypes.func,
  openWidgetList: PropTypes.arrayOf(PropTypes.string),
  popupTableData: PropTypes.arrayOf({
    caseId: PropTypes.string,
    message: PropTypes.string,
    reqTypeText: PropTypes.string,
  }),
  portfolioCode: PropTypes.string,
  resultData: PropTypes.arrayOf({
    caseId: PropTypes.string,
    message: PropTypes.string,
  }),
  selectedCancellationReason: PropTypes.string,
  selectedRequestType: '',
  submitCases: PropTypes.bool,
};

const mapStateToProps = state => ({
  resultData: selectors.resultData(state),
  isAssigned: selectors.isAssigned(state),
  popupTableData: selectors.getFhlmcModHistory(state),
  disableSubmitToFhlmc: selectors.disableSubmittofhlmc(state),
  enableODMRerun: selectors.getODMRetryEligibility(state),
  openWidgetList: widgetsSelectors.getOpenWidgetList(state),
});

const mapDispatchToProps = dispatch => ({
  onSubmitToFhlmcRequest: operations.onSubmitToFhlmcRequest(dispatch),
  openSweetAlert: operations.openSweetAlert(dispatch),
  onFhlmcModHistoryPopup: operations.onFHLMCModHistory(dispatch),
  onProcessFile: operations.onProcessFile(dispatch),
  downloadFile: operations.downloadFile(dispatch),
  dismissUserNotification: operations.onDismissUserNotification(dispatch),
  odmRerunOperation: operations.odmRerunOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FHLMCDataInsight);
export { CustomButton };
