import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';

import {
  Popover,
  Button,
  Grid,
  Typography,
  FormControl,
  Divider,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
} from '@material-ui/core';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import './FilterPopover.css';
import {
  selectors as documentChecklistSelectors,
  operations as documentChecklistOperations,
} from 'ducks/document-checklist';

const dateFormatter = date => (moment(date).format('MM/DD/YYYY'));

function FilterPopover(props) {
  const {
    filterAnchorEl,
    handleFilterClose,
    handleFilterClear,
    isFilterOpen,
    popoverId,
    handleFilterApply,
    filterStartDate,
    filterEndDate,
    filterDocCategory,
    filenetDocCat,
    setFilterStartDate,
    setFilterEndDate,
    setFilterDocCategory,
  } = props;
  const [error, setError] = useState('');

  useEffect(() => {
    if (filterStartDate && filterEndDate) {
      setError('');
    } else if (filterStartDate) {
      setError('endDate');
    } else if (filterEndDate) {
      setError('startDate');
    } else {
      setError('');
    }
  }, [filterStartDate, filterEndDate]);

  return (
    <div>
      <Popover
        anchorEl={filterAnchorEl || null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        id={popoverId}
        onClose={() => handleFilterClose()}
        open={isFilterOpen}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div
          style={{
            border: '1px solid #4e586e',
            borderRadius: '5px',
          }}
        >
          <div styleName="filter-pop-main-container">
            <Grid container>
              <Grid item xs={4}>
                <Typography styleName="filter-pop-grid-item-typo">
                Filter
                </Typography>
              </Grid>
              <Grid item style={{ display: 'flex', justifyContent: 'end' }} xs={4}>
                <Button
                  onClick={handleFilterClear}
                  styleName="filter-pop-grid-clear-button"
                  variant="contained"
                >
                Clear
                </Button>
              </Grid>
              <Grid item style={{ display: 'flex', justifyContent: 'end' }} xs={4}>
                <Button
                  disabled={error !== ''}
                  onClick={handleFilterApply}
                  styleName={error
                    ? 'filter-pop-grid-apply-button-disabled'
                    : 'filter-pop-grid-apply-button-active'}
                  variant="contained"
                >
                Apply
                </Button>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography styleName="filter-pop-grid-from-to-date">
                From Date
                </Typography>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    autoOk
                    emptyLabel="MM/DD/YYYY"
                    format="MM/DD/YYYY"
                    InputProps={{
                      style: {
                        fontSize: '10px', padding: '0px', height: '20px', width: '50%', color: error === 'startDate' ? 'red' : '',
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            style={{ padding: '0px' }}
                          >
                            <img alt="date picker" src="/static/img/datePicker.png" style={{ width: '20px' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    inputVariant="outlined"
                    maxDate={filterEndDate || new Date()}
                    name="filterStartDate"
                    onChange={value => setFilterStartDate(dateFormatter(value))}
                    style={{ padding: '0px' }}
                    value={filterStartDate}
                    variant="inline"
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid item xs={6}>
                <Typography styleName="filter-pop-grid-from-to-date">
                To Date
                </Typography>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <DatePicker
                    autoOk
                    emptyLabel="MM/DD/YYYY"
                    format="MM/DD/YYYY"
                    InputProps={{
                      style: {
                        fontSize: '10px', padding: '0px', height: '20px', width: '50%', color: error === 'endDate' ? 'red' : '',
                      },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            style={{ padding: '0px' }}
                          >
                            <img alt="date picker" src="/static/img/datePicker.png" style={{ width: '20px' }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    inputVariant="outlined"
                    maxDate={new Date()}
                    minDate={filterStartDate || ''}
                    name="filterEndDate"
                    onChange={value => setFilterEndDate(dateFormatter(value))}
                    style={{ padding: '0px' }}
                    value={filterEndDate}
                    variant="inline"
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
          </div>
          <Divider />
          <Grid container style={{ padding: '10px', width: '100%' }}>
            <Grid item>
              <Typography styleName="filter-pop-grid-item-category">
              Document Category
              </Typography>
            </Grid>
            <Grid item style={{ width: '145px' }} xs="12">
              <FormControl style={{ width: '100%' }}>
                <Select
                  disableUnderline
                  displayEmpty
                  onChange={e => setFilterDocCategory(e.target.value)}
                  styleName="filter-category-dropdown"
                  value={filterDocCategory}
                  variant="standard"
                >
                  <MenuItem disabled value="">
                        Select Category
                  </MenuItem>
                  {
                  filenetDocCat.map(type => (
                    <MenuItem key={type.classCodeId} value={type.shortDescription}>
                      {type.shortDescription}
                    </MenuItem>
                  ))
                }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </div>

      </Popover>
    </div>
  );
}

FilterPopover.propTypes = {
  filenetDocCat: PropTypes.arrayOf().isRequired,
  filterAnchorEl: PropTypes.string.isRequired,
  filterDocCategory: PropTypes.string.isRequired,
  filterEndDate: PropTypes.instanceOf(Date).isRequired,
  filterStartDate: PropTypes.instanceOf(Date).isRequired,
  handleFilterApply: PropTypes.func.isRequired,
  handleFilterClear: PropTypes.func.isRequired,
  handleFilterClose: PropTypes.func.isRequired,
  isFilterOpen: PropTypes.bool.isRequired,
  popoverId: PropTypes.string.isRequired,
  setFilterDocCategory: PropTypes.func.isRequired,
  setFilterEndDate: PropTypes.func.isRequired,
  setFilterStartDate: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  filterStartDate: documentChecklistSelectors.getFilterStartDate(state),
  filterEndDate: documentChecklistSelectors.getFilterEndDate(state),
  filterDocCategory: documentChecklistSelectors.getFilterDocCategory(state),
  filenetDocCat: documentChecklistSelectors.getFilenetDocCategory(state),
});

const mapDispatchToProps = dispatch => ({
  setFilterStartDate: documentChecklistOperations.setFilterStartDateOperation(dispatch),
  setFilterEndDate: documentChecklistOperations.setFilterEndDateOperation(dispatch),
  setFilterDocCategory: documentChecklistOperations.setFilterDocCategoryOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(FilterPopover);
