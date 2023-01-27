/* eslint-disable */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import * as R from 'ramda';

import './TombstoneCollapse.css';
import { getDate, getMonth, getYear, isToday } from '../../../lib/DateUtils';
function TombstoneCollapse({ limit, data }) {

  const [isCollapsed, setIsCollapsed] = useState(false);

  data.sort( 
    (a,b)=> {
        const aDate = new Date(a.addedDate.toString());
        const bDate = new Date(b.addedDate.toString());
        return bDate.getTime()-aDate.getTime();
    }
 );


  const mapper = (record) => {
    const { loanBalance, addedDate } = record;
    const date = getDate(addedDate);
    const month = getMonth(addedDate);
    const year = getYear(addedDate);
    const finalAddedDate = `${date}/${month}/${year}`;
    return (
      <>
        <Grid item xs={4}></Grid>
        <Grid item xs={3}><Typography styleName='collapse-text'>{`$${loanBalance}`}</Typography></Grid>
        <Grid item xs={5}>
          <Typography styleName='collapse-date'>{ isToday(addedDate) ?
        'Added today' :
        `Added on ${finalAddedDate}`
        }</Typography>
        </Grid>
      </>
    );
  };

  const buildData = () => {
    return isCollapsed ? data.map(mapper) : data.slice(0, limit).map(mapper);
  };

  return (
    !R.isEmpty(data) ? <Grid container>
      <Grid item xs={12}>
        <Box styleName={isCollapsed ? 'collapse-expand-box' : 'collapse-box'}>
          <Grid container>{buildData()}</Grid>
        </Box>
      </Grid>
      {limit < data.length ?
        <>
          <Grid item xs={8}></Grid>
          <Grid alignItems="center" item xs={4}>
          <Button onClick={() => setIsCollapsed(prev => !prev)} size="small" styleName={isCollapsed ? "show-less-button" : "show-all-button"} variant="text">{isCollapsed ? 'SHOW LESS' : 'SHOW ALL'}</Button>
          </Grid>
        </> : <></>}
    </Grid> : <></>
  );
}

TombstoneCollapse.defaultProps = {
  limit: 5,
  data: [],
};

TombstoneCollapse.propTypes = {
  limit: PropTypes.number,
  data: PropTypes.shape(),
};

export { TombstoneCollapse };

export default TombstoneCollapse;