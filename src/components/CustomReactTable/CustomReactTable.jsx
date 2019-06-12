import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import * as R from 'ramda';
import DashboardModel from 'models/Dashboard';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import './CustomReactTable.css';

class CustomReactTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getCheckBox = this.getCheckBox.bind(this);
    this.paginationLoad = this.paginationLoad.bind(this);
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
      default:
        return (
          <div styleName="tableRow">
            {row.value}
          </div>
        );
    }
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
          />
        );
      },
      Header: () => (
        <Checkbox onChange={e => this.onSelectAllOption(e.target.checked)} />
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
          columnObj.minWidth = 150;
          columnObj.accessor = columnName;
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
            </select>);
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

  paginationLoad(action) {
    const {
      triggerStagerPageCount,
      getDashboardData,
      getActiveSearchTerm,
      getStagerValue,
      getStagerPageCount,
    } = this.props;
    const stagerTablePageCount = DashboardModel.STAGER_TABLE_PAGE_COUNT;
    let { PageCount } = getStagerPageCount;
    let Pages = getStagerPageCount.pageNo;
    if (action === 'back') {
      PageCount -= stagerTablePageCount;
      Pages -= 1;
    } else {
      PageCount += stagerTablePageCount;
      Pages += 1;
    }
    const payload = {
      activeSearchTerm: getActiveSearchTerm,
      stager: getStagerValue,
    };
    const stagerPayload = {
      PageCount,
      pageNo: Pages,
      maxFetchCount: stagerTablePageCount,
      pageSize: getStagerPageCount.pageSize,
    };
    triggerStagerPageCount(stagerPayload);
    getDashboardData(payload);
  }

  render() {
    const {
      tableData,
      getStagerPageCount,
    } = this.props;
    const returnVal = tableData ? (
      <div styleName="stager-table-container">
        <div styleName="stager-table-height-limiter">
          <ReactTable
            ref={(reactTable) => {
              this.table = reactTable;
            }}
            className="-highlight"
            columns={this.getColumnData(tableData.stagerTaskType,
              tableData.stagerTaskStatus, tableData.isManualOrder, tableData.tableData)}
            data={tableData.tableData}
            defaultPageSize={10}
            defaultSorted={tableData.defaultSorted ? [
              {
                id: tableData.defaultSorted,
                asc: true,
              },
            ] : []}
            filterable
            showPagination={false}
            styleName="stagerTable"
          />
          <br />
          <div styleName="pageCountDetails">
            {`${getStagerPageCount.pageNo} / ${getStagerPageCount.pageSize}`}
          </div>
          <MobileStepper
            activeStep={1}
            backButton={(
              <Button disabled={getStagerPageCount.pageNo === 1} onClick={() => this.paginationLoad('back')} styleName="pagination-btn">
                <KeyboardArrowLeft />
                Previous
              </Button>
            )}
            nextButton={(
              <Button disabled={getStagerPageCount.pageNo === getStagerPageCount.pageSize} onClick={() => this.paginationLoad('next')} styleName="pagination-btn">
                Next
                <KeyboardArrowRight />
              </Button>
            )}
            position="static"
            steps={getStagerPageCount.pageSize}
            variant="text"
          >
            Test
          </MobileStepper>
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
  tableData: [],
  getStagerPageCount: [],
};
CustomReactTable.propTypes = {
  getActiveSearchTerm: PropTypes.string.isRequired,
  getDashboardData: PropTypes.func.isRequired,
  getStagerPageCount: PropTypes.node,
  getStagerValue: PropTypes.string.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
  tableData: PropTypes.node,
  triggerStagerPageCount: PropTypes.func.isRequired,

};

const mapDispatchToProps = dispatch => ({
  getDashboardData: stagerOperations.getDashboardData(dispatch),
  triggerStagerPageCount: stagerOperations.triggerStagerPageCount(dispatch),
});

const mapStateToProps = state => ({
  getStagerValue: stagerSelectors.getStagerValue(state),
  getActiveSearchTerm: stagerSelectors.getActiveSearchTerm(state),
  tableData: stagerSelectors.getTableData(state),
  getStagerPageCount: stagerSelectors.getStagerPageCount(state),

});
export default connect(mapStateToProps, mapDispatchToProps)(CustomReactTable);
export { TestExports };
