import React from 'react';
import PropTypes from 'prop-types';
import './StagerDocumentStatusCard.css';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import * as R from 'ramda';

const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}K` : num);

const StagerDocumentStatusCard = ({
  active, data, onStatusCardClick, tabName,
}) => {
  const slaBreachedCount = data.slaBreached;
  const slaToBeBreachedCount = data.aboutToBreach;
  return (
    <Paper onClick={() => onStatusCardClick(data.searchTerm, data.displayName, tabName)} styleName={active ? 'document-type-card-main-div-active' : 'document-type-card-main-div'}>
      <Grid container direction="column" spacing={8}>
        <Grid item>
          <span styleName={active ? 'document-type-name-selected' : 'document-type-name'}>
            {data.displayName}
          </span>
        </Grid>
        <Grid item>
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <span styleName={active ? 'document-type-count-selected' : 'document-type-count'}>
                {
                  (data.total < 10 ? `0${data.total}` : `${kFormatter(data.total)}`)
                }
              </span>
            </Grid>
            <Grid item styleName="info-items" xs={8}>
              { !R.isNil(slaBreachedCount)
                ? (
                  <span styleName={slaBreachedCount ? 'sla-breached-chip info-chip' : 'info-chip info-chip-0-count'}>
                    {`${(`0${slaBreachedCount}`).slice(-2)} SLA BREACHED`}
                  </span>
                ) : null }
              <div styleName="line_break" />
              { !R.isNil(slaToBeBreachedCount)
                ? (
                  <span styleName={slaToBeBreachedCount ? 'info-chip' : 'info-chip info-chip-0-count'}>
                    {`${(`0${slaToBeBreachedCount}`).slice(-2)} SLA ABOUT TO BREACH`}
                  </span>
                ) : null }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

const TestExports = {
  StagerDocumentStatusCard,
};

StagerDocumentStatusCard.defaultProps = {
  active: false,
  data: {},
};
StagerDocumentStatusCard.propTypes = {
  active: PropTypes.bool,
  data: PropTypes.node,
  onStatusCardClick: PropTypes.func.isRequired,
  tabName: PropTypes.func.isRequired,
};

export default StagerDocumentStatusCard;
export { TestExports };
