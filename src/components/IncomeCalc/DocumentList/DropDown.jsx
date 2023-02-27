import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export default function DropDown({ title, onDropdownChange }) {
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  return (
    <>
      <Typography>Doc Review Status</Typography>
      <Button
        endIcon={<Icon>arrow_drop_down</Icon>}
        onClick={this.handleClick(index)}
      >
        {documentReviewStatus || 'Select'}
      </Button>
      <Menu
        anchorEl={R.propOr(null, index, anchorEl)}
        id={index}
        keepMounted
        onClose={this.handleClose(index)}
        open={Boolean(R.propOr(null, index, anchorEl))}
      >
        <MenuItem onClick={this.handleMenuClick(index)}>Not Provided</MenuItem>
        <MenuItem onClick={this.handleMenuClick(index)}>Not Reviewed</MenuItem>
        <MenuItem onClick={this.handleMenuClick(index)}>Defects</MenuItem>
        <MenuItem onClick={this.handleMenuClick(index)}>Validated</MenuItem>
        <MenuItem onClick={this.handleMenuClick(index)}>UW Confirmed</MenuItem>
      </Menu>
    </>
  );
}

DropDown.defaultProps = {
  date: null,
};

DropDown.propTypes = {
  date: PropTypes.string,
  onDateChange: PropTypes.func.isRequired,
};
