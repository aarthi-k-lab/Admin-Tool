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
const BULKUPLOAD_POSTMOD_STAGER = 'BULKUPLOAD_POSTMOD_STAGER';
const BULKUPLOAD_ALL_STAGER = 'BULKUPLOAD_ALL_STAGER';
const getStagertypeValues = [
  {
    value: 'UW_STAGER',
    name: 'UNDERWRITER STAGER',
  }, {
    value: 'DOCGEN_STAGER',
    name: 'DOC GEN STAGER',
  },
];
const getPostModStagertypeValues = [
  {
    value: 'POSTMOD_STAGER_ALL',
    name: 'POSTMOD STAGER',
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

  componentDidMount() {
    const { triggerStagerValue, stager } = this.props;
    triggerStagerValue(stager);
  }

  onStagerChange(event) {
    const {
      onStagerChange, onClearDocGenAction, onClearStagerResponse, onGetGroupName, setPageType,
    } = this.props;
    this.setState({ searchText: '' });
    onStagerChange(event.target.value);
    let groupName = '';
    if (event.target.value === DashboardModel.STAGER_VALUE.ALL) {
      groupName = DashboardModel.ALL_STAGER;
      setPageType(BULKUPLOAD_ALL_STAGER);
    } else if (event.target.value === DashboardModel.STAGER_VALUE.POSTMOD_STAGER_ALL) {
      groupName = DashboardModel.POSTMODSTAGER;
      setPageType(BULKUPLOAD_POSTMOD_STAGER);
    } else {
      groupName = DashboardModel.STAGER;
      setPageType(BULKUPLOAD_STAGER);
    }
    onGetGroupName(groupName);
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
      isFirstVisit, dispositionCode, activeTile, setStagerTaskName, activeTab,
    } = this.props;
    onGetNext({
      appGroupName: group, isFirstVisit, dispositionCode, activeTile, activeTab,
    });
    if (group === DashboardModel.POSTMODSTAGER || group === DashboardModel.ALL_STAGER) {
      const payload = { activeTab, activeTile };
      setStagerTaskName(payload);
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

  handleClick(isAllStagerGroup, isPostModStagerGroup) {
    const { showBulkOrderPage } = this.state;
    const {
      bulkOrderPageType, setPageType, history, onClearBulkUploadDataAction,
      onCleanResult,
    } = this.props;
    this.setState({ showBulkOrderPage: !showBulkOrderPage });
    onClearBulkUploadDataAction();
    onCleanResult();
    history.push('/bulkOrder-page');
    if (!bulkOrderPageType) {
      if (isAllStagerGroup) {
        setPageType(BULKUPLOAD_ALL_STAGER);
      } else if (isPostModStagerGroup) {
        setPageType(BULKUPLOAD_POSTMOD_STAGER);
      } else {
        setPageType(BULKUPLOAD_STAGER);
      }
    }
  }

  renderstagerSelect(isAllStagerGroup, isPostModStagerGroup, stager) {
    let stagerGroups = [];
    if (isAllStagerGroup) {
      stagerGroups = [...getStagertypeValues, ...getPostModStagertypeValues];
    } else {
      const stagerDropdownValue = isPostModStagerGroup
        ? getPostModStagertypeValues : getStagertypeValues;
      stagerGroups = R.concat(stagerDropdownValue, stagerGroups);
    }
    if (!isPostModStagerGroup) {
      stagerGroups.push({ name: 'ALL', value: isAllStagerGroup ? 'ALL' : 'STAGER_ALL' });
    }
    return (
      <Select
        // eslint-disable-next-line max-len
        onChange={event => this.onStagerChange(event, isAllStagerGroup, isPostModStagerGroup, stager)}
        value={stager}
      >
        {
          stagerGroups.map(datas => <MenuItem value={datas.value}>{datas.name}</MenuItem>)

        }
      </Select>
    );
  }

  renderStagerPage() {
    const {
      activeTab, activeTile,
      counts, loading, onStatusCardClick,
      tableData, onCheckBoxClick, onOrderClick, onDocGenClick, onSelectAll, selectedData,
      refreshDashboard, stager, popupData, getStagerSearchResponse, stagerTaskName,
    } = this.props;
    const { group } = this.props;
    const isAllStagerGroup = group === DashboardModel.ALL_STAGER;
    const isPostModStagerGroup = group === DashboardModel.POSTMODSTAGER;
    const { searchText } = this.state;
    return (
      <>
        <ContentHeader
          title={
            (
              <>
                <Grid container direction="row" styleName="ContentHeader">
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
                  <Grid item>
                    <Fab aria-label="add" color="secondary" onClick={() => this.handleClick(isAllStagerGroup, isPostModStagerGroup)} size="small" styleName="order-button" title="UPLOAD">
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
                  {!R.isNil(activeTile) && activeTab !== 'Completed' && DashboardModel.POSTMOD_TASKNAMES.includes(activeTile)
                    ? (
                      <Grid item styleName="getNextStyle">
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
              stagerTaskName={stagerTaskName}
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
  onCleanResult: () => { },
  popupData: {},
  activeTab: '',
};

StagerPage.propTypes = {
  activeTab: PropTypes.string,
  activeTile: PropTypes.string.isRequired,
  bulkOrderPageType: PropTypes.string.isRequired,
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
  onCleanResult: PropTypes.func,
  onClearBulkUploadDataAction: PropTypes.func.isRequired,
  onClearDocGenAction: PropTypes.func.isRequired,
  onClearStagerResponse: PropTypes.func.isRequired,
  onDocGenClick: PropTypes.func.isRequired,
  onGetGroupName: PropTypes.func.isRequired,
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
  stagerTaskName: PropTypes.string.isRequired,
  tableData: PropTypes.node.isRequired,
  triggerStagerSearchLoan: PropTypes.func.isRequired,
  triggerStagerValue: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onClearDocGenAction: stagerOperations.onClearDocGenAction(dispatch),
  triggerStagerSearchLoan: stagerOperations.triggerStagerSearchLoan(dispatch),
  onClearStagerResponse: stagerOperations.onClearStagerResponse(dispatch),
  onClearBulkUploadDataAction: dashboardOperations.onClearBulkUploadDataAction(dispatch),
  onCleanResult: dashboardOperations.onCleanResult(dispatch),
  onGetNext: dashboardOperations.onGetNext(dispatch),
  setPageType: dashboardOperations.setPageType(dispatch),
  onGetGroupName: dashboardOperations.onGetGroupName(dispatch),
  setStagerTaskName: dashboardOperations.setStagerTaskName(dispatch),
  triggerStagerValue: stagerOperations.triggerStagerValue(dispatch),
});

const mapStateToProps = state => ({
  bulkOrderPageType: dashboardSelectors.bulkOrderPageType(state),
  getStagerSearchResponse: stagerSelectors.getStagerSearchResponse(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
  user: loginSelectors.getUser(state),
  isFirstVisit: dashboardSelectors.isFirstVisit(state),
  stagerTaskName: dashboardSelectors.stagerTaskName(state),
  dispositionCode: checklistSelectors.getDispositionCode(state),
});


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StagerPage));
export { TestExports };
