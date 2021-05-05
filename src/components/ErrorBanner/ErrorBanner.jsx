import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import WarningTwoToneIcon from '@material-ui/icons/WarningRounded';
import ErrorIcon from '@material-ui/icons/FiberManualRecord';
import * as R from 'ramda';
import Grid from '@material-ui/core/Grid';
import './ErrorBanner.css';

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const getAccordionSummary = color => withStyles({
  root: {
    backgroundColor: color,
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 25,
    height: '3.5rem',
    '&$expanded': {
      minHeight: 42,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const ErrorBanner = ({ errorBanner }) => {
  const [expanded, setExpanded] = React.useState();
  const errors = R.pathOr([], [1], errorBanner);
  const warnings = R.pathOr([], [2], errorBanner);
  const errorBlock = (errs, type) => (
    errs.map(err => (
      <>
        <Grid container direction="row" style={{ margin: '1rem 1rem 2rem 1rem' }}>
          <Grid item>
            <span><ErrorIcon styleName={type === 'errors' ? 'error' : 'warning'} /></span>
          </Grid>
          <Grid item>
            <Grid container direction="column">
              <Grid item style={{ marginBottom: '0.7rem' }}>
                {err.path.join('>>')}
              </Grid>
              <Grid item>
                {err.messages.join('\n')}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    ))
  );
  const handleChange = panel => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  let color = '#45c768';
  if (!R.isEmpty(warnings)) {
    color = 'rgb(235, 143, 51)';
  }
  if (!R.isEmpty(errors)) {
    color = 'rgb(231, 61, 91)';
  }
  const AccordionSummary = getAccordionSummary(color);
  return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} square>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Grid container>
            <Grid item style={{ display: 'flex', alignItems: 'center' }} xs={10}>
              <WarningTwoToneIcon style={{ fill: 'white' }} />
              <p style={{ color: 'white', marginLeft: '1rem' }}>
                {`${errors.length} Errors & ${warnings.length} Warnings found. Please do fix all the errors to proceed`}
              </p>
            </Grid>
            <Grid item xs={2}><p style={{ color: 'white' }}>{expanded === 'panel1' ? 'HIDE DETAILS' : 'VIEW DETAILS'}</p></Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails style={{
          backgroundColor: 'rgb(51, 57, 64)', width: '100%', position: 'absolute', zIndex: '2', maxHeight: '192px', overflowY: 'scroll',
        }}
        >
          <Grid container direction="row">
            <Grid item style={{ width: '100%' }}>
              {R.has('errors', errorBanner) && <span styleName="err">Error(s)</span>}
              <div styleName="errMsg">{errorBlock(errors, 'errors')}</div>
            </Grid>
            <Grid item>
              {R.has('warnings', errorBanner) && <span styleName="err">Warning(s)</span>}
              <div styleName="errMsg">{errorBlock(warnings, 'warnings')}</div>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

ErrorBanner.propTypes = {
  errorBanner: PropTypes.shape({
    errors: PropTypes.array,
    warnings: PropTypes.array,
  }).isRequired,
};

export default ErrorBanner;
