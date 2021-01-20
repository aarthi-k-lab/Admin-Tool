import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment-timezone';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { selectors as milestoneSelector } from 'ducks/milestone-activity';
import Divider from '@material-ui/core/Divider';
import './CenterPane.css';

const getCSTDateTime = dateTime => (R.isNil(dateTime) ? '-' : moment(dateTime).tz('America/Chicago').format('MM/DD/YYYY hh:mm A'));

class CenterPane extends React.PureComponent {
  render() {
    const columns = [
      { id: 'taskId', label: 'Task ID', minWidth: 50 },

      { id: 'bpmStatus', label: 'BPM Status', minWidth: 100 },
      { id: 'taskName', label: 'Task Name', minWidth: 100 },
      {
        id: 'tskStsChg',
        label: 'Task Status Change',
        minWidth: 120,
      },
      {
        id: 'tskStrDt',
        label: 'Task Start Date',
        minWidth: 100,
        format: value => (value !== null ? getCSTDateTime(value) : ''),
      },
      {
        id: 'tskEnDt',
        label: 'Task End Date',
        minWidth: 100,
        format: value => (value !== null ? getCSTDateTime(value) : ''),
      },
      {
        id: 'tskAgnUsr',
        label: 'Task Assigned User',
        minWidth: 120,

      },
      {
        id: 'taskSkill',
        label: 'Task Skill',
        minWidth: 100,

      },
      {
        id: 'tskHrdAgnInd',
        label: 'Task Hard Assigned Ind',
        minWidth: 140,

      },
      {
        id: 'tskStsChgRs',
        label: 'Task Status Change Reason',
        minWidth: 170,

      },
      {
        id: 'tskNxtSchActDt',
        label: 'Task Next Scheduled Action Date',
        minWidth: 170,
        format: value => (value !== null ? getCSTDateTime(value) : ''),
      },
      {
        id: 'tskNxtSchActTy',
        label: 'Task Next Scheduled Action Type',
        minWidth: 170,
      },
      {
        id: 'iteration',
        label: 'Iteration',
        minWidth: 100,

      },
    ];
    const { taskDetails, mlstnName } = this.props;
    return (

      <>
        <div styleName="taskDetails">
          <div styleName="taskPerformed">TASK NAME</div>
          <div styleName="taskPerformedstats">{R.toUpper(mlstnName)}</div>
          <div styleName="divider">
            <Divider />
          </div>
        </div>

        <Paper styleName="tablealign">
          <TableContainer component={Paper} styleName="container">
            <Table
              size="small"
              stickyHeader
            >
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {taskDetails && taskDetails.map(row => (
                  <TableRow key={row.name} hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </>
    );
  }
}
const TestExports = {
  CenterPane,
};
CenterPane.propTypes = {
  mlstnName: PropTypes.string.isRequired,
  taskDetails: PropTypes.arrayOf({}).isRequired,
};
const mapStateToProps = state => ({
  taskDetails: milestoneSelector.getTaskDetails(state),
  mlstnName: milestoneSelector.getMlstnName(state),
});
export default connect(mapStateToProps, null)(CenterPane);
export { TestExports };
