import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import './CustomReactTable.css';

class CustomReactTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
    this.getCheckBox = this.getCheckBox.bind(this);
  }

  getCheckBox(data) {
    const { onCheckBoxClick, onSelectAll, selectedData } = this.props;
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
        <Checkbox onChange={e => onSelectAll(e.target.checked, data)} />
      ),
      sortable: false,
      filterable: false,
      width: 50,
    };
  }

  getColumnData(stagerTaskType, stagerTaskStatus, isManualOrder, data) {
    const columnData = [];
    const columnObject = {};
    // columnObject.Header = `${stagerTaskType} - ${stagerTaskStatus}`;
    let columns = [];
    if (data && data[0]) {
      columns = R.compose(
        R.map((columnName) => {
          const columnObj = {};
          columnObj.Header = columnName.toUpperCase();
          columnObj.accessor = columnName;
          columnObj.filterMethod = (filter, row) => (row[filter.id] === filter.value);
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
        R.without(['', null]),
        R.keys(),
      )(data[0]);
    }
    columnObject.columns = isManualOrder ? [this.getCheckBox(data),
      ...columns] : columns;
    columnData.push(columnObject);
    return columnData;
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        <ReactTable
          className="-highlight"
          columns={this.getColumnData(data.stagerTaskType,
            data.stagerTaskStatus, data.isManualOrder, data.tableData)}
          data={data.tableData}
          defaultFilterMethod={(filter, row) => String(row[filter.id]).startsWith(filter.value)}
          defaultPageSize={10}
          filterable
          styleName="stagerTable"
        />
        <br />
      </div>
    );
  }
}

CustomReactTable.propTypes = {
  data: PropTypes.node.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
};

export default CustomReactTable;
