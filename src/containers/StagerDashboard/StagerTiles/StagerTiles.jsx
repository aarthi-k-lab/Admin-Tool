import React from 'react';
import './StagerTiles.css';
import Grid from '@material-ui/core/Grid';
import StagerDocumentStatusCard from 'components/StagerDocumentStatusCard';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';

class StagerTiles extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { };
  }

  isActiveCard(tileName, tabName) {
    const { activeTab, activeTile } = this.props;
    if (tileName === activeTile && tabName === activeTab) {
      return true;
    }
    return false;
  }

  render() {
    const { counts, onStatusCardClick } = this.props;
    return (
      <Grid container styleName="stager-tiles-main-container">
        {
          !counts.length ? <Loader /> : null
        }
        {counts && counts.map(stagerTaskData => (
          <Grid item xs={12}>
            <div styleName="document-status-bar">
              <span styleName="document-status-header">{stagerTaskData.displayName}</span>
            </div>
            <Grid item xs={12}>
              <Grid container direction="row" spacing={24} styleName="tiles-grid">
                {stagerTaskData.data.map(tileData => (
                  <Grid item xs={6}>
                    <StagerDocumentStatusCard
                      active={this.isActiveCard(tileData.displayName, stagerTaskData.displayName)}
                      data={tileData}
                      onStatusCardClick={onStatusCardClick}
                      tabName={stagerTaskData.displayName}
                    />
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
  activeTab: PropTypes.string.isRequired,
  activeTile: PropTypes.string.isRequired,
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
