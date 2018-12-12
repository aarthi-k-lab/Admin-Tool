import React from 'react';
import './StagerTiles.css';
import Grid from '@material-ui/core/Grid';
import StagerDocumentStatusCard from 'components/StagerDocumentStatusCard';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class StagerTiles extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { stagerStatus: 'TO ORDER' };
    this.handleChange = this.handleChange.bind(this);
  }

  isActiveCard(tileName, tabName) {
    const { activeTab, activeTile } = this.props;
    if (tileName === activeTile && tabName === activeTab) {
      return true;
    }
    return false;
  }

  handleChange(e) {
    this.setState({ stagerStatus: e.target.value });
  }

  render() {
    const { counts, onStatusCardClick } = this.props;
    const { stagerStatus } = this.state;
    return (
      <>
        <Grid item xs={12}>
          <Select
            onChange={this.handleChange}
            styleName="stager-tiles-status-select"
            value={stagerStatus}
          >
            {counts && counts.map(stagerTaskData => (
              <MenuItem key={stagerTaskData.displayName} value={stagerTaskData.displayName}>
                {stagerTaskData.displayName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid container styleName="stager-tiles-main-container">
          {
          !counts.length ? <Loader /> : null
        }
          {counts && counts.filter(
            statusObj => statusObj.displayName === stagerStatus,
          )
            .map(stagerTaskData => (
              <Grid item xs={12}>
                <Grid container direction="row" spacing={8} styleName="tiles-grid">
                  {stagerTaskData.data.map(tileData => (
                    <Grid item styleName="status-tile" xs={12}>
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
            ))}
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
  onStatusCardClick: PropTypes.func.isRequired,
};

export default StagerTiles;
export { TestExports };
