import React from 'react';
import './StagerTiles.css';
import Grid from '@material-ui/core/Grid';
import StagerDocumentStatusCard from 'components/StagerDocumentStatusCard';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import * as R from 'ramda';

class StagerTiles extends React.PureComponent {
  isActiveCard(tileName, tabName) {
    const { activeTab, activeTile } = this.props;
    if (tileName === activeTile && tabName === activeTab) {
      return true;
    }
    return false;
  }

  render() {
    const { counts, onStatusCardClick } = this.props;
    const countsData = R.sort(R.descend(R.prop('displayName')), counts);
    return (
      <>
        <Grid container styleName="stager-tiles-main-container" xs={12}>
          {!countsData.length ? <Loader /> : null}
          {countsData.map(stagerTaskGroupData => (
            <>
              <Grid item styleName="taskStatusTitle" xs={12}>
                {stagerTaskGroupData.displayName}
              </Grid>
              <Grid item styleName="stagerGroupItem">
                <Grid container direction="row" spacing={8} styleName="tiles-grid">
                  {R.sort(R.ascend(R.prop('displayName')), stagerTaskGroupData.data).map(tileData => (
                    <Grid item styleName="status-tile" xs={6}>
                      <StagerDocumentStatusCard
                        active={this.isActiveCard(
                          tileData.displayName, stagerTaskGroupData.displayName,
                        )}
                        data={tileData}
                        onStatusCardClick={onStatusCardClick}
                        tabName={stagerTaskGroupData.displayName}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          ))}
        </Grid>
      </>
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
