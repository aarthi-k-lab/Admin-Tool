import React from 'react';
import ContentHeader from 'components/ContentHeader';
import Grid from '@material-ui/core/Grid';
import Controls from 'containers/Controls';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import RefreshIcon from '@material-ui/icons/Refresh';
import StagerTiles from '../StagerTiles';
import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';

class StagerPage extends React.PureComponent {
  render() {
    const {
      activeTab, activeTile, downloadCSVUri,
      counts, loading, onStatusCardClick,
      tableData, onCheckBoxClick, onOrderClick, onSelectAll, selectedData,
      refreshDashboard,
    } = this.props;
    return (
      <>
        <ContentHeader title={(<>
          <Select
            disabled
            value="UNDERWRITER"
          >
            <MenuItem value="UNDERWRITER">UNDERWRITER STAGER</MenuItem>
          </Select>
          <IconButton aria-label="Refresh Dashboard" onClick={refreshDashboard} styleName="refresh-button">
            <RefreshIcon />
          </IconButton></>
        )}
        >
          <Controls />
        </ContentHeader>
        <Grid container direction="row">
          <Grid container item styleName="scroll-area" xs={3}>
            <StagerTiles
              activeTab={activeTab}
              activeTile={activeTile}
              counts={counts}
              onStatusCardClick={onStatusCardClick}
            />
          </Grid>
          <Grid container direction="column" item xs={9}>
            <StagerDetailsTable
              data={tableData}
              downloadCSVUri={downloadCSVUri}
              loading={loading}
              onCheckBoxClick={onCheckBoxClick}
              onOrderClick={onOrderClick}
              onSelectAll={onSelectAll}
              selectedData={selectedData}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

const TestExports = {
  StagerPage,
};

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
  downloadCSVUri: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onCheckBoxClick: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onStatusCardClick: PropTypes.func.isRequired,
  refreshDashboard: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
  tableData: PropTypes.node.isRequired,
};

export default StagerPage;
export { TestExports };
