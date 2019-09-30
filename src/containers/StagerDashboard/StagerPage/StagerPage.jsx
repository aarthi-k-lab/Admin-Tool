import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ContentHeader from 'components/ContentHeader';
import Grid from '@material-ui/core/Grid';
import Controls from 'containers/Controls';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import RefreshIcon from '@material-ui/icons/Refresh';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import { operations as dashboardOperations } from 'ducks/dashboard';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import StagerTiles from '../StagerTiles';
import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';

const UW_STAGER = 'UNDERWRITER STAGER';
const DOCGEN_STAGER = 'DOC GEN STAGER';
const STAGER_ALL = 'ALL';
const BULKUPLOAD_STAGER = 'BULKUPLOAD_STAGER';

// const renderBulkOrderPage = () => (
//   <BulkOrderPage />
// );
class StagerPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      showBulkOrderPage: false,
    };
    this.handleSearchLoanClick = this.handleSearchLoanClick.bind(this);
    this.handleSearchLoan = this.handleSearchLoan.bind(this);
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.onStagerChange = this.onStagerChange.bind(this);
    this.renderStagerPage = this.renderStagerPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  onStagerChange(event) {
    const { onStagerChange, onClearDocGenAction, onClearStagerResponse } = this.props;
    this.setState({ searchText: '' });
    onStagerChange(event.target.value);
    onClearDocGenAction();
    onClearStagerResponse();
  }

  onSearchTextChange(event) {
    const re = /^[0-9\b]+$/;
    if (event.target.value === '' || re.test(event.target.value)) {
      this.setState({ searchText: event.target.value });
    }
  }

  handleChange() {
    const { showBulkOrderPage } = this.state;
    this.setState({ showBulkOrderPage: !showBulkOrderPage });
  }

  handleSearchLoanClick() {
    const { searchText } = this.state;
    const { triggerStagerSearchLoan } = this.props;
    if (searchText) {
      triggerStagerSearchLoan(searchText);
    }
  }

  handleSearchLoan(event) {
    if (event.charCode === 13 || event.key === 'Enter') {
      this.handleSearchLoanClick();
    }
  }

  handleClick() {
    const { showBulkOrderPage } = this.state;
    const { setPageType, history } = this.props;
    this.setState({ showBulkOrderPage: !showBulkOrderPage });
    history.push('/bulkOrder-page');
    setPageType(BULKUPLOAD_STAGER);
  }

  renderStagerPage() {
    const {
      activeTab, activeTile,
      counts, loading, onStatusCardClick,
      tableData, onCheckBoxClick, onOrderClick, onDocGenClick, onSelectAll, selectedData,
      refreshDashboard, stager, popupData, getStagerSearchResponse,
    } = this.props;
    const { searchText } = this.state;
    return (
      <>
        <ContentHeader title={
          (
            <>
              <Grid container direction="row">
                <Grid item styleName="select-width">
                  <Select
                    onChange={event => this.onStagerChange(event)}
                    value={stager}
                  >
                    <MenuItem value="STAGER_ALL">{STAGER_ALL}</MenuItem>
                    <MenuItem value="UW_STAGER">{UW_STAGER}</MenuItem>
                    <MenuItem value="DOCGEN_STAGER">{DOCGEN_STAGER}</MenuItem>
                  </Select>
                </Grid>
                <Grid item styleName="scroll-area">
                  <IconButton aria-label="Refresh Dashboard" onClick={refreshDashboard}>
                    <RefreshIcon />
                  </IconButton>
                </Grid>
                <Grid item styleName="scroll-area">
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
                <Grid>
                  <Button
                    className="material-ui-button"
                    color="primary"
                    onClick={() => this.handleClick()}
                    styleName="order-button"
                    variant="outlined"
                  >
                    UPLOAD
                  </Button>
                </Grid>
                {getStagerSearchResponse
                  && (getStagerSearchResponse.error || getStagerSearchResponse.noContents)
                  ? (
                    <Grid item>
                      <div styleName="errormsg">{getStagerSearchResponse.error || getStagerSearchResponse.noContents}</div>
                    </Grid>
                  ) : null
                }
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
              searchResponse={getStagerSearchResponse}
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

  render() {
    return (
      <>
        {this.renderStagerPage()}
      </>
    );
  }
}

const TestExports = {
  StagerPage,
};

StagerPage.defaultProps = {
  location: {
    pathname: '',
  },
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
  getStagerSearchResponse: PropTypes.node.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onCheckBoxClick: PropTypes.func.isRequired,
  onClearDocGenAction: PropTypes.func.isRequired,
  onClearStagerResponse: PropTypes.func.isRequired,
  onDocGenClick: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onStagerChange: PropTypes.func.isRequired,
  onStatusCardClick: PropTypes.func.isRequired,
  popupData: PropTypes.shape(
    PropTypes.arrayOf({
      hitLoans: PropTypes.array.isRequired,
      missedLoans: PropTypes.array.isRequired,
    }),
  ),
  refreshDashboard: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
  setPageType: PropTypes.func.isRequired,
  stager: PropTypes.string.isRequired,
  tableData: PropTypes.node.isRequired,
  triggerStagerSearchLoan: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onClearDocGenAction: stagerOperations.onClearDocGenAction(dispatch),
  triggerStagerSearchLoan: stagerOperations.triggerStagerSearchLoan(dispatch),
  onClearStagerResponse: stagerOperations.onClearStagerResponse(dispatch),
  setPageType: dashboardOperations.setPageType(dispatch),
});

const mapStateToProps = state => ({
  getStagerSearchResponse: stagerSelectors.getStagerSearchResponse(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StagerPage));
export { TestExports };
