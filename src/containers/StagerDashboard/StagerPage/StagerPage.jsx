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
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import StagerTiles from '../StagerTiles';
import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';

const UW_STAGER = 'UNDERWRITER STAGER';
const DOCGEN_STAGER = 'DOC GEN STAGER';
const STAGER_ALL = 'ALL';

class StagerPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
    this.handleSearchLoanClick = this.handleSearchLoanClick.bind(this);
    this.handleSearchLoan = this.handleSearchLoan.bind(this);
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
  }

  onStagerChange(event) {
    const { onStagerChange, onClearDocGenAction } = this.props;
    onStagerChange(event.target.value);
    onClearDocGenAction();
  }

  onSearchTextChange(event) {
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState({ searchText: event.target.value });
    }
  }

  handleSearchLoanClick() {
    const { searchText } = this.state;
    const { triggerStagerSearchLoan } = this.props;
    if (searchText) {
      this.shouldSearchLoan = true;
      triggerStagerSearchLoan(searchText);
    }
  }

  handleSearchLoan(event) {
    if (event.charCode === 13 || event.key === 'Enter') {
      this.handleSearchLoanClick();
    }
  }

  render() {
    const {
      activeTab, activeTile,
      counts, loading, onStatusCardClick,
      tableData, onCheckBoxClick, onOrderClick, onDocGenClick, onSelectAll, selectedData,
      refreshDashboard, stager, popupData,
    } = this.props;
    const { searchText } = this.state;
    return (
      <>
        <ContentHeader title={(<>
          <Grid container xs={12}>
            <Grid container item styleName="select-width" xs={5}>
              <Select
                onChange={event => this.onStagerChange(event)}
                value={stager}
              >
                <MenuItem value="STAGER_ALL">{STAGER_ALL}</MenuItem>
                <MenuItem value="UW_STAGER">{UW_STAGER}</MenuItem>
                <MenuItem value="DOCGEN_STAGER">{DOCGEN_STAGER}</MenuItem>
              </Select>
            </Grid>
            <Grid container item styleName="scroll-area" xs={2}>
              <IconButton aria-label="Refresh Dashboard" onClick={refreshDashboard} styleName="refresh-button">
                <RefreshIcon />
              </IconButton>
            </Grid>
            <Grid container item styleName="scroll-area" xs={5}>
              <TextField
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={this.handleSearchLoanClick}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={this.onSearchTextChange}
                onKeyPress={this.handleSearchLoan}
                placeholder="Search (Loan No)"
                styleName="searchStyle"
                value={searchText}
                varirant="filled"
              />
            </Grid>
          </Grid>
        </>
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
              loading={loading}
              onCheckBoxClick={onCheckBoxClick}
              onDocGenClick={onDocGenClick}
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
  loading: PropTypes.bool,
  onCheckBoxClick: PropTypes.func.isRequired,
  onClearDocGenAction: PropTypes.func.isRequired,
  onDocGenClick: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onStagerChange: PropTypes.func.isRequired,
  onStatusCardClick: PropTypes.func.isRequired,
  popupData: PropTypes.shape({
    hitLoans: PropTypes.array.isRequired,
    missedLoans: PropTypes.array.isRequired,
  }),
  refreshDashboard: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
  stager: PropTypes.string.isRequired,
  tableData: PropTypes.node.isRequired,
  triggerStagerSearchLoan: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onClearDocGenAction: stagerOperations.onClearDocGenAction(dispatch),
  triggerStagerSearchLoan: stagerOperations.triggerStagerSearchLoan(dispatch),
});

export default connect(null, mapDispatchToProps)(StagerPage);
export { TestExports };
