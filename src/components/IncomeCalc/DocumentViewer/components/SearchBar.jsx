import React from 'react';
import * as PropTypes from 'prop-types';

import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import './SearchBar.css';

const SearchBar = (props) => {
  const {
    handleSearchChange,
    searchText,
    isFilterApplied,
    handleFilter,
  } = props;
  return (
    <>
      <Grid container style={{ paddingBottom: '0.938rem' }}>
        <Grid
          item
          xs={10}
        >
          <TextField
            InputProps={{
              style: {
                fontSize: '0.75rem',
                color: '#939299',
                width: '23rem !important',
              },
              disableUnderline: true,
              startAdornment: <SearchIcon />,
              endAdornment: searchText ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear search"
                    onClick={() => handleSearchChange('')}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            onChange={event => handleSearchChange(event.target.value)}
            placeholder="Search Document"
            value={searchText}
          />
        </Grid>
        <Grid item styleName="filterContainer" xs={2}>
          <div>
            <IconButton
              onClick={handleFilter}
              styleName="searchIcon"
            >
              <img alt="filter icon" src="/static/img/filter.svg" />
              {isFilterApplied && (
              <div styleName="filterIndicator" />
              )}
            </IconButton>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

SearchBar.propTypes = {
  handleFilter: PropTypes.func.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  isFilterApplied: PropTypes.bool.isRequired,
  searchText: PropTypes.string.isRequired,
};

export default SearchBar;
