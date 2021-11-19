import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteAccess from 'lib/RouteAccess';
import { withRouter } from 'react-router-dom';
import DashboardModel from 'models/Dashboard';
import {
  selectors as loginSelectors,
} from 'ducks/login';
import { operations as stagerOperations, selectors as stagerSelectors } from 'ducks/stager';
import { operations, selectors } from '../../state/ducks/dashboard';
import { operations as checkListOperations } from '../../state/ducks/tasks-and-checklist';
import './StagerReactTable.css';

const handleRowValue = value => (value.startsWith('cmod') ? 'Unassign' : value);

class StagerReactTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getCheckBox = this.getCheckBox.bind(this);
  }

  onSelectAllOption(checked) {
    const { onSelectAll } = this.props;
    onSelectAll(checked, R.map(R.prop(''), this.table.getResolvedState().sortedData));
  }

  static getRowStyleName(value, pointerStyle) {
    if (value < 0) {
      return `${pointerStyle} days-until-sla-red`;
    }
    if (value === 0) {
      return `${pointerStyle}days-until-sla-gray`;
    }
    return `${pointerStyle} tableRow`;
  }

  static getCellContent(row, stagerTaskType, stagerTaskStatus) {
    const pointerStyle = (DashboardModel.POSTMOD_TASKNAMES.includes(stagerTaskType)
    || DashboardModel.UWSTAGER_TASKNAMES.includes(stagerTaskType)) && stagerTaskStatus !== 'Completed' ? 'pointer' : '';
    switch (row.column.id) {
      case 'Days Until SLA':
        return (
          <div styleName={this.getRowStyleName(row.value, pointerStyle)}>
            {`${row.value} ${Math.abs(row.value) > 1 ? 'DAYS' : 'DAY'}`}
          </div>
        );
      case 'Loan Number':
        return (
          <div styleName={this.getRowStyleName(row.original['Days Until SLA'], pointerStyle)}>
            {this.getRowStyleName(row.original['Days Until SLA']) === 'days-until-sla-red'
              ? <img alt="alert-icon" src="/static/img/esclamation.svg" /> : null
            }
            {this.getRowStyleName(row.original['Days Until SLA']) === 'days-until-sla-gray'
              ? <img alt="alert-icon" src="/static/img/warning.svg" /> : null
            }
            {`  ${row.value}`}
          </div>
        );
      case 'Assigned To':
        return (
          <div styleName={`${pointerStyle} tableRow`}>
            {handleRowValue(row.value)}
          </div>
        );
      case 'taskCheckListTemplateName':
        return (
          <div style={{ display: 'none' }} styleName={pointerStyle}>
            {`  ${row.value}`}
          </div>
        );
      default:
        return (
          <div styleName={`${pointerStyle} tableRow`}>
            {row.value}
          </div>
        );
    }
  }

  getGroups() {
    const { user } = this.props;
    return user && user.groupList;
  }

  getLoanActivityPath() {
    const { user } = this.props;
    const groups = user && user.groupList;
    return RouteAccess.hasLoanActivityAccess(groups) ? '/loan-activity' : '/';
  }

  getCheckBox() {
    const { onCheckBoxClick, selectedData } = this.props;
    return {
      accessor: '',
      Cell: ({ original }) => {
        const isSelected = selectedData.find(o => o.TKIID === original.TKIID) || false;
        return (
          <Checkbox
            checked={isSelected}
            onChange={e => onCheckBoxClick(e.target.checked, original)}
            styleName="checkbox"
          />
        );
      },
      Header: () => (
        <Checkbox onChange={e => this.onSelectAllOption(e.target.checked)} styleName="checkboxHeader" />
      ),
      sortable: false,
      filterable: false,
      width: 50,
    };
  }

  getColumnData(stagerTaskType, stagerTaskStatus, isManualOrder, data) {
    const columnData = [];
    const columnObject = {};
    const { data: { facets } } = this.props;
    let columns = [];
    if (data && data[0]) {
      columns = R.compose(
        R.map((columnName) => {
          const columnObj = {};
          columnObj.Header = (
            <div styleName="tableHeader">
              {columnName.toUpperCase()}
            </div>
          );
          const columnWidth = columnName === 'Trial Paid Dates' ? 450 : 160;
          columnObj.minWidth = columnWidth;
          columnObj.accessor = columnName;
          // columnObj.show = this.showColumns(columnName);
          columnObj.Cell = row => this.constructor.getCellContent(
            row, stagerTaskType, stagerTaskStatus,
          );
          columnObj.filterable = true;
          const dropDownValues = facets[columnName];
          columnObj.Filter = ({ filter, onChange }) => (
            <select
              onChange={event => onChange(event.target.value)}
              styleName="filterDropDown"
              value={filter ? filter.value : 'all'}
            >
              <option value="">{}</option>
              {dropDownValues
              && dropDownValues.map(value => <option value={value}>{value}</option>)}
            </select>
          );
          return columnObj;
        }),
        R.without(['', null, 'TKIID']),
        R.keys(),
      )(data[0]);
    }
    columnObject.columns = isManualOrder ? [this.getCheckBox(data),
      ...columns] : columns;
    columnData.push(columnObject);
    return columnData;
  }

  filterColumn = (filter) => {
    const { getDashboardData } = this.props;
    const { data: { pageSize }, activeSearchTerm } = this.props;
    const payload = {
      activeSearchTerm,
      top: pageSize,
      filter,
    };
    getDashboardData(payload);
  }

  pageChange = (pageIndex) => {
    const { getDashboardData } = this.props;
    const {
      data: {
        pageSize, sortOrder,
      }, activeSearchTerm,
    } = this.props;
    const orderby = R.propOr('', 'id', R.head(sortOrder));
    const orderType = R.propOr(false, 'desc', R.head(sortOrder)) ? 'desc' : 'asc';
    const payload = {
      activeSearchTerm,
      top: pageSize,
      page: pageIndex + 1,
      orderby,
      orderType,
    };
    getDashboardData(payload);
  }

  sortChange = (newSort) => {
    const { getDashboardData } = this.props;
    const {
      data: {
        pageSize,
      }, activeSearchTerm,
    } = this.props;
    const sortColumn = R.propOr('', 'id', R.head(newSort));
    const sortOrder = R.propOr(false, 'desc', R.head(newSort)) ? 'desc' : 'asc';
    const payload = {
      activeSearchTerm,
      top: pageSize,
      orderby: sortColumn,
      orderType: sortOrder,
    };
    getDashboardData(payload);
  }

  pageSizeChange = (size) => {
    const { getDashboardData } = this.props;
    const { data: { filter }, activeSearchTerm } = this.props;
    const payload = {
      activeSearchTerm,
      top: size,
      filter,
    };
    getDashboardData(payload);
  }

  getTrPropsType = (state, rowInfo, column, instance, stagerTaskType, stagerTaskStatus) => {
    const { searchResponse } = this.props;
    if (rowInfo) {
      const { original } = rowInfo;
      let style = {};
      if (original['Loan Number'] === searchResponse) {
        style = {
          background: '#e67300',
        };
      }
      return {
        style,
        onClick: (event) => {
          this.handleRowClick(rowInfo, event, stagerTaskType, stagerTaskStatus);
          instance.forceUpdate();
        },
      };
    }
    return {};
  }


  // as of now it is not needed
  showColumns(columnName) {
    const { data: { stagerTaskType } } = this.props;
    return columnName === 'Assigned To' ? (DashboardModel.POSTMOD_TASKNAMES.includes(stagerTaskType)) : true;
  }

  handleRowClick(rowInfo, event, stagerTaskType, stagerTaskStatus) {
    if (event.target.type === 'checkbox') {
      return;
    }
    const {
      onSearchLoanWithTask, data, setStagerTaskName, setBeginSearch,
    } = this.props;
    const { original } = rowInfo;
    if ((DashboardModel.POSTMOD_TASKNAMES.includes(data.stagerTaskType)
    || DashboardModel.UWSTAGER_TASKNAMES.includes(data.stagerTaskType)) && stagerTaskStatus !== 'Completed') {
      const payload = { activeTab: stagerTaskStatus, activeTile: stagerTaskType };
      setStagerTaskName(payload);
      const searchPayload = {
        rowData: original,
        loadSearchedLoan: () => this.loadSearchLoan(),
      };
      onSearchLoanWithTask(searchPayload);
      setBeginSearch();
    }
  }

  loadSearchLoan() {
    const {
      onSelectEval, onGetGroupName, onGetChecklistHistory, history, searchLoanTaskResponse,
    } = this.props;
    if (searchLoanTaskResponse) {
      let group = '';
      if (DashboardModel.POSTMOD_TASKNAMES.includes(searchLoanTaskResponse.taskName)) {
        group = 'POSTMOD';
        this.redirectPath = '/postmodstager';
      } else if (DashboardModel.UWSTAGER_TASKNAMES.includes(searchLoanTaskResponse.taskName)) {
        group = 'UWSTAGER';
        this.redirectPath = '/uwstager';
      } else {
        this.redirectPath = '/frontend-checklist';
        group = 'FEUW';
      }
      onGetGroupName(group);
      const payload = {
        ...searchLoanTaskResponse,
        isSearch: true,
        evalId: searchLoanTaskResponse['Eval ID'],
        loanNumber: searchLoanTaskResponse['Loan Number'],
        taskId: searchLoanTaskResponse.TKIID,
        piid: searchLoanTaskResponse.PID,
        pStatus: 'Active',
        tStatus: searchLoanTaskResponse.taskStatus,
        processName: searchLoanTaskResponse.taskName,
        taskIterationCounter: searchLoanTaskResponse.taskIterationCounter,
        assignee: searchLoanTaskResponse['Assigned To'],
      };
      onSelectEval(payload);
      onGetChecklistHistory(searchLoanTaskResponse.TKIID);
      history.push(this.redirectPath);
    }
  }


  render() {
    const { data } = this.props;
    const pageSize = R.propOr(5, 'pageSize', data);
    const totalPages = R.propOr(0, 'totalPages', data);
    const page = R.propOr(0, 'page', data) - 1;
    const sortOrder = R.propOr([], 'sortOrder', data);
    const filteredData = R.propOr([], 'filter', data);
    const returnVal = data ? (
      <div styleName="stager-table-container">
        <div styleName="stager-table-height-limiter">
          <ReactTable
            ref={(reactTable) => {
              this.table = reactTable;
            }}
            className="-highlight"
            columns={this.getColumnData(data.stagerTaskType,
              data.stagerTaskStatus, data.isManualOrder, data.tableData)}
            data={data.tableData}
            defaultPageSize={pageSize}
            filterable
            filtered={filteredData}
            getTdProps={(
              state, rowInfo, column, instance,
            ) => this.getTrPropsType(
              state, rowInfo, column, instance, data.stagerTaskType, data.stagerTaskStatus,
            )}
            manual
            onFilteredChange={(filter, row) => { this.filterColumn(filter, row); }}
            onPageChange={(pageIndex) => { this.pageChange(pageIndex); }}
            onPageSizeChange={(size) => { this.pageSizeChange(size); }}
            onSortedChange={(newSort) => { this.sortChange(newSort); }}
            page={page}
            pages={totalPages}
            sorted={sortOrder}
            styleName="stagerTable"
          />
        </div>
      </div>
    ) : null;
    return returnVal;
  }
}

const TestExports = {
  StagerReactTable,
};
StagerReactTable.defaultProps = {
  data: [],
};

const mapDispatchToProps = dispatch => ({
  onSelectEval: operations.onSelectEval(dispatch),
  onGetGroupName: operations.onGetGroupName(dispatch),
  setStagerTaskName: operations.setStagerTaskName(dispatch),
  onSearchLoanWithTask: operations.onSearchLoanWithTask(dispatch),
  setBeginSearch: operations.setBeginSearch(dispatch),
  onGetChecklistHistory: checkListOperations.fetchHistoricalChecklistData(dispatch),
  getDashboardData: stagerOperations.getDashboardData(dispatch),
});

const mapStateToProps = state => ({
  user: loginSelectors.getUser(state),
  searchLoanTaskResponse: selectors.searchLoanTaskResponse(state),
  activeSearchTerm: stagerSelectors.getActiveSearchTerm(state),
});

StagerReactTable.propTypes = {
  activeSearchTerm: PropTypes.string.isRequired,
  data: PropTypes.shape(),
  getDashboardData: PropTypes.func.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onGetChecklistHistory: PropTypes.func.isRequired,
  onGetGroupName: PropTypes.func.isRequired,
  onSearchLoanWithTask: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSelectEval: PropTypes.func.isRequired,
  searchLoanTaskResponse: PropTypes.shape().isRequired,
  searchResponse: PropTypes.string.isRequired,
  selectedData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setBeginSearch: PropTypes.func.isRequired,
  setStagerTaskName: PropTypes.func.isRequired,
  user: PropTypes.shape({
    groupList: PropTypes.array,
    userDetails: PropTypes.shape({
      email: PropTypes.string,
      jobTitle: PropTypes.string,
      name: PropTypes.string,
    }),
    userGroups: PropTypes.array,
  }).isRequired,
};

const StagerReactTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StagerReactTable);

export default withRouter(StagerReactTableContainer);
export { TestExports };
