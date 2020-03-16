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
import TabPanel from './TabPanel';

class TabView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  getColumns = (status) => {
    if (status === 'success') {
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

  getTableData = (status) => {
    const { tableData } = this.props;
    if (status === 'success') {
      const fields = R.pluck('field', this.getColumns(status));
      const objects = [];
      tableData.DocumentRequests.forEach((req) => {
        const object = {};
        R.forEach((field) => {
          const array = field.split('.');
          const { length, [length - 1]: last } = array;
          object[`${last}`] = R.path(array, req);
        }, fields);
        objects.push(object);
      });
      return objects;
    }
    const fields = R.pluck('accessor', this.getColumns(status));
    return R.map(R.pickAll(fields), tableData.invalidCases);
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
              <Tab icon={<FiberManualRecordIcon styleName="failedTab" />} label="Failed" styleName="tabStyle" />
              <Tab icon={<FiberManualRecordIcon styleName="passedTab" />} label="Passed" styleName="tabStyle" />
              <Tab icon={<PublishIcon styleName="uploadTab" />} label="Upload" styleName="tabStyle" />
            </Tabs>
          </Paper>
        </div>
        <TabPanel index={0} styleName="tabStyle" value={value}>
          {this.renderTableData('failure')}
        </TabPanel>
        <TabPanel index={1} styleName="tabStyle" value={value}>
          {this.renderTableData('success')}
        </TabPanel>
        <TabPanel index={2} value={value}>
          Upload
        </TabPanel>
      </>
    );
  }
}

TabView.propTypes = {
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

TabView.defaultProps = {
  tableData: {
    DocumentRequests: [],
    invalidCases: [],
  },
};

export default TabView;
