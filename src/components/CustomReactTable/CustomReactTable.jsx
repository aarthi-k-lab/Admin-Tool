/* eslint-disable no-restricted-syntax */
import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import RouteAccess from 'lib/RouteAccess';
import { withRouter } from 'react-router-dom';
import {
  selectors as loginSelectors,
} from 'ducks/login';
import { selectors as stagerSelectors } from 'ducks/stager';
import { operations, selectors } from '../../state/ducks/dashboard';
import { operations as checkListOperations } from '../../state/ducks/tasks-and-checklist';
import './CustomReactTable.css';

class CustomReactTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false,
    };
    this.getCheckBox = this.getCheckBox.bind(this);
  }

  onSelectAllOption(checked) {
    const { onSelectAll } = this.props;
    onSelectAll(checked, R.map(R.prop(''), this.table.getResolvedState().sortedData));
  }

  static getRowStyleName(value) {
    if (value < 0) {
      return 'days-until-sla-red';
    }
    if (value === 0) {
      return 'days-until-sla-gray';
    }
    return 'tableRow';
  }

  static getCellContent(row) {
    switch (row.column.id) {
      case 'Days Until SLA':
        return (
          <div styleName={this.getRowStyleName(row.value)}>
            {`${row.value} ${Math.abs(row.value) > 1 ? 'DAYS' : 'DAY'}`}
          </div>
        );
      case 'Loan Number':
        return (
          <div styleName={this.getRowStyleName(row.original['Days Until SLA'])}>
            {this.getRowStyleName(row.original['Days Until SLA']) === 'days-until-sla-red'
              ? <img alt="alert-icon" src="/static/img/esclamation.svg" /> : null
            }
            {this.getRowStyleName(row.original['Days Until SLA']) === 'days-until-sla-gray'
              ? <img alt="alert-icon" src="/static/img/warning.svg" /> : null
            }
            {`  ${row.value}`}
          </div>
        );
      case 'assignedTo':
        return (
          <div>
            {`  ${row.value}`}
          </div>
        );
      case 'taskCheckListTemplateName':
        return (
          <div style={{ display: 'none' }}>
            {`  ${row.value}`}
          </div>
        );
      default:
        return (
          <div styleName="tableRow">
            {row.value}
          </div>
        );
    }
  }

  getFrontEndPath() {
    return RouteAccess.hasFrontendChecklistAccess(this.getGroups()) ? '/frontend-checklist' : '/frontend-evaluation';
  }

  getBackendEndPath() {
    return RouteAccess.hasBackendChecklistAccess(this.getGroups()) ? '/backend-checklist' : '/backend-evaluation';
  }

  getFrontEndGroup() {
    return RouteAccess.hasFrontendChecklistAccess(this.getGroups()) ? 'feuw-task-checklist' : 'FEUW';
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
          columnObj.show = this.showColumns(columnName);
          // !(columnName === 'Assigned To' && getStagerValue === 'POSTMOD_STAGER_ALL');
          columnObj.Cell = row => this.constructor.getCellContent(row);
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
    columnObject.columns = isManualOrder ? [this.getCheckBox(data),
      ...columns] : columns;
    columnData.push(columnObject);
    return columnData;
  }

  // eslint-disable-next-line no-unused-vars
  getTrPropsType(state, rowInfo, column) {
    const { searchResponse } = this.props;
    if (rowInfo) {
      const { original } = rowInfo;
      if (original['Loan Number'] === searchResponse) {
        return {
          style: {
            background: '#e67300',
          },
        };
      }
    }
    return {};
  }

  showColumns(columnName) {
    const { getStagerValue } = this.props;
    return columnName === 'Assigned To' ? (getStagerValue === 'POSTMOD_STAGER_ALL') : true;
  }

  handleRowClick(rowInfo) {
    const { onSearchLoanWithTask } = this.props;
    const { original } = rowInfo;
    const { user } = this.props;
    const groups = user && user.groupList;
    const isAllStagerGroup = groups.includes('postmodstager', 'postmodstager-mgr', 'stager-mgr', 'stager');
    const isPostModStagerGroup = groups.includes('postmodstager', 'postmodstager-mgr');
    if (isAllStagerGroup) {
      this.setState({ isRedirect: isAllStagerGroup });
      onSearchLoanWithTask({ loanNumber: original.loanNumber, taskID: original.tkiid });
    } else {
      this.setState({ isRedirect: isPostModStagerGroup });
    }
    if (isAllStagerGroup || isPostModStagerGroup) {
      onSearchLoanWithTask({ loanNumber: original.loanNumber, taskID: original.tkiid });
    }
  }
  // 53538406

  loadSearchLoan() {
    const {
      onSelectEval, onGetGroupName, onGetChecklistHistory, history, searchLoanTaskResponse,
    } = this.props;
    if (searchLoanTaskResponse) {
      const {
        loanNumber, unAssigned, assigned,
      } = searchLoanTaskResponse;
      const data = [];
      if (unAssigned) {
        data.push(...unAssigned);
      }
      if (assigned) {
        data.push(...assigned);
      }
      const payload = { loanNumber, ...data, isSearch: true };
      const { isRedirect } = this.state;
      let group = '';
      switch (payload.taskName) {
        case 'Underwriting':
          group = 'BEUW';
          this.redirectPath = this.getBackendEndPath();
          break;
        case 'Processing':
          group = 'PROC';
          this.redirectPath = '/doc-processor';
          break;
        case 'Trial Modification':
        case 'Forbearance':
          group = 'LA';
          this.redirectPath = this.getLoanActivityPath();
          break;
        case 'Document Generation':
          group = 'DOCGEN';
          this.redirectPath = '/doc-gen';
          break;
        case 'Docs In':
          group = 'DOCSIN';
          this.redirectPath = '/docs-in';
          break;
        default:
          this.redirectPath = this.getFrontEndPath();
          group = this.getFrontEndGroup();
      }
      if (isRedirect) {
        onGetGroupName(group);
        onSelectEval(payload);
        onGetChecklistHistory(payload.taskId);
        history.push(this.redirectPath);
      }
    }
  }

  render() {
    const { data, searchLoanTaskResponse } = this.props;
    if (!R.isEmpty(searchLoanTaskResponse)) {
      this.loadSearchLoan();
    }
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
            // getTrProps={(state, rowInfo, column) => this.getTrPropsType(state, rowInfo, column)}
            getTrProps={(state, rowInfo, column) => ({
              onLoad: () => {
                this.getTrPropsType(state, rowInfo, column);
              },
              onClick: () => {
                this.handleRowClick(rowInfo);
              },
            })}
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
  onSearchLoanWithTask: operations.onSearchLoanWithTask(dispatch),
  onGetChecklistHistory: checkListOperations.fetchHistoricalChecklistData(dispatch),
});

const mapStateToProps = state => ({
  user: loginSelectors.getUser(state),
  searchLoanTaskResponse: selectors.searchLoanTaskResponse(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
});

CustomReactTable.propTypes = {
  data: PropTypes.node,
  // history: PropTypes.arrayOf(PropTypes.string).isRequired,
  getStagerValue: PropTypes.string.isRequired,
  history: PropTypes.shape({
    length: PropTypes.number.isRequired,
    location: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onGetChecklistHistory: PropTypes.func.isRequired,
  onGetGroupName: PropTypes.func.isRequired,
  onSearchLoanWithTask: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onSelectEval: PropTypes.func.isRequired,
  searchLoanTaskResponse: PropTypes.arrayOf(PropTypes.shape({
    loanNumber: PropTypes.string.isRequired,
    valid: PropTypes.bool,
  })).isRequired,
  searchResponse: PropTypes.node.isRequired,
  selectedData: PropTypes.node.isRequired,
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
