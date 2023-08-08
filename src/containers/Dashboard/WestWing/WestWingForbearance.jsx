import React from 'react';
import './WestWingCenterSection.css';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';

function WestWingForbearance(props) {
  const { data } = props;
  const renderItems = item => (
    <>
      {
            data[item] && data[item].map(({ value, title }) => (
              <Grid item styleName="item">
                <span styleName="title">{title}</span>
                <span styleName="content">
                  {
                    value === '' ? '-' : value
                  }
                </span>
              </Grid>
            ))
          }
    </>
  );
  return (
    <div>
      <Grid container>
        <Grid item styleName="evalDetails" xs={12}>
          <Grid container spacing={1} styleName="evalDetailContainer">
            {renderItems('forbreance')}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

WestWingForbearance.propTypes = {
  data: PropTypes.shape().isRequired,
};

export default WestWingForbearance;
