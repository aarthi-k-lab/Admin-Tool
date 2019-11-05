import React from 'react';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ContentHeader from 'components/ContentHeader';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import { operations as dashboardOperations, selectors as dashboardSelectors } from 'ducks/dashboard';
import {
  selectors as loginSelectors,
} from 'ducks/login';
import { selectors as checklistSelectors } from 'ducks/tasks-and-checklist';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import StagerTiles from '../StagerTiles';
import StagerDetailsTable from '../StagerDetailsTable';
import './StagerPage.css';
import DashboardModel from '../../../models/Dashboard';

const BULKUPLOAD_STAGER = 'BULKUPLOAD_STAGER';
const getStagertypeValues = [
  {
    name: 'UW_STAGER',
    value: 'UNDERWRITER STAGER',
  }, {
    name: 'DOCGEN_STAGER',
    value: 'DOC GEN STAGER',
  }, {
    name: 'STAGER_ALL',
    value: 'ALL',
  },
];
const getPostModStagertypeValues = [
  {
    name: 'POSTMOD_STAGER_ALL',
    value: 'POSTMOD STAGER',
  },
];
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
    this.renderstagerSelect = this.renderstagerSelect.bind(this);
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

  handleGetNextClick = () => {
    const {
      history, onGetNext, group,
      isFirstVisit, dispositionCode, activeTile, setStagerTaskName,
    } = this.props;
    onGetNext({
      appGroupName: group, isFirstVisit, dispositionCode, activeTile,
    });
    if (group === DashboardModel.POSTMODSTAGER) {
      setStagerTaskName(activeTile);
    }
    history.push('/postmodstager');
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

  renderstagerSelect(isStagerGroup, isPostModStagerGroup, stager) {
    let allStagerGroups = [];
    if (isStagerGroup) {
      allStagerGroups = [...getStagertypeValues, ...getPostModStagertypeValues];
    } else {
      allStagerGroups = isPostModStagerGroup ? getPostModStagertypeValues : getStagertypeValues;
    }
    return (
      <Select
        onChange={event => this.onStagerChange(event)}
        value={stager}
      >
        {
          allStagerGroups.map(datas => <MenuItem value={datas.name}>{datas.value}</MenuItem>)

        }
      </Select>
    );
  }

  renderStagerPage() {
    const {
      activeTab, activeTile,
      counts, loading, onStatusCardClick,
      tableData, onCheckBoxClick, onOrderClick, onDocGenClick, onSelectAll, selectedData,
      refreshDashboard, stager, popupData, getStagerSearchResponse,
    } = this.props;
    const { group } = this.props;
    const isAllStagerGroup = group === DashboardModel.ALL_STAGER;
    const isPostModStagerGroup = group === DashboardModel.POSTMODSTAGER;
    const { searchText } = this.state;
    return (
      <>
        <ContentHeader title={
          (
            <>
              <Grid container direction="row">
                <Grid item styleName="select-width">
                  {
                    this.renderstagerSelect(isAllStagerGroup, isPostModStagerGroup, stager)
                  }
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
                  <Fab aria-label="add" color="secondary" onClick={() => this.handleClick()} size="small" styleName="order-button" title="UPLOAD">
                    <AddIcon />
                  </Fab>
                </Grid>
                {getStagerSearchResponse
                  && (getStagerSearchResponse.error || getStagerSearchResponse.noContents)
                  ? (
                    <Grid item>
                      <div styleName="errormsg">{getStagerSearchResponse.error || getStagerSearchResponse.noContents}</div>
                    </Grid>
                  ) : null
                }
                { ((isAllStagerGroup || isPostModStagerGroup) && !R.isNil(activeTile))
                  ? (
                    <Grid style={{ 'margin-left': '69rem' }}>
                      <Button
                        className="material-ui-button"
                        color="primary"
                        onClick={() => this.handleGetNextClick()}
                        styleName="getNext-button"
                        variant="outlined"
                      >
                     GET NEXT
                      </Button>
                    </Grid>
                  ) : null
          }
              </Grid>
            </>
          )}
        />
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
  activeTab: '',
};

StagerPage.propTypes = {
  activeTab: PropTypes.string,
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
  dispositionCode: PropTypes.string.isRequired,
  getStagerSearchResponse: PropTypes.node.isRequired,
  group: PropTypes.string.isRequired,
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
  isFirstVisit: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  onCheckBoxClick: PropTypes.func.isRequired,
  onClearDocGenAction: PropTypes.func.isRequired,
  onClearStagerResponse: PropTypes.func.isRequired,
  onDocGenClick: PropTypes.func.isRequired,
  onGetNext: PropTypes.func.isRequired,
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
  setStagerTaskName: PropTypes.func.isRequired,
  stager: PropTypes.string.isRequired,
  tableData: PropTypes.node.isRequired,
  triggerStagerSearchLoan: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onClearDocGenAction: stagerOperations.onClearDocGenAction(dispatch),
  triggerStagerSearchLoan: stagerOperations.triggerStagerSearchLoan(dispatch),
  onClearStagerResponse: stagerOperations.onClearStagerResponse(dispatch),
  onGetNext: dashboardOperations.onGetNext(dispatch),
  setPageType: dashboardOperations.setPageType(dispatch),
  setStagerTaskName: dashboardOperations.setStagerTaskName(dispatch),
});

const mapStateToProps = state => ({
  getStagerSearchResponse: stagerSelectors.getStagerSearchResponse(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
  user: loginSelectors.getUser(state),
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
  dispositionCode: checklistSelectors.getDispositionCode(state),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StagerPage));
export { TestExports };
