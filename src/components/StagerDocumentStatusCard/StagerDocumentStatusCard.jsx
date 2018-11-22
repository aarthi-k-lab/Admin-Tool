import React from 'react';
import PropTypes from 'prop-types';
import './StagerDocumentStatusCard.css';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import * as R from 'ramda';

const StagerDocumentStatusCard = ({ data }) => {
  const slaBreachedCount = R.length(data.documents.filter(d => d.slaBreached));
  const slaToBeBreachedCount = R.length(data.documents.filter(d => d.slaToBeBreached));
  return (
    <Paper styleName="document-type-card-main-div">
      <Grid container direction="column" spacing={24}>
        <Grid item>
          <span styleName="document-type-name">
            {data.documentType && data.documentType.toUpperCase()}
          </span>
        </Grid>
        <Grid item>
          <Grid container spacing={12}>
            <Grid item xs={6}>
              <span styleName="document-type-count">
                {
                  (`0${data.documents.length}`).slice(-2)
                }
              </span>
            </Grid>
            <Grid item styleName="info-items" xs={6}>
              <span styleName={slaBreachedCount ? 'sla-breached-chip info-chip' : 'info-chip info-chip-0-count'}>
                {`${(`0${slaBreachedCount}`).slice(-2)} SLA BREACHED`}
              </span>
              <br />
              <span styleName={slaToBeBreachedCount ? 'info-chip' : 'info-chip info-chip-0-count'}>
                {`${(`0${slaToBeBreachedCount}`).slice(-2)} SLA ABOUT TO BREACH`}
              </span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

StagerDocumentStatusCard.defaultProps = {
  data: {},
};
StagerDocumentStatusCard.propTypes = {
  data: PropTypes.node,
};

export default StagerDocumentStatusCard;
