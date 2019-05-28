import React from 'react';
import { connect } from 'react-redux';
import ContentHeader from 'components/ContentHeader';
import Grid from '@material-ui/core/Grid';
import Controls from 'containers/Controls';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import RefreshIcon from '@material-ui/icons/Refresh';
import { operations as stagerOperations } from 'ducks/stager';
import StagerTiles from '../StagerTiles';
import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';

const UW_STAGER = 'UNDERWRITER STAGER';
const DOCSOUT_STAGER = 'Docs Out Stager';

class StagerPage extends React.PureComponent {
  onStagerChange(event) {
    const { onStagerChange, onClearDocsOutAction } = this.props;
    onStagerChange(event.target.value);
    onClearDocsOutAction();
  }

  render() {
    const {
      activeTab, activeTile, downloadCSVUri,
      counts, loading, onStatusCardClick,
      tableData, onCheckBoxClick, onOrderClick, onDocsOutClick, onSelectAll, selectedData,
      refreshDashboard, stager, popupData,
    } = this.props;
    return (
      <>
        <ContentHeader title={(<>
          <Select
            onChange={event => this.onStagerChange(event)}
            value={stager}
          >
            <MenuItem value="UW_STAGER">{UW_STAGER}</MenuItem>
            <MenuItem value="DOCSOUT_STAGER">{DOCSOUT_STAGER}</MenuItem>
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
              onDocsOutClick={onDocsOutClick}
              onOrderClick={onOrderClick}
              onSelectAll={onSelectAll}
              popupData={popupData}
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
  popupData: {},
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
  onClearDocsOutAction: PropTypes.func.isRequired,
  onDocsOutClick: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onStagerChange: PropTypes.func.isRequired,
  onStatusCardClick: PropTypes.func.isRequired,
  popupData: PropTypes.shape({
    failedLoans: PropTypes.array.isRequired,
    succeedLoans: PropTypes.array.isRequired,
  }),
  refreshDashboard: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
  stager: PropTypes.string.isRequired,
  tableData: PropTypes.node.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onClearDocsOutAction: stagerOperations.onClearDocsOutAction(dispatch),
});

export default connect(null, mapDispatchToProps)(StagerPage);
export { TestExports };
