import React, { useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  IconButton,
} from '@material-ui/core';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@material-ui/icons';
// import styles from './Pagination.css';

function Pagination(props) {
  const {
    paginationVal, updatePagination,
  } = props;
  const { currDocPage, noOfPages } = paginationVal;
  const numberOfPages = Array.from({ length: noOfPages }, (_, i) => i + 1);

  const [arrOfCurrPages, setArrOfcurrPages] = useState([]);

  useEffect(() => {
    let tempNumberOfPages = [...arrOfCurrPages];

    const dots = '...';

    if (numberOfPages.length < 6) {
      tempNumberOfPages = numberOfPages;
    } else if (currDocPage >= 1 && currDocPage <= 3) {
      tempNumberOfPages = [1, 2, 3, 4, 5, dots, numberOfPages.length];
    } else if (currDocPage === 4) {
      const sliced = numberOfPages.slice(0, 5);
      tempNumberOfPages = [...sliced, dots, numberOfPages.length];
    } else if (
      currDocPage > 4 && currDocPage < numberOfPages.length - 2) {
      const sliced1 = numberOfPages.slice(currDocPage - 2, currDocPage);
      const sliced2 = numberOfPages.slice(currDocPage, currDocPage + 1);
      tempNumberOfPages = [
        1,
        dots,
        ...sliced1,
        ...sliced2,
        dots,
        numberOfPages.length,
      ];
    } else if (currDocPage > numberOfPages.length - 4) { // > 7
      const sliced = numberOfPages.slice(numberOfPages.length - 5); // slice(10-4)
      tempNumberOfPages = ([1, dots, ...sliced]);
    }
    setArrOfcurrPages(tempNumberOfPages);
  }, [currDocPage, noOfPages]);

  return (
    <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
      <Grid
        item
        style={{ display: 'flex', justifyContent: 'center', pointer: 'cursor' }}
        xs={2}
      >
        <IconButton
          onClick={() => {
            // setcurrentPage(prev => (prev <= 1 ? prev : prev - 1));
            updatePagination('dec', 0);
          }
          }
        >
          <ChevronLeftOutlined />
        </IconButton>
      </Grid>
      {
        arrOfCurrPages.map(item => (item === '...'
          ? (
            <Grid
              item
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', pointer: 'cursor',
              }}
              xs={1}
            >
              <Typography>
              ....
              </Typography>
            </Grid>
          )
          : (
            <Grid
              item
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', pointer: 'cursor',
              }}
              xs={1}
            >
              <Typography
                onClick={() => {
                  // setcurrentPage(item);
                  updatePagination('', item);
                }}
                style={currDocPage === item ? {
                  display: 'flex',
                  justifyContent: 'center',
                  background: '#596FEB',
                  width: '20px',
                  borderRadius: '3px',
                  color: '#FFFF',
                  text: 'Lato',
                }
                  : {
                    display: 'flex',
                    justifyContent: 'center',
                    color: '#4E586E',
                    width: '20px',
                    borderRadius: '3px',
                    text: 'Lato',
                  }}
              >
                {item}
              </Typography>
            </Grid>

          )
        ))}
      <Grid
        item
        style={{ display: 'flex', justifyContent: 'center', pointer: 'cursor' }}
        xs={2}
      >
        <IconButton
          // className={currDocPage === 1 ? styles.disabled : ''}
          onClick={() => {
            // setcurrentPage(prev => (prev >= numberOfPages.length ? prev : prev + 1));
            updatePagination('inc', 0);
          }
            }
        >
          <ChevronRightOutlined />
        </IconButton>
      </Grid>
    </Grid>
  );
}

Pagination.propTypes = {
  currDocPage: PropTypes.number.isRequired,
  // pages: PropTypes.string.isRequired,
  paginationVal: PropTypes.number.isRequired,
  // setPaginationVal: PropTypes.func.isRequired,
  updatePagination: PropTypes.func.isRequired,
};

export default Pagination;
