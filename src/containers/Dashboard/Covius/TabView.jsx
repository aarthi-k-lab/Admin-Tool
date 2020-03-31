import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PublishIcon from '@material-ui/icons/Publish';
import './TabView.css';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ReactTable from 'react-table';
import * as R from 'ramda';
import Button from '@material-ui/core/Button';
import { operations, selectors } from 'ducks/dashboard';
import extName from 'ext-name';
import { connect } from 'react-redux';
import TabPanel from './TabPanel';
import ReUploadFile from './ReUploadFile';
import SubmitFileError from './SubmitFileError';
import SweetAlertBox from '../../../components/SweetAlertBox/SweetAlertBox';

const EXCEL_FORMATS = ['xlsx', 'xls'];
const hasPassedProp = R.has('DocumentRequests');
const hasFailedProp = R.has('invalidCases');
const hasUploadFailedProp = R.has('uploadFailed');
class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
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
    const { getExcelFile } = nextProps;
    const { refreshHooks, isFirstVist } = prevState;
    if (!R.isNil(getExcelFile) && isFirstVist) return { buttonState: 'UPLOAD' };
    if (!R.isNil(getExcelFile) && !isFirstVist) return { buttonState: 'SUBMIT' };
    return { refreshHooks: !refreshHooks };
  }

  getColumns = (status) => {
    if (status === 'Passed') {
      return [
        {
          Header: 'Loan Number', accessor: 'UserFields.LOAN_NUMBER', minWidth: 50, maxWidth: 100, style: { width: '10%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Eval ID', accessor: 'UserFields.EVAL_ID', minWidth: 50, maxWidth: 100, style: { width: '10%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Case ID', accessor: 'UserFields.CASEID', minWidth: 50, maxWidth: 100, style: { width: '10%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Request ID', accessor: 'RequestId', minWidth: 100, maxWidth: 200, style: { width: '20%' }, headerStyle: { textAlign: 'left' },
        },
      ];
    }
    return [
      {
        Header: 'Case ID', accessor: 'caseId', minWidth: 30, maxWidth: 70, style: { width: '5%' }, headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Message', accessor: 'message', minWidth: 100, maxWidth: 300, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
      },
    ];
  }

  handleTabSelection = (event, newValue) => {
    const {
      onChange,
      clearSubmitDataResponse,
    } = this.props;
    if (newValue === 2) onChange(false, newValue); else onChange(true, newValue);
    this.setState({ value: newValue, uploadNonExcel: null });
    clearSubmitDataResponse();
  }

  invokeNotification = (message, level) => {
    const { isOpen } = this.state;
    return (
      <SweetAlertBox
        id="sweetAlert"
        message={message}
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
        this.setState({ isFirstVist: false, fileName: event.target.files[0].name });
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
        return (hasPassedProp(tableData) ? tableData.DocumentRequests : []);
      }
      case 'Failed': {
        return (hasFailedProp(tableData) ? tableData.invalidCases : []);
      }
      case 'uploadFailed': {
        return (hasUploadFailedProp(tableData) ? tableData.uploadFailed : []);
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
        return (hasPassedProp(tableData) ? tableData.DocumentRequests.length : 0);
      }
      case 'Failed': {
        return (hasFailedProp(tableData) ? tableData.invalidCases.length : 0);
      }
      case 'Upload Failed': {
        return (hasUploadFailedProp(tableData) ? tableData.uploadFailed.length : 0);
      }
      default: return 0;
    }
  }

  renderUploadFile = () => (
    <div styleName="uploadMsg">Upload verified excel to submit to Covius</div>
  );

  handleRefresh = () => {
    const { onDeleteFile, onReset, tableData } = this.props;
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
    onDeleteFile(true);
  }

  renderUploadPanel = () => {
    const {
      isFailed, fileName, uploadNonExcel, buttonState, hasError,
    } = this.state;
    const { isFileRemoved } = this.props;
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
                  fileName={fileName}
                  id="reupload"
                  onChange={this.handleChange}
                  refreshPage={this.handleRefresh}
                />
              )}
          </div>
          {(checkButtonState || isFileRemoved) && (
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
          )}
        </div>
      </Grid>
    );
  }

  renderTableData = status => (
    <Grid container direction="column">
      <div styleName="table-container">
        <div styleName="height-limiter">
          <ReactTable
            className="-striped -highlight"
            columns={this.getColumns(status)}
            data={this.getTableData(status) || []}
            defaultPageSize={25}
            pageSizeOptions={[10, 20, 25, 50, 100]}
            /* eslint-disable-next-line */
            // getTrProps={(state, rowInfo, column) => {
            //   return {
            //   };
            // }}
            style={{
              height: '47rem',
            }}
            styleName="table"
          />
        </div>
      </div>
    </Grid>
  );

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
    const { value } = this.state;
    const { isUploadFailedTabVisible } = this.props;
    return (
      <>
        <Paper color="default">
          <Tabs
            indicatorColor="primary"
            onChange={(tab, newValue) => this.handleTabSelection(tab, newValue)}
            textColor="primary"
            value={value}
          >
            <Tab
              icon={<FiberManualRecordIcon styleName="failedTab" />}
              label={this.renderCountLabel('Failed')}
              styleName="tabStyle"
            />
            <Tab icon={<FiberManualRecordIcon styleName="passedTab" />} label={this.renderCountLabel('Passed')} styleName="tabStyle" />
            <Tab icon={<PublishIcon styleName="uploadTab" />} label="Upload" styleName="tabStyle" />
            {isUploadFailedTabVisible && (
              <Tab
                icon={<FiberManualRecordIcon styleName="failedTab" />}
                label={this.renderCountLabel('Upload Failed')}
                styleName="tabStyle"
              />
            )
            }
          </Tabs>
        </Paper>
        <TabPanel id="failedTab" index={0} styleName="tabStyle" value={value}>
          {this.renderTableData('Failed')}
        </TabPanel>
        <TabPanel id="passedTab" index={1} styleName="tabStyle" value={value}>
          {this.renderTableData('Passed')}
        </TabPanel>
        <TabPanel id="uploadTab" index={2} styleName="uploadPage" value={value}>
          {this.renderUploadPanel()}
        </TabPanel>
        <TabPanel index={3} styleName="tabStyle" value={value}>
          {this.renderTableData('uploadFailed')}
        </TabPanel>
      </>
    );
  }
}

TabView.propTypes = {
  clearSubmitDataResponse: PropTypes.func.isRequired,
  isFileRemoved: PropTypes.string.isRequired,
  isUploadFailedTabVisible: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onDeleteFile: PropTypes.func.isRequired,
  onProcessFile: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  tableData: PropTypes.shape({
    DocumentRequests: PropTypes.arrayOf({
      UserDetails: PropTypes.shape({
        CASEID: PropTypes.string,
        EVAL_ID: PropTypes.string,
        LOAN_NUMBER: PropTypes.string,
      }),
      RequestId: PropTypes.string,
    }),
    invalidCases: PropTypes.arrayOf({
      caseId: PropTypes.string,
      message: PropTypes.string,
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
  isUploadFailedTabVisible: selectors.isUploadFailedTabVisible(state),
});

const mapDispatchToProps = dispatch => ({
  onProcessFile: operations.onProcessFile(dispatch),
  onDeleteFile: operations.onDeleteFile(dispatch),
  clearSubmitDataResponse: operations.onClearSubmitCoviusData(dispatch),
});


TabView.defaultProps = {
  tableData: {
    DocumentRequests: [],
    invalidCases: [],
    uploadFailed: [],
  },
};

const TestHooks = {
  TabView,
};
export { TestHooks };
export default connect(mapStateToProps, mapDispatchToProps)(TabView);
