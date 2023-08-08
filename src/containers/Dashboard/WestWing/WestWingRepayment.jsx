import React from 'react';
import PropTypes from 'prop-types';
import './WestWingCenterSection.css';
import {
  Grid,
} from '@material-ui/core';

function WestWingRepayment(props) {
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
          <Grid container direction="column" spacing={1} styleName="evalDetailContainerRepay">
            {renderItems('repayment')}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

WestWingRepayment.propTypes = {
  data: PropTypes.shape().isRequired,
};

export default WestWingRepayment;
