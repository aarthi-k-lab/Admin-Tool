import React from 'react';
import './StagerDetailsTable.css';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import moment from 'moment-timezone';
import ListIcon from '@material-ui/icons/List';
import { CSVLink } from 'react-csv';
import CustomReactTable from 'components/CustomReactTable';
import StagerReactTable from 'components/StagerReactTable';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import { selectors as loginSelectors } from 'ducks/login';
import renderSkeletonLoader from './TableSkeletonLoader';
import StagerPopup from '../StagerPopUp';


const CONTINUE_REVIEW = 'CONTINUE REVIEW';
const SENT_FOR_REJECT = 'SENT FOR REJECT';
const REJECT = 'REJECT';

const getCSTDateTime = dateTime => (R.isNil(dateTime) ? '-' : moment(dateTime).tz('America/Chicago').format('MM/DD/YYYY hh:mm A'));


class StagerDetailsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.csvLink = React.createRef();
    this.renderDataTable = this.renderDataTable.bind(this);
    this.onDocGenClick = this.onDocGenClick.bind(this);
  }

  static getDispositionOperationPayload(data, stagerTaskType) {
    const docGenPayload = R.map(dataUnit => ({
      evalId: dataUnit['Eval ID'] && dataUnit['Eval ID'].toString(),
      taskId: dataUnit.TKIID && dataUnit.TKIID.toString(),
      loanNumber: dataUnit['Loan Number'] && dataUnit['Loan Number'].toString(),
    }), data);
    const payload = {
      taskList: docGenPayload,
      group: stagerTaskType,
    };
    return payload;
  }

  onDocGenClick(data, action, stagerTaskType) {
    const { triggerDispositionOperationCall, onClearDocGenAction, triggerStagerGroup } = this.props;
    onClearDocGenAction();
    triggerDispositionOperationCall(
      StagerDetailsTable.getDispositionOperationPayload(data, stagerTaskType.toUpperCase()), action,
    );
    triggerStagerGroup(stagerTaskType.toUpperCase());
  }

  onDownloadCSV() {
    const { onDownloadData } = this.props;
    onDownloadData(() => this.csvLink.link.click());
  }

  buildSearchResponse(response) {
    const { getSearchStagerLoanNumber } = this.props;
    if (response && !R.isEmpty(response) && !response.error && !response.noContents) {
      return getSearchStagerLoanNumber;
    }
    return null;
  }

  renderDataTable() {
    const {
      onCheckBoxClick, onSelectAll, selectedData, getStagerSearchResponse,
      azureSearchToggle, data,
    } = this.props;
    if (azureSearchToggle) {
      return (
        <StagerReactTable
          data={data}
          onCheckBoxClick={onCheckBoxClick}
          onSelectAll={onSelectAll}
          searchResponse={this.buildSearchResponse(getStagerSearchResponse)}
          selectedData={selectedData}
        />
      );
    }
    return (
      <CustomReactTable
        data={data}
        onCheckBoxClick={onCheckBoxClick}
        onSelectAll={onSelectAll}
        searchResponse={this.buildSearchResponse(getStagerSearchResponse)}
        selectedData={selectedData}
      />
    );
  }


  static renderUnselectedMessage(noTableData = false) {
    return (
      <Grid
        alignItems="center"
        container
        direction="column"
        justify="center"
        spacing={0}
        styleName="center-grid"
      >
        <Grid item xs={8}>
          {noTableData ? null : (
            <>
              <ListIcon styleName="no-preview-icon" />
              <br />

            </>
          )}
          <span styleName="no-preview-message">{noTableData ? 'No Loans Present' : 'No list selected to preview'}</span>
        </Grid>
      </Grid>
    );
  }

  render() {
    const {
      data, loading,
      onOrderClick, selectedData, popupData, docGenAction,
      downloadedData, getActiveSearchTerm, getStagerValue,
      showRefreshButton, onRefreshStagerTile, userGroupList,
    } = this.props;
    const downloadFileName = `${getStagerValue}_${getActiveSearchTerm}.csv`;
    const displayLastUpdatedDate = ['Completed', 'Ordered'];
    return (
      <>
        {
          !R.isEmpty(data) && !loading
            ? (
              <Grid
                alignItems="flex-end"
                container
                justify="space-between"
                styleName="stager-details-table-top-div"
              >
                <Grid item xs={4}>
                  <span styleName="details-table-document-type">{data.stagerTaskType && data.stagerTaskType.toUpperCase()}</span>
                  <br />
                  <span styleName="details-table-document-status">{data.stagerTaskStatus && data.stagerTaskStatus.toUpperCase()}</span>
                  <br />
                  {
                    (displayLastUpdatedDate.includes(data.stagerTaskStatus)
                      && !R.isNil(data.lastUpdatedDate))
                      ? (
                        <span style={{ color: 'red' }} styleName="details-table-document-status">{`Last Updated: ${getCSTDateTime(data.lastUpdatedDate)}`}</span>
                      ) : null
                  }
                </Grid>
                <Grid item xs={8}>
                  {
                    data.isManualOrder && data.stagerTaskType !== 'Current Review' && !(data.stagerTaskStatus === 'Ordered' && data.stagerTaskType === 'Reclass')
                      ? (
                        <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => onOrderClick(selectedData, getActiveSearchTerm, data.stagerTaskType)} styleName="details-table-btn" variant="contained">
                          {'ORDER'}
                        </Button>
                      ) : null
                  }
                  {
                    data.stagerTaskType === 'Value' && data.stagerTaskStatus === 'Ordered'
                      ? (
                        <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => onOrderClick(selectedData, getActiveSearchTerm, data.stagerTaskType)} styleName="details-table-btn" variant="contained">
                          {'COMPLETE'}
                        </Button>
                      ) : null
                  }
                  {
                    data.isManualOrder && (data.stagerTaskType === 'Current Review' || data.stagerTaskType === 'Reclass') ? (
                      <>
                        <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => this.onDocGenClick(selectedData, REJECT, data.stagerTaskType)} styleName="details-table-btn" variant="contained">
                          {REJECT}
                        </Button>
                        <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => this.onDocGenClick(selectedData, SENT_FOR_REJECT, data.stagerTaskType)} styleName="details-table-btn" variant="contained">
                          {SENT_FOR_REJECT}
                        </Button>
                        {' '}

                      </>
                    ) : null
                  }
                  {
                    data.isManualOrder && data.stagerTaskType === 'Current Review'
                      ? (
                        <>
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => this.onDocGenClick(selectedData, CONTINUE_REVIEW, data.stagerTaskType)} styleName="details-table-btn" variant="contained">
                            {CONTINUE_REVIEW}
                          </Button>
                        </>
                      ) : null
                  }
                  <Button disabled={R.isNil(data.tableData) || (R.isEmpty(data.tableData))} onClick={() => this.onDownloadCSV()} styleName="details-table-download-btn">
                    <DownloadIcon styleName="details-table-download-icon" />
                    {' DOWNLOAD'}
                  </Button>
                  {(userGroupList.includes('stager-mgr') || userGroupList.includes('rpsstager-mgr')) && showRefreshButton
                    && (
                      <Button
                        onClick={onRefreshStagerTile}
                        style={{ marginLeft: '2rem' }}
                        styleName="get-next"
                        variant="contained"
                      >
                        Refresh
                      </Button>
                    )}
                  <CSVLink
                    // eslint-disable-next-line no-return-assign
                    ref={e => this.csvLink = e}
                    data={downloadedData || [{ '': '' }]}
                    filename={downloadFileName}
                    styleName="download-btn"
                  />
                </Grid>
              </Grid>
            ) : null
        }
        {
          (R.isEmpty(data) || R.isEmpty(data.tableData)) && !loading
            ? this.constructor.renderUnselectedMessage(R.isEmpty(data.tableData)) : null
        }
        {
          loading ? renderSkeletonLoader() : null
        }
        {
          data.tableData && data.tableData.length && !loading ? (
            this.renderDataTable()
          ) : null
        }
        {popupData && !R.isEmpty(Object.keys(popupData))
          ? (<StagerPopup action={docGenAction} popupData={popupData} />) : null}

      </>
    );
  }
}

const TestExports = {
  StagerDetailsTable,
};

StagerDetailsTable.defaultProps = {
  popupData: [],
  userGroupList: [],
  showRefreshButton: false,
};

StagerDetailsTable.propTypes = {
  azureSearchToggle: PropTypes.bool.isRequired,
  data: PropTypes.shape().isRequired,
  docGenAction: PropTypes.func.isRequired,
  downloadedData: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getActiveSearchTerm: PropTypes.string.isRequired,
  getSearchStagerLoanNumber: PropTypes.string.isRequired,
  getStagerSearchResponse: PropTypes.string.isRequired,
  getStagerValue: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onClearDocGenAction: PropTypes.func.isRequired,
  onDownloadData: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  onRefreshStagerTile: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  popupData: PropTypes.arrayOf(
    PropTypes.shape({
      error: PropTypes.bool,
    }),
  ),
  selectedData: PropTypes.shape().isRequired,
  showRefreshButton: PropTypes.bool,
  triggerDispositionOperationCall: PropTypes.func.isRequired,
  triggerStagerGroup: PropTypes.func.isRequired,
  userGroupList: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => ({
  docGenAction: stagerSelectors.getdocGenAction(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
  getActiveSearchTerm: stagerSelectors.getActiveSearchTerm(state),
  downloadedData: stagerSelectors.getDownloadData(state),
  getSearchStagerLoanNumber: stagerSelectors.getSearchStagerLoanNumber(state),
  getStagerSearchResponse: stagerSelectors.getStagerSearchResponse(state),
  azureSearchToggle: stagerSelectors.getAzureSearchToggle(state),
  userGroupList: loginSelectors.getGroupList(state),
  showRefreshButton: stagerSelectors.showRefreshButton(state),
});

const mapDispatchToProps = dispatch => ({
  triggerDispositionOperationCall: stagerOperations.triggerDispositionOperationCall(dispatch),
  onClearDocGenAction: stagerOperations.onClearDocGenAction(dispatch),
  onDownloadData: stagerOperations.onDownloadData(dispatch),
  triggerStagerGroup: stagerOperations.triggerStagerGroup(dispatch),
  onRefreshStagerTile: stagerOperations.onRefreshStagerTile(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StagerDetailsTable);

export { TestExports };
