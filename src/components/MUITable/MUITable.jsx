import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import * as R from 'ramda';
import './MUITable.css';

function MUITable(props) {
  const { columns, data } = props;

  const processData = () => data && data.map((item) => {
    let newObject = {};
    columns.forEach(
      (obj) => {
        newObject = R.assoc(
          obj.name,
          obj.cellFormat ? obj.cellFormat(item[obj.name]) : item[obj.name],
          newObject,
        );
        return newObject;
      },
    );
    return newObject;
  });

  const [currentTableFilter, setCurrentTableFilter] = React.useState({
    initialData: processData(),
    filteredData: processData(),
    columnFilterIndex: R.pluck(
      'name',
      R.filter(R.allPass([R.pathEq(['options', 'filter'], true)]))(columns),
    ),
  });

  useEffect(() => {
    let newState = {};
    columns.forEach((item) => {
      if (item.options !== undefined && item.options.filter) {
        newState = R.assocPath(['filters', item.name], [], newState);
        newState[`${item.name}Filter`] = null;
        newState[`${item.name}Checkbox`] = {};
        R.without(['', null], R.uniq(R.pluck([item.name], currentTableFilter.initialData))).forEach(
          (value) => { newState[`${item.name}Checkbox`][value] = Boolean(false); },
        );
      }
    });

    setCurrentTableFilter({
      ...newState,
      ...currentTableFilter,
    });
  }, []);

  const handleFilterCheckbox = (event, stateRef, dropdownValue) => {
    const filterClone = currentTableFilter.filters;
    const checkState = `${stateRef}Checkbox`;
    const checkValue = dropdownValue || event.target.value;
    const checkboxBoolSwitch = event.target.checked !== undefined
      ? Boolean(event.target.checked)
      : !currentTableFilter[checkState][checkValue];
    if (
      currentTableFilter[checkState]
      && currentTableFilter[checkState][checkValue] !== undefined
    ) {
      if (event.target.checked !== undefined && !dropdownValue) {
        setCurrentTableFilter(prevState => ({
          ...prevState,
          [checkState]: {
            ...prevState[checkState],
            [checkValue]: checkboxBoolSwitch,
          },
        }));
      } else {
        setCurrentTableFilter(prevState => ({
          ...prevState,
          [checkState]: {
            ...prevState[checkState],
            [checkValue]: checkboxBoolSwitch,
          },
        }));
      }
    }

    if (currentTableFilter.filters[stateRef]) {
      const arrayState = [...currentTableFilter.filters[stateRef]];
      const index = arrayState.indexOf(checkValue);
      if (index !== -1 && !checkboxBoolSwitch) {
        const filteredArray = arrayState.filter(item => item !== checkValue);
        filterClone[stateRef] = filteredArray;
      } else if (index === -1 && checkboxBoolSwitch) {
        filterClone[stateRef].push(checkValue);
      }
    }

    setCurrentTableFilter(prevState => ({
      ...prevState,
      filters: filterClone,
    }));

    // USE INITIAL DATA FOR FILTERING includes ramda
    let resetFilter = true;
    let initialDataClone = currentTableFilter.initialData;
    currentTableFilter.columnFilterIndex.forEach((item) => {
      if (R.length(currentTableFilter.filters[item]) > 0) {
        initialDataClone = R.innerJoin(
          (initialDataObject, tableFilters) => initialDataObject[item] === tableFilters,
          initialDataClone,
          filterClone[item],
        );
        setCurrentTableFilter(prevState => ({
          ...prevState,
          filteredData: initialDataClone,
        }));
        if (resetFilter) {
          resetFilter = false;
        }
      }
    });

    // RESET TABLE FILTERS IF NO OPTIONS ARE CHOSEN
    if (resetFilter) {
      setCurrentTableFilter(prevState => ({
        ...prevState,
        filteredData: currentTableFilter.initialData,
      }));
    }
  };

  const handleClick = (event, stateRef) => {
    setCurrentTableFilter(prevState => ({
      ...prevState,
      [stateRef]: event.currentTarget,
    }));
  };

  const handleCloseMenu = (event, stateRef) => {
    setCurrentTableFilter(prevState => ({
      ...prevState,
      [stateRef]: null,
    }));
  };

  const handleCheckboxFilterColorCode = (stateRef, defaultColor) => {
    if (currentTableFilter) {
      const filterArray = R.path(['filters', stateRef], currentTableFilter);
      if (!R.isEmpty(filterArray)) {
        return '#0D47A1';
      }
      if (defaultColor) {
        return defaultColor;
      }
    }
    return '#888888';
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        elevation={0}
        style={{ maxHeight: 450 }}
      >
        <Table aria-label="simple table" styleName="table-header">
          <TableHead>
            <TableRow>
              {columns.map(
                (item, i) => item && (
                <TableCell
                  key={item.name ? item.name : i}
                  align={item.align}
                  style={{
                    minWidth: item.minWidthHead ? item.minWidthHead : 100,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                >
                  {item.label}
                  {item.options
                      && item.options.filter
                      && item.options.toolTip ? (
                        <Tooltip
                          id={`${item.name}Filter`}
                          onClick={event => handleClick(event, `${item.name}Filter`)
                          }
                          title={
                            item.options.toolTip && item.options.toolTip.title
                              ? item.options.toolTip.title
                              : ''
                          }
                        >
                          <IconButton>
                            <img
                              alt="filter"
                              src="/static/img/filter.png"
                              style={{
                                color: handleCheckboxFilterColorCode(item.name,
                                  item.options.toolTip.color),
                                width: '0.75rem',
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                    ) : null}

                  {currentTableFilter.filteredData && item.name ? (
                    <Menu
                      anchorEl={
                            currentTableFilter[`${item.name}Filter`] || null
                          }
                      id={`${item.name}Filter`}
                      keepMounted
                      onClose={event => handleCloseMenu(event, `${item.name}Filter`)
                          }
                      open={Boolean(
                        currentTableFilter[`${item.name}Filter`],
                      )}
                    >
                      {R.without(
                        ['', null],
                        R.uniq(
                          R.pluck(
                            [item.name],
                            currentTableFilter.filteredData,
                          ),
                        ),
                      ).length > 0
                        ? R.without(
                          ['', null],
                          R.uniq(
                            R.pluck(
                              [item.name],
                              currentTableFilter.filteredData,
                            ),
                          ),
                        ).map(value => (
                          <div style={{ display: 'flex' }}>
                            <Checkbox
                              checked={
                                  currentTableFilter[`${item.name}Checkbox`]
                                  && currentTableFilter[`${item.name}Checkbox`][
                                    value
                                  ]
                                    ? currentTableFilter[
                                      `${item.name}Checkbox`
                                    ][value]
                                    : null
                                }
                              onClick={event => handleFilterCheckbox(event, item.name, null)
                                }
                              value={value || ''}
                            />
                            <MenuItem
                              key={`${item.name}_${value}`}
                              onClick={event => handleFilterCheckbox(event, item.name, value)
                                }
                              style={{
                                paddingLeft: 0,
                                backgroundColor: 'transparent',
                              }}
                            >
                              {value || null}
                            </MenuItem>
                          </div>
                        ))
                        : (
                          <MenuItem
                            key="No_Filters"
                            style={{
                              backgroundColor: 'transparent',
                            }}
                          >
                            No filters
                          </MenuItem>
                        )}
                    </Menu>
                  ) : null}
                </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTableFilter.filteredData.map(row => (
              <TableRow>
                {Object.entries(row).map(([key, value]) => (
                  <TableCell align="left" id={`${key}_${value}`}>
                    {value || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

MUITable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    align: PropTypes.string,
    label: PropTypes.string,
    minWidthHead: PropTypes.number,
    name: PropTypes.string,
    options: PropTypes.object,
  })).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default MUITable;
