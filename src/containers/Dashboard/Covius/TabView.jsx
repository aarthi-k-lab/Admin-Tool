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
          Header: 'LOAN NUMBER', accessor: 'loanNumber', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'PID', accessor: 'pid', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'EVAL ID', accessor: 'evalId', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
        },
        {
          Header: 'STATUS', accessor: 'statusMessage', minWidth: 700, maxWidth: 1000, style: { width: '54%' }, headerStyle: { textAlign: 'left' },
        },
      ];
    }

    return [
      {
        Header: 'Case ID', accessor: 'caseId', minWidth: 100, maxWidth: 200, style: { width: '15%' }, headerStyle: { textAlign: 'left' },
      },
      {
        Header: 'Message', accessor: 'statusMessage', minWidth: 700, maxWidth: 1000, style: { width: '54%' }, headerStyle: { textAlign: 'left' },
      },
    ];
  }

  handleTabSelection = (event, newValue) => {
    this.setState({ value: newValue });
  }

  renderTableData = (tableData, status) => (
    <Grid container direction="column">
      <div styleName="table-container">
        <div styleName="height-limiter">
          <ReactTable
            className="-striped -highlight"
            columns={this.getColumns(status)}
            data={tableData || []}
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

  render() {
    const { value } = this.state;
    const { tableData } = this.props;

    return (
      <>
        <div>
          <Paper color="default" position="static">
            <Tabs
              indicatorColor="primary"
              onChange={(tab, newValue) => this.handleTabSelection(tab, newValue)}
              textColor="primary"
              value={value}
            >
              <Tab icon={<FiberManualRecordIcon styleName="failedTab" />} label="Failed" />
              <Tab icon={<FiberManualRecordIcon styleName="passedTab" />} label="Passed" />
              <Tab icon={<PublishIcon styleName="uploadTab" />} label="Upload" />

            </Tabs>
          </Paper>
        </div>
        <TabPanel index={0} styleName="tabStyle" value={value}>
          {this.renderTableData(R.filter(row => row.success === false, tableData), 'failure')}
        </TabPanel>
        <TabPanel index={1} styleName="tabStyle" value={value}>
          {this.renderTableData(R.filter(row => row.success === true, tableData), 'success')}
        </TabPanel>
        <TabPanel index={2} value={value}>
            Upload
        </TabPanel>
      </>
    );
  }
}

TabView.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      evalId: PropTypes.string,
      loanNumber: PropTypes.string,
      pid: PropTypes.string,
      statusMessage: PropTypes.string,
    }),
  ),
};

TabView.defaultProps = {
  tableData: [
    {
      loanNumber: '165231', pid: '0', evalId: '1', statusMessage: '', success: true,
    }, {
      caseId: '186482', statusMessage: '', success: false,
    }, {
      caseId: '848487', statusMessage: '', success: false,
    },
  ],
};

export default TabView;
