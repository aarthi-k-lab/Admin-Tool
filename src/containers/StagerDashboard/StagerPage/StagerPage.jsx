import React from 'react';
import ContentHeader from 'components/ContentHeader';
import Grid from '@material-ui/core/Grid';
import Controls from 'containers/Controls';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import StagerTiles from '../StagerTiles';
import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';

class StagerPage extends React.PureComponent {
  render() {
    const {
      activeTab, activeTile,
      counts, loading, onStatusCardClick,
    } = this.props;
    return (
      <>
        <ContentHeader title={(
          <Select
            disabled
            value="UNDERWRITER"
          >
            <MenuItem value="UNDERWRITER">UNDERWRITER STAGER</MenuItem>
          </Select>
        )}
        >
          <Controls />
        </ContentHeader>
        <Grid container>
          <Grid item lg={4} xs={4}>
            <StagerTiles
              activeTab={activeTab}
              activeTile={activeTile}
              counts={counts}
              onStatusCardClick={onStatusCardClick}
            />
          </Grid>
          <Grid item lg={8} xs={8}>
            <StagerDetailsTable loading={loading} />
          </Grid>
        </Grid>
      </>
    );
  }
}

StagerPage.defaultProps = {
  loading: true,
};

StagerPage.propTypes = {
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
  loading: PropTypes.bool,
  onStatusCardClick: PropTypes.func.isRequired,
};

export default StagerPage;
