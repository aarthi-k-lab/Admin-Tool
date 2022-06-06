/* eslint-disable no-restricted-syntax */
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
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
import { operations, selectors } from '../../state/ducks/dashboard';
import { operations as checkListOperations } from '../../state/ducks/tasks-and-checklist';
import { selectors as stagerSelectors } from '../../state/ducks/stager';
import './CustomReactTable.css';

const handleRowValue = value => (value.startsWith('cmod') ? 'Unassign' : value);

class CustomReactTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getCheckBox = this.getCheckBox.bind(this);
  }

  onSelectAllOption(checked) {
    const { onSelectAll, activeSearchTerm } = this.props;
    let selection = R.map(R.prop(''), this.table.getResolvedState().sortedData);
    if (activeSearchTerm === 'ValueOrdered') {
      selection = selection.filter(x => R.propOr('', 'Investor Name', x) === 'Freddie');
    }
    onSelectAll(checked, selection);
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
          <div>
            <Tooltip title={<h2>{row.value}</h2>}>
              <div styleName={`${pointerStyle} tableRow`}>
                {row.value}
              </div>
            </Tooltip>
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
    const {
      onCheckBoxClick, selectedData, activeSearchTerm, data,
    } = this.props;
    return {
      accessor: '',
      Cell: ({ original }) => {
        const isSelected = selectedData.find(o => o.TKIID === original.TKIID) || false;
        const shouldShowCheckbox = (activeSearchTerm !== 'ValueOrdered') || original['Investor Name'] === 'Freddie';
        return (shouldShowCheckbox
          ? (
            <Checkbox
              checked={isSelected}
              onChange={e => onCheckBoxClick(e.target.checked, original)}
              styleName="checkbox"
            />
          ) : false
        );
      },
      Header: () => (
        (activeSearchTerm !== 'ValueOrdered') || R.any(x => R.propOr('', 'Investor Name', x) === 'Freddie', R.map(R.prop(''), data))
          ? <Checkbox onChange={e => this.onSelectAllOption(e.target.checked)} styleName="checkboxHeader" />
          : false
      ),
      sortable: false,
      filterable: false,
      width: 50,
    };
  }

  getColumnData(stagerTaskType, stagerTaskStatus, isManualOrder, data) {
    const { activeSearchTerm } = this.props;
    const columnData = [];
    const columnObject = {};
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
          columnObj.filterMethod = (filter, row) => row[filter.id].toString() === filter.value;
          const dropDownValues = R.without(['', null], R.uniq(data.map(dataUnit => dataUnit[columnName])));
          columnObj.Filter = ({ filter, onChange }) => (
            <select
              onChange={event => onChange(event.target.value)}
              styleName="filterDropDown"
              value={filter ? filter.value : 'all'}
            >
              <option value="">{}</option>
              {dropDownValues.map(value => <option value={value}>{value}</option>)}
            </select>
          );
          return columnObj;
        }),
        R.without(['', null, 'TKIID']),
        R.keys(),
      )(data[0]);
    }
    columnObject.columns = (isManualOrder || (activeSearchTerm === 'ValueOrdered')) ? [this.getCheckBox(data),
      ...columns] : columns;
    columnData.push(columnObject);
    return columnData;
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
            defaultPageSize={100}
            defaultSorted={data.defaultSorted ? [
              {
                id: data.defaultSorted,
                asc: true,
              },
            ] : []}
            filterable
            getTdProps={(
              state, rowInfo, column, instance,
            ) => this.getTrPropsType(
              state, rowInfo, column, instance, data.stagerTaskType, data.stagerTaskStatus,
            )}
            styleName="stagerTable"
          />
        </div>
      </div>
    ) : null;
    return returnVal;
  }
}

const TestExports = {
  CustomReactTable,
};
CustomReactTable.defaultProps = {
  data: [],
};

const mapDispatchToProps = dispatch => ({
  onSelectEval: operations.onSelectEval(dispatch),
  onGetGroupName: operations.onGetGroupName(dispatch),
  setStagerTaskName: operations.setStagerTaskName(dispatch),
  onSearchLoanWithTask: operations.onSearchLoanWithTask(dispatch),
  setBeginSearch: operations.setBeginSearch(dispatch),
  onGetChecklistHistory: checkListOperations.fetchHistoricalChecklistData(dispatch),
});

const mapStateToProps = state => ({
  user: loginSelectors.getUser(state),
  searchLoanTaskResponse: selectors.searchLoanTaskResponse(state),
  activeSearchTerm: stagerSelectors.getActiveSearchTerm(state),
});

CustomReactTable.propTypes = {
  activeSearchTerm: PropTypes.string.isRequired,
  data: PropTypes.shape(),
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

const CustomReactTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomReactTable);

export default withRouter(CustomReactTableContainer);
export { TestExports };
