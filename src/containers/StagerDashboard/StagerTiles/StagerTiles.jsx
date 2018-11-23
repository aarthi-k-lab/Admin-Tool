import React from 'react';
import './StagerTiles.css';
import Grid from '@material-ui/core/Grid';
import StagerDocumentStatusCard from 'components/StagerDocumentStatusCard';
import PropTypes from 'prop-types';

class StagerTiles extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const { counts, onStatusCardClick } = this.props;
    return (
      <Grid container styleName="stager-tiles-main-container">
        {counts && counts.map(stagerTaskData => (
          <Grid item xs={12}>
            <div styleName="document-status-bar">
              <span styleName="document-status-header">{stagerTaskData.displayName}</span>
            </div>
            <Grid item xs={12}>
              <Grid container direction="row" spacing={24} styleName="tiles-grid">
                {stagerTaskData.data.map(tileData => (
                  <Grid item xs={6}>
                    <StagerDocumentStatusCard data={tileData} onClick={onStatusCardClick} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
    );
  }
}

StagerTiles.propTypes = {
  counts: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(
        PropTypes.shape({
          aboutToBreach: PropTypes.number,
          displayName: PropTypes.string,
          searchTerm: PropTypes.string,
          slaBreached: PropTypes.number,
          total: PropTypes.number,
        }),
      ),
      displayName: PropTypes.string,
    }),
  ).isRequired,
  onStatusCardClick: PropTypes.func.isRequired,
};

export default StagerTiles;
