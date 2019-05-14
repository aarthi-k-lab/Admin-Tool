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
    this.renderDataTable = this.renderDataTable.bind(this);
    this.onDocsOutClick = this.onDocsOutClick.bind(this);
  }

  onDocsOutClick(data, action) {
    const { triggerDocsOutCall } = this.props;
    const docsOutPayload = R.map(dataUnit => ({
      evalId: dataUnit['Eval ID'] && dataUnit['Eval ID'].toString(),
      taskId: dataUnit.TKIID && dataUnit.TKIID.toString(),
    }), data);
    const payload = {
      type: 'DOCSOUT STAGER',
      data: docsOutPayload,
    };
    triggerDocsOutCall(payload, action);
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
      data, loading, downloadCSVUri,
      onOrderClick, selectedData, popupData, docsOutAction,
    } = this.props;

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
                    data.isManualOrder && data.stagerTaskType !== 'Current Review'
                      ? (
                        <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => onOrderClick(selectedData)} styleName="details-table-btn" variant="contained">
                          {'ORDER'}
                        </Button>
                      ) : null
                  }
                  {
                    data.isManualOrder && data.stagerTaskType === 'Current Review'
                      ? (
                        <>
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => this.onDocsOutClick(selectedData, CONTINUE_REVIEW)} styleName="details-table-btn" variant="contained">
                            {CONTINUE_REVIEW}
                          </Button>
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => this.onDocsOutClick(selectedData, REJECT)} styleName="details-table-btn" variant="contained">
                            {REJECT}
                          </Button>
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => this.onDocsOutClick(selectedData, SENT_FOR_REJECT)} styleName="details-table-btn" variant="contained">
                            {SENT_FOR_REJECT}
                          </Button>
                        </>
                      ) : null
                  }
                  <a download href={downloadCSVUri}>
                    <Button disabled={R.isNil(data.tableData) || (R.isEmpty(data.tableData))} styleName="details-table-download-btn">
                      <DownloadIcon styleName="details-table-download-icon" />
                      {' DOWNLOAD'}
                    </Button>
                  </a>
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
        {popupData && popupData.length > 0
          ? (<StagerPopup action={docsOutAction} popupData={popupData} />) : null}

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
  docsOutAction: PropTypes.func.isRequired,
  downloadCSVUri: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  popupData: PropTypes.arrayOf(
    PropTypes.shape({
      error: PropTypes.bool,
    }),
  ),
  selectedData: PropTypes.node.isRequired,
  triggerDocsOutCall: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  docsOutAction: stagerSelectors.getdocsOutAction(state),
});

const mapDispatchToProps = dispatch => ({
  triggerDocsOutCall: stagerOperations.triggerDocsOutCall(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(StagerDetailsTable);

export { TestExports };
