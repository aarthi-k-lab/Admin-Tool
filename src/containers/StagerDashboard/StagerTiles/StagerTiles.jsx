import React, { Fragment } from 'react';
import './StagerTiles.css';
import Grid from '@material-ui/core/Grid';
import StagerDocumentStatusCard from 'components/StagerDocumentStatusCard';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import * as R from 'ramda';
import DatePicker from '../DatePicker';


class StagerTiles extends React.PureComponent {
  isActiveCard(tileName, tabName) {
    const { activeTab, activeTile, searchResponse } = this.props;
    let searchTileName = null;
    if (searchResponse && searchResponse[tabName]) {
      searchTileName = searchResponse[tabName].split(',');
      return R.contains(tileName, searchTileName);
    }
    if (R.isEmpty(searchResponse) && tileName === activeTile && tabName === activeTab) {
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
          <div>
            {countsData.map(stagerTaskGroupData => (
              <Fragment key={stagerTaskGroupData.displayName}>
                <Grid item styleName="taskStatusTitle" xs={12}>
                  <div style={{ flexGrow: '0.75' }}>
                    {stagerTaskGroupData.displayName}
                  </div>
                  <div>
                    {stagerTaskGroupData.displayName === 'Completed' ? (
                      <DatePicker />
                    ) : null}
                  </div>
                </Grid>
                <Grid item styleName="stagerGroupItem">
                  <Grid container direction="row" spacing={1} styleName="tiles-grid">
                    {stagerTaskGroupData.data.sort((current, next) => (
                      (current.order > next.order) ? 1 : -1)).map(tileData => (
                        <Grid key={tileData.displayName} item styleName="status-tile" xs={6}>
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
              </Fragment>
            ))}
          </div>
        </Grid>
      </>
    );
  }
}
const TestExports = {
  StagerTiles,
};
StagerTiles.defaultProps = {
  searchResponse: {},
};
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
  searchResponse: PropTypes.shape({
    loanNumber: PropTypes.array.isRequired,
    titleType: PropTypes.array.isRequired,
    titleValue: PropTypes.array.isRequired,

  }),
};
export default StagerTiles;
export { TestExports };
