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

   openWindowWithPost = (url, data) => {
     const form = document.createElement('form');
     form.target = '_blank';
     form.method = 'post';
     form.action = url;
     form.style.display = 'none';

     Object.keys(data).forEach((key) => {
       if (key) {
         const input = document.createElement('input');
         input.type = 'hidden';
         input.name = key;
         input.value = data[key];
         form.appendChild(input);
       }
     });

     document.body.appendChild(form);
     form.submit();
     document.body.removeChild(form);
   }

  handleExportChecklist = () => {
    const { pdfGeneratorConstant, taskAuditRuleMapping, pdfExportPayload } = this.props;
    const data = {
      event: pdfExportPayload.event,
      disposition: !pdfExportPayload.disposition ? 'null' : pdfExportPayload.disposition,
      assignedTo: pdfExportPayload.assignedTo,
      dispositionDate: pdfExportPayload.dispositionDate,
      resolutionId: pdfExportPayload.resolutionId,
      auditRuleType: R.contains('Post', pdfExportPayload.auditRuleType) ? 'post' : 'pre',
      taskAuditRuleMapping: JSON.stringify(taskAuditRuleMapping),
    };
    this.openWindowWithPost(`${pdfGeneratorConstant}/api/download/${pdfExportPayload.checklistId}`, data);
  };

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
  pdfExportPayload: PropTypes.shape.isRequired,
  pdfGeneratorConstant: PropTypes.string.isRequired,
  taskAuditRuleMapping: PropTypes.shape.isRequired,
  toolTipPosition: PropTypes.string,
};

export default withStyles(styles)(ExportCurrentChecklist);
