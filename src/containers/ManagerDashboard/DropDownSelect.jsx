import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

class DropDownSelect extends Component {
  constructor(props) {
    super(props);
    this.renderDropDown = this.renderDropDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { onChange } = this.props;
    onChange(event);
  }

  renderDropDown() {
    const { getDashboardItems, selectedValue } = this.props;
    return (
      <FormControl>
        <Select
          onChange={this.handleChange}
          value={selectedValue}
        >
          {getDashboardItems.map(items => (
            <MenuItem value={items.reportName}>{items.reportName}</MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  render() {
    return (
      <>
        <div>
          {this.renderDropDown()}
        </div>
      </>
    );
  }
}

DropDownSelect.defaultProps = {
  getDashboardItems: [
    {
      groupId: 'Loan #',
      reportId: '67845985',
      reportName: '',
      reportUrl: '',
    },
  ],
};

DropDownSelect.propTypes = {
  getDashboardItems: PropTypes.arrayOf(
    PropTypes.shape({
      groupId: PropTypes.string.isRequired,
      reportId: PropTypes.string.isRequired,
      reportName: PropTypes.string.isRequired,
      reportUrl: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default DropDownSelect;