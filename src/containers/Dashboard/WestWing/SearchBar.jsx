import React from 'react';
import {
  Grid,
  TextField,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const SearchBar = () => (
  <>
    <Grid container style={{ paddingBottom: '0.938rem', width: '19.5rem' }}>
      <Grid
        item
        xs={10}
      >
        <TextField
          InputProps={{
            style: {
              fontSize: '0.75rem',
              color: '#939299',
              width: '5rem !important',
              background: 'white',
              borderRadius: '10px',
              paddingLeft: '10px',
              paddingRight: '10px',
            },
            disableUnderline: true,
            endAdornment: <SearchIcon />,
          }}
          onChange={() => {}}
          placeholder="Search"
          value=""
        />
      </Grid>
    </Grid>
  </>
);

export default SearchBar;
