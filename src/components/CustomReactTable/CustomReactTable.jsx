import React from 'react';
import ReactTable from 'react-table';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import './CustomReactTable.css';

class CustomReactTable extends React.PureComponent {
  static getColumnData(stagerTaskType, stagerTaskStatus, data) {
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
        R.without(['', null, '_id']),
        R.keys(),
      )(data[0]);
    }
    columnObject.columns = columns;
    columnData.push(columnObject);
    return columnData;
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        <ReactTable
          className="-highlight"
          columns={this.constructor.getColumnData(data.stagerTaskType,
            data.stagerTaskStatus, data.tableData)}
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
};

export default CustomReactTable;
