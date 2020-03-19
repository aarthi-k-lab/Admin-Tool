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
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { operations, selectors } from 'ducks/dashboard';
import extName from 'ext-name';
import { connect } from 'react-redux';
import TabPanel from './TabPanel';
import ReUploadFile from './ReUploadFile';
import SubmitFileError from './SubmitFileError';

const EXCEL_FORMATS = ['xlsx', 'xls'];

class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      isFailed: false,
      isUploading: false,
      showUpload: true,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { getExcelFile } = nextProps;
    if (R.isNil(getExcelFile)) return { isUploading: false };
    return { isUploading: false };
  }

  getColumns = (status) => {
    if (status === 'Passed') {
      return [
        {
          Header: 'LOAN NUMBER', accessor: 'LOAN_NUMBER', field: 'UserFields.LOAN_NUMBER', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Case ID', accessor: 'CASEID', field: 'UserFields.CASEID', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Request ID', accessor: 'RequestId', field: 'RequestId', minWidth: 300, maxWidth: 700, style: { width: '40%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'Eval ID', accessor: 'EVAL_ID', field: 'UserFields.EVAL_ID', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
        },
      ];
    }
    return [
      {
        Header: 'Case ID', accessor: 'caseId', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Message', accessor: 'message', minWidth: 100, maxWidth: 300, style: { width: '20%' }, headerStyle: { textAlign: 'left' },
      },
    ];
  }

  handleTabSelection = (event, newValue) => {
    this.setState({ value: newValue });
  }

  handleUpload = (event) => {
    const { onProcessFile } = this.props;
    if (event.target.files[0]) {
      const fileName = event.target.files[0].name;
      const fileExtension = extName(fileName);
      const ext = R.compose(
        R.prop('ext'),
        R.head,
      )(fileExtension);
      if (EXCEL_FORMATS.includes(ext)) {
        onProcessFile(event.target.files[0]);
      }
      // handle else part
    }
    this.setState({ isUploading: true, showUpload: false });
  };

  getRow = (rowData, fields) => {
    const object = {};
    R.forEach((field) => {
      const array = field.split('.');
      const { length, [length - 1]: last } = array;
      object[`${last}`] = R.path(array, rowData);
    }, fields);
    return object;
  }

  getTableData = (status) => {
    const { tableData } = this.props;
    if (R.isEmpty(tableData)) {
      return [];
    }
    if (status === 'Passed') {
      const fields = R.pluck('field', this.getColumns(status));
      return R.map(docRequest => this.getRow(docRequest, fields),
        tableData.DocumentRequests);
    }
    const fields = R.pluck('accessor', this.getColumns(status));
    return R.map(R.pickAll(fields), tableData.invalidCases);
  }

  getCount = (text) => {
    const { tableData } = this.props;
    if (R.isEmpty(tableData)) {
      return 0;
    }
    return text === 'Passed'
      ? tableData.DocumentRequests.length
      : tableData.invalidCases.length;
  }

  renderUploadFile = () => (
    <div styleName="uploadMsg">Upload verified excel to submit to Covius</div>
  );

  renderUploadPanel = () => {
    const { isUploading, showUpload, isFailed } = this.state;
    const Upload = isUploading || isFailed ? 'UPLOADING...' : 'UPLOAD';
    const renderMessage = isFailed ? <SubmitFileError /> : this.renderUploadFile();
    return (
      <Grid container>
        <div>
          <div>
            { (showUpload || isFailed) && <CloudUploadIcon styleName="uploadImage" /> }
            {showUpload ? renderMessage : <ReUploadFile onChange={this.handleChange} />}
          </div>
          <Button
            color="primary"
            component="label"
            onChange={this.handleUpload}
            style={{
              label: 'uploadLabel',
            }}
            styleName="uploadButton"
            variant="contained"
          >
            {showUpload ? Upload : 'SUBMIT TO COVIUS'}
            <input
              style={{ display: 'none' }}
              type="file"
            />
          </Button>
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
            /* eslint-disable-next-line */
            // getTrProps={(state, rowInfo, column) => {
            //   return {
            //   };
            // }}
            pageSizeOptions={[10, 20, 25, 50, 100]}
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

  handleChange = (value) => {
    console.log(value);
    this.setState({ showUpload: !value });
  }

  render() {
    const { value } = this.state;
    return (
      <>
        <div>
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
            </Tabs>
          </Paper>
        </div>
        <TabPanel index={0} styleName="tabStyle" value={value}>
          {this.renderTableData('Failed')}
        </TabPanel>
        <TabPanel index={1} styleName="tabStyle" value={value}>
          {this.renderTableData('Passed')}
        </TabPanel>
        <TabPanel index={2} styleName="uploadPage" value={value}>
          {this.renderUploadPanel()}
        </TabPanel>
      </>
    );
  }
}

TabView.propTypes = {
  onProcessFile: PropTypes.func.isRequired,
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
  }),
};

const mapStateToProps = state => ({
  getExcelFile: selectors.getUploadedFile(state),
});

const mapDispatchToProps = dispatch => ({
  onProcessFile: operations.onProcessFile(dispatch),
});


TabView.defaultProps = {
  tableData: {
    DocumentRequests: [],
    invalidCases: [],
  },
};

export default connect(mapStateToProps, mapDispatchToProps)(TabView);
