import React from 'react';
import './StagerTiles.css';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import StagerDocumentStatusCard from 'components/StagerDocumentStatusCard';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import * as R from 'ramda';
import { selectors as stagerSelectors } from 'ducks/stager';
import DatePicker from '../DatePicker';


class StagerTiles extends React.PureComponent {
  isActiveCard(tileName, tabName) {
    const { activeTab, activeTile } = this.props;
    if (tileName === activeTile && tabName === activeTab) {
      return true;
    }
    return false;
  }

  ishighlightCard() {
    const { getStagerSearchResponse, counts } = this.props;
    const stagerHighlightedValue = {};
    const titleName = [];
    const tabName = new Set();
    counts.forEach((tileNameValue) => {
      titleName.push(tileNameValue.displayName);
      tileNameValue.data.forEach((tabNamevalue) => {
        tabName.add(tabNamevalue.displayName);
        stagerHighlightedValue.tabName = tabName;
        stagerHighlightedValue.tileName = titleName;
        return ({ stagerHigh: stagerHighlightedValue });
      });
    });
    console.log('getStagerSearchResponse', getStagerSearchResponse);
    console.log('stagerHighlightedValue', stagerHighlightedValue);
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
              <>
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
                  <Grid container direction="row" spacing={8} styleName="tiles-grid">
                    {stagerTaskGroupData.data.sort((current, next) => (
                      (current.order > next.order) ? 1 : -1)).map(tileData => (
                        <Grid item styleName="status-tile" xs={6}>
                          <StagerDocumentStatusCard
                            active={this.isActiveCard(
                              tileData.displayName, stagerTaskGroupData.displayName,
                            )}
                            data={tileData}
                            highlightTile={this.ishighlightCard()}
                            onStatusCardClick={onStatusCardClick}
                            tabName={stagerTaskGroupData.displayName}
                          />
                        </Grid>
                    ))}
                  </Grid>
                </Grid>
              </>
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
  getStagerSearchResponse: PropTypes.func.isRequired,
  onStatusCardClick: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  getStagerSearchResponse: stagerSelectors.getStagerSearchResponse(state),
});

export default connect(mapStateToProps, null)(StagerTiles);
export { TestExports };
