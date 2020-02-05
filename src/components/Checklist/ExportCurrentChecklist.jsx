import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import ImportExportIcon from '@material-ui/icons/ImportExport';

import moment from 'moment-timezone';
import * as R from 'ramda';


const styles = theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  custom: {
    color: 'black',
    backgroundColor: 'var(--grey-300)',
    borderRadius: '0.15rem',
    minHeight: '25px',
    width: '30px',
    height: '0px',
    '&:hover': {
      backgroundColor: 'var(--grey-300)',
    },
  },
});

class ExportCurrentChecklist extends Component {
  getCSTDateTime = dateTime => (R.isNil(dateTime) ? 'N/A' : moment.utc(dateTime).tz('America/Chicago').format('YYYY-MM-DD HH:mm:ss'));

  handleExportChecklist = () => {
    const { pdfGeneratorConstant } = this.props;
    window.open(`${pdfGeneratorConstant}/api/download/5e1346943cd9eb0442d8b8b7?event= BATv1.8&disposition=null&assignedTo= Rumki.Mitra@mrcooper.com&dispositionDate=${this.getCSTDateTime('2020-01-06T14:39:17.024+0000')}`);
  }

  render() {
    const {
      margin, toolTipPosition, classes,
    } = this.props;
    return (
      <>
        <Tooltip aria-label="Export Current Checklist" placement={toolTipPosition} title="Export Current Checklist">
          <Fab
            aria-label="Export Checklist"
            className={classes.custom}
            color="secondary"
            onClick={this.handleExportChecklist}
            style={margin}
          >
            <ImportExportIcon />
          </Fab>
        </Tooltip>
      </>
    );
  }
}

ExportCurrentChecklist.defaultProps = {
  margin: {
    'margin-left': '3rem',
  },
  toolTipPosition: 'bottom',
  classes: {},
};

ExportCurrentChecklist.propTypes = {
  classes: PropTypes.shape({
    custom: PropTypes.string,
  }),
  margin: PropTypes.shape({
    marginTop: PropTypes.string,
  }),
  pdfGeneratorConstant: PropTypes.string.isRequired,
  toolTipPosition: PropTypes.string,
};

export default withStyles(styles)(ExportCurrentChecklist);
