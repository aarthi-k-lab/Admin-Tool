/* eslint-disable no-dupe-keys */
import React from 'react';
import './StagerDetailsTable.css';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import ListIcon from '@material-ui/icons/List';
import { CSVLink } from 'react-csv';
// import Loader from 'components/Loader/Loader';
import CustomReactTable from 'components/CustomReactTable';
import { selectors as stagerSelectors, operations as stagerOperations } from 'ducks/stager';
import renderSkeletonLoader from './TableSkeletonLoader';
import StagerPopup from '../StagerPopUp';


const CONTINUE_REVIEW = 'CONTINUE REVIEW';
const SENT_FOR_REJECT = 'SENT FOR REJECT';
const REJECT = 'REJECT';

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

  renderDataTable() {
    const { data } = this.props;
    const { onCheckBoxClick, onSelectAll, selectedData } = this.props;
    return (
      <CustomReactTable
        data={data}
        onCheckBoxClick={onCheckBoxClick}
        onSelectAll={onSelectAll}
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
          {noTableData ? null : (<><ListIcon styleName="no-preview-icon" />
            <br /></>)}
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
    } = this.props;
    const downloadFileName = `${getStagerValue}_${getActiveSearchTerm}.csv`;
    return (
      <>
        {
          !R.isEmpty(data) && !loading
            ? (
              <Grid
                alignItems="flex-end"
                container
                item
                justify="space-between"
                styleName="stager-details-table-top-div"
              >
                <Grid item xs={4}>
                  <span styleName="details-table-document-type">{data.stagerTaskType && data.stagerTaskType.toUpperCase()}</span>
                  <br />
                  <span styleName="details-table-document-status">{data.stagerTaskStatus && data.stagerTaskStatus.toUpperCase()}</span>
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
                    data.isManualOrder && (data.stagerTaskType === 'Current Review' || data.stagerTaskType === 'Reclass') ? (
                      <>
                        <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => this.onDocGenClick(selectedData, REJECT, data.stagerTaskType)} styleName="details-table-btn" variant="contained">
                          {REJECT}
                        </Button>
                        <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => this.onDocGenClick(selectedData, SENT_FOR_REJECT, data.stagerTaskType)} styleName="details-table-btn" variant="contained">
                          {SENT_FOR_REJECT}
                        </Button> </>) : null
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
};

StagerDetailsTable.propTypes = {
  data: PropTypes.node.isRequired,
  docGenAction: PropTypes.func.isRequired,
  downloadedData: PropTypes.node.isRequired,
  getActiveSearchTerm: PropTypes.string.isRequired,
  getStagerValue: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onClearDocGenAction: PropTypes.func.isRequired,
  onDownloadData: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  popupData: PropTypes.arrayOf(
    PropTypes.shape({
      error: PropTypes.bool,
    }),
  ),
  selectedData: PropTypes.node.isRequired,
  triggerDispositionOperationCall: PropTypes.func.isRequired,
  triggerStagerGroup: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  docGenAction: stagerSelectors.getdocGenAction(state),
  getStagerValue: stagerSelectors.getStagerValue(state),
  getActiveSearchTerm: stagerSelectors.getActiveSearchTerm(state),
  downloadedData: stagerSelectors.getDownloadData(state),
});

const mapDispatchToProps = dispatch => ({
  triggerDispositionOperationCall: stagerOperations.triggerDispositionOperationCall(dispatch),
  onClearDocGenAction: stagerOperations.onClearDocGenAction(dispatch),
  onDownloadData: stagerOperations.onDownloadData(dispatch),
  triggerStagerGroup: stagerOperations.triggerStagerGroup(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StagerDetailsTable);

export { TestExports };
