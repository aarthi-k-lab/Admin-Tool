import React from 'react';
import './TabView.css';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ReactTable from 'react-table';
import * as R from 'ramda';
import Button from '@material-ui/core/Button';
import { operations, selectors } from 'ducks/dashboard';
import extName from 'ext-name';
import { connect } from 'react-redux';
import DashboardModel from 'models/Dashboard';
import TabPanel from './TabPanel';
import ReUploadFile from './ReUploadFile';
import SubmitFileError from './SubmitFileError';
import SweetAlertBox from '../../../components/SweetAlertBox/SweetAlertBox';
import SimpleTabs from './Tabs';

const EXCEL_FORMATS = ['xlsx', 'xls'];
const hasPassedProp = R.has('request');
const hasFailedProp = R.has('invalidCases');
const hasUploadFailedProp = R.has('uploadFailed');

class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFailed: false,
      buttonState: 'UPLOAD',
      fileName: '',
      isOpen: true,
      uploadNonExcel: null,
      refreshHooks: true,
      isFirstVist: true,
      hasError: false,
    };
    this.invokeNotification = this.invokeNotification.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { getExcelFile, fileSubmitResponse } = nextProps;
    const { refreshHooks, isFirstVist } = prevState;
    let newState = {};
    if (fileSubmitResponse
      && R.equals(fileSubmitResponse.level, DashboardModel.Messages.LEVEL_SUCCESS)) {
      newState = {
        isFailed: false,
        buttonState: 'UPLOAD',
        fileName: '',
        isOpen: true,
        uploadNonExcel: null,
        isFirstVist: true,
        hasError: false,
      };
    }
    if (!R.isNil(getExcelFile)) {
      newState = Object.assign(newState, { buttonState: isFirstVist ? 'UPLOAD' : 'SUBMIT' });
    }

    Object.assign(newState, { refreshHooks: !refreshHooks });
    return newState;
  }

  getColumns = (status) => {
    const { eventCategory } = this.props;
    const isSubmitFullment = eventCategory === DashboardModel.EVENT_CATEGORY_FILTER;
    if (status === 'Passed') {
      return [
        {
          Header: 'Loan Number',
          accessor: isSubmitFullment ? d => d['UserFields.Content.LON'] : 'LoanNumber',
          minWidth: 50,
          id: 'UserFields.Content.LON',
          maxWidth: 100,
          style: { width: '10%' },
          headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Eval ID',
          accessor: isSubmitFullment ? d => d['UserFields.Content.EVALID'] : 'EvalId',
          id: 'UserFields.Content.EVALID',
          minWidth: 50,
          maxWidth: 100,
          style: { width: '10%' },
          headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Case ID',
          accessor: isSubmitFullment ? d => d['UserFields.Content.CASEID'] : 'CaseId',
          id: 'UserFields.Content.CASEID',
          minWidth: 50,
          maxWidth: 100,
          style: { width: '10%' },
          headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Request ID',
          accessor: 'RequestId',
          minWidth: 100,
          maxWidth: 400,
          style: { width: '80%' },
          headerStyle: { textAlign: 'left' },
        },
      ];
    }
    return [
      {
        Header: 'Case ID',
        accessor: 'caseId',
        minWidth: 50,
        maxWidth: 100,
        style: { width: '10%', whiteSpace: 'unset' },
        headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Message',
        accessor: 'reason',
        minWidth: 100,
        maxWidth: 400,
        style: { width: '15%' },
        headerStyle: { textAlign: 'left' },
      },
    ];
  }

  handleTabSelection = (event, newValue) => {
    const {
      clearSubmitDataResponse, setCoviusIndex,
    } = this.props;
    setCoviusIndex({ coviusTabIndex: newValue });
    this.setState({ uploadNonExcel: null });
    clearSubmitDataResponse();
  }

  hideAlert = () => {
    this.setState({ uploadNonExcel: null });
  }

  invokeNotification = (message, level) => {
    const { isOpen } = this.state;
    return (
      <SweetAlertBox
        confirmButtonColor="#004261"
        id="sweetAlert"
        message={message}
        onConfirm={() => this.hideAlert()}
        show={isOpen}
        type={level}
      />
    );
  }

  makeUploadDelay = (fileName) => {
    setTimeout(() => {
      this.setState({
        fileName,
        buttonState: 'SUBMIT',
        isFirstVist: false,
      });
    }, 3000);
  };

  handleUpload = (event) => {
    const { onProcessFile, onDeleteFile } = this.props;
    this.setState({ uploadNonExcel: null, buttonState: 'UPLOADING...', isFailed: false });
    if (event.target.files[0]) {
      const fileName = event.target.files[0].name;
      const fileExtension = extName(fileName);
      const ext = R.compose(
        R.prop('ext'),
        R.head,
      )(fileExtension);
      if (EXCEL_FORMATS.includes(ext)) {
        onProcessFile(event.target.files[0]);
        onDeleteFile(false);
        this.makeUploadDelay(event.target.files[0].name);
        this.setState({
          isFirstVist: false,
          fileName: event.target.files[0].name,
          isFailed: false,
          hasError: false,
        });
      } else {
        const uploadNonExcelFile = this.invokeNotification('Kindly upload an excel File', 'Warning');
        setTimeout(() => {
          this.setState({
            uploadNonExcel: uploadNonExcelFile,
            isFailed: true,
            buttonState: 'UPLOAD',
            hasError: true,
          });
        }, 2000);
      }
    }
  };

  getTableData = (status) => {
    const { tableData } = this.props;
    if (R.isEmpty(tableData)) {
      return [];
    }
    switch (status) {
      case 'Passed':
      {
        return (hasPassedProp(tableData) ? tableData.request : []);
      }
      case 'Failed': {
        return (hasFailedProp(tableData) ? tableData.invalidCases : []);
      }
      case 'uploadFailed': {
        return (hasUploadFailedProp(tableData) ? tableData.uploadFailed : null);
      }
      default: return [];
    }
  }

  getCount = (text) => {
    const { tableData } = this.props;
    if (R.isEmpty(tableData)) {
      return 0;
    }
    switch (text) {
      case 'Passed': {
        return (tableData.request ? tableData.request.length : 0);
      }
      case 'Failed': {
        return (tableData.invalidCases ? tableData.invalidCases.length : 0);
      }
      case 'Upload Failed': {
        return (tableData.uploadFailed && tableData.uploadFailed.length);
      }
      default: return 0;
    }
  }

  renderUploadFile = () => (
    <div styleName="uploadMsg">Upload verified excel to submit to Covius</div>
  );

  handleRefresh = () => {
    const { onReset, tableData } = this.props;
    this.setState({
      isFailed: false,
      buttonState: 'UPLOAD',
      fileName: '',
      isOpen: true,
      uploadNonExcel: null,
      isFirstVist: true,
      hasError: false,
    });
    if (!hasUploadFailedProp(tableData)) onReset();
  }

  renderUploadPanel = () => {
    const {
      isFailed, fileName, uploadNonExcel, buttonState, hasError,
    } = this.state;
    const { isFileRemoved, eventCategory } = this.props;
    const checkButtonState = R.equals(buttonState, 'UPLOAD') || R.equals(buttonState, 'UPLOADING...');
    const renderMessage = isFailed || hasError ? <SubmitFileError /> : this.renderUploadFile();
    return (
      <Grid container>
        <div styleName="tabViewDiv">
          {uploadNonExcel}
          <div>
            {(checkButtonState || isFailed || isFileRemoved)
              && <img alt="landing page placeholder" src="/static/img/upload.svg" styleName="uploadImage" />
            }
            {!R.equals(buttonState, 'SUBMIT') || isFileRemoved ? renderMessage
              : (
                <ReUploadFile
                  eventCategory={eventCategory}
                  fileName={fileName}
                  id="reupload"
                  onChange={this.handleChange}
                  refreshPage={this.handleRefresh}
                  switchToUploadFailedTab={this.switchToUploadFailedTab}
                />
              )}
          </div>
          {(checkButtonState || isFileRemoved) && (
            <>
              <form onChange={this.handleUpload} styleName="drap-and-drop-area">
                <input type="file" />
                <p>Drag your files here or click in this area.</p>
              </form>
              <Button
                color="primary"
                component="label"
                id="upload"
                onChange={this.handleUpload}
                style={{
                  label: 'uploadLabel',
                }}
                styleName="uploadButton"
                variant="contained"
              >
                {buttonState === 'SUBMIT' ? 'UPLOAD' : buttonState}
                <input
                  style={{ display: 'none' }}
                  type="file"
                />
              </Button>
            </>
          )}
        </div>
      </Grid>
    );
  }

  renderTableData = (status) => {
    const data = this.getTableData(status);
    return (
      <Grid container direction="column">
        <div styleName="table-container">
          <div styleName="height-limiter">
            <ReactTable
              className="-striped -highlight"
              columns={this.getColumns(status)}
              data={data || []}
              defaultPageSize={25}
              pageSizeOptions={[10, 20, 25, 50, 100]}
              style={{
                height: '53rem',
              }}
              styleName="table"
            />
          </div>
        </div>
      </Grid>
    );
  }

  renderCountLabel = text => (
    <>
      <div>
        {text}
      </div>
      <div styleName="countStyle">
        {this.getCount(text)}
      </div>
    </>
  );

  handleChange = () => {
    const { onDeleteFile } = this.props;
    onDeleteFile(true);
    this.setState({
      isFailed: false,
      buttonState: 'UPLOAD',
      fileName: '',
      isOpen: true,
      uploadNonExcel: null,
      isFirstVist: true,
      hasError: false,
    });
  }

  render() {
    const { coviusTabIndex } = this.props;
    return (
      <>
        <SimpleTabs
          coviusTabIndex={coviusTabIndex}
          getCount={this.getCount}
          handleTabSelection={this.handleTabSelection}
          renderCountLabel={this.renderCountLabel}
        />
        <TabPanel id="failedTab" index={0} styleName="tabPanelStyle" value={coviusTabIndex}>
          {this.renderTableData('Failed')}
        </TabPanel>
        <TabPanel id="passedTab" index={1} styleName="tabPanelStyle" value={coviusTabIndex}>
          {this.renderTableData('Passed')}
        </TabPanel>
        <TabPanel id="uploadTab" index={2} value={coviusTabIndex}>
          {this.renderUploadPanel()}
        </TabPanel>
        <TabPanel index={3} styleName="tabPanelStyle" value={coviusTabIndex}>
          {this.renderTableData('uploadFailed')}
        </TabPanel>
      </>
    );
  }
}

TabView.propTypes = {
  clearSubmitDataResponse: PropTypes.func.isRequired,
  coviusTabIndex: PropTypes.number,
  eventCategory: PropTypes.string.isRequired,
  fileSubmitResponse: PropTypes.shape({
    level: PropTypes.string,
  }),
  isFileRemoved: PropTypes.string.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  onProcessFile: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  setCoviusIndex: PropTypes.func.isRequired,
  tableData: PropTypes.shape({
    invalidCases: PropTypes.arrayOf({
      caseId: PropTypes.string,
      message: PropTypes.string,
    }),
    request: PropTypes.arrayOf({
      UserDetails: PropTypes.shape({
        CASEID: PropTypes.string,
        EVAL_ID: PropTypes.string,
        LOAN_NUMBER: PropTypes.string,
      }),
      RequestId: PropTypes.string,
    }),
    uploadFailed: PropTypes.arrayOf({
      caseId: PropTypes.string,
      message: PropTypes.string,
    }),
  }),
};

const mapStateToProps = state => ({
  getExcelFile: selectors.getUploadedFile(state),
  isFileRemoved: selectors.isFileDeleted(state),
  fileSubmitResponse: selectors.getFileSubmitResponse(state),
  coviusTabIndex: selectors.getCoviusTabIndex(state),
});

const mapDispatchToProps = dispatch => ({
  onProcessFile: operations.onProcessFile(dispatch),
  onDeleteFile: operations.onDeleteFile(dispatch),
  clearSubmitDataResponse: operations.onClearSubmitCoviusData(dispatch),
  setCoviusIndex: operations.setCoviusIndex(dispatch),
});


TabView.defaultProps = {
  tableData: {
    request: [],
    invalidCases: [],
    uploadFailed: [],
  },
  fileSubmitResponse: {},
  coviusTabIndex: 0,
};

const TestHooks = {
  TabView,
};
export { TestHooks };
export default connect(mapStateToProps, mapDispatchToProps)(TabView);
