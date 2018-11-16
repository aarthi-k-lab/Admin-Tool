import React from 'react';
import './StagerTiles.css';
import Grid from '@material-ui/core/Grid';
import StagerDocumentStatusCard from 'components/StagerDocumentStatusCard';

class StagerTiles extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const documentData = {
      documentType: 'Attorney Fees',
      documents:
      [{
        documentType: 'Attorney Fees',
        status: 'toorder',
        slaBreached: true,
        slaToBeBreached: false,
      },
      {
        documentType: 'Attorney Fees',
        status: 'toorder',
        slaBreached: false,
        slaToBeBreached: true,
      },
      ],
    };
    return (
      <Grid container spacing={8}>
        <Grid item xs={12}>
          {/* SHOULD BE RENDERED DYNAMICALLY */}
          <div styleName="document-status-bar">
            <span styleName="document-status-header">TO ORDER</span>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Grid container direction="row" spacing={24} styleName="tiles-grid">
            <Grid item xs={4}>
              <StagerDocumentStatusCard data={documentData} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default StagerTiles;
