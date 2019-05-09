/* eslint-disable no-dupe-keys */
import React from 'react';
import './StagerDetailsTable.css';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import DownloadIcon from '@material-ui/icons/SaveAlt';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import ListIcon from '@material-ui/icons/List';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RemoveRedEyeIcon from '@material-ui/icons/RemoveRedEye';
import Checkbox from '@material-ui/core/Checkbox';
import WarningIcon from '@material-ui/icons/Warning';
// import Loader from 'components/Loader/Loader';
import CustomReactTable from 'components/CustomReactTable';
import renderSkeletonLoader from './TableSkeletonLoader';


const CONTINUE_REVIEW = 'CONTINUE REVIEW';
const SENT_FOR_REJECT = 'SENT FOR REJECT';
const REJECT = 'REJECT';

class StagerDetailsTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOperationRequested: false,
    };
    this.renderDataTable = this.renderDataTable.bind(this);
  }

  handleOperationOnClick(event) {
    const { selectedData } = this.props;
    this.setState({
      isOperationRequested: true,
      responseDetails: {
        type: event.currentTarget.textContent,
        totalCount: selectedData.length,
      },
    });
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
      onOrderClick, selectedData, onDocsOutClick,
    } = this.props;
    const { isOperationRequested, responseDetails } = this.state;
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
<<<<<<< HEAD
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => onDocsOutClick(selectedData, CONTINUE_REVIEW)} styleName="details-table-btn" variant="contained">
                            {CONTINUE_REVIEW}
                          </Button>
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => onDocsOutClick(selectedData, REJECT)} styleName="details-table-btn" variant="contained">
                            {REJECT}
                          </Button>
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={() => onDocsOutClick(selectedData, SENT_FOR_REJECT)} styleName="details-table-btn" variant="contained">
                            {SENT_FOR_REJECT}
=======
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={event => this.handleOperationOnClick(event)} styleName="details-table-btn" variant="contained">
                            CONTINUE REVIEW
                          </Button>
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={event => this.handleOperationOnClick(event)} styleName="details-table-btn" variant="contained">
                            REJECT
                          </Button>
                          <Button disabled={(R.isEmpty(selectedData) || R.isNil(selectedData))} onClick={event => this.handleOperationOnClick(event)} styleName="details-table-btn" variant="contained">
                            SENT FOR REJECT
>>>>>>> 47b0e3beb30b34a7f451be1fb951d1f1c5bff619
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
<<<<<<< HEAD


        <div>
          <ExpansionPanel styleName="card-header">
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon styleName="card-header-title" />} styleName="card-title">
              <Typography styleName="card-header-title">2/5 Loans ordered successfully [SENT FOR REJECT]</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails styleName="card-success-title">
              <Typography styleName="loans-ordered loans-font ">
                <span styleName="sucessedloan">2</span>
              </Typography>
              <Typography styleName="loans-font"> Loans ordered successfully</Typography>
              <RemoveRedEyeIcon styleName="eyeicon loans-font" />
            </ExpansionPanelDetails>
            <ExpansionPanelDetails styleName="card-failure-title">
              <Typography styleName="loans-ordered loans-font ">
                <span styleName="failedloan">3</span>
              </Typography>
              <Typography styleName="loans-font"> Loans Failed</Typography>
              <Button color="primary" styleName="btnretry" variant="contained">
                Retry
              </Button>
            </ExpansionPanelDetails>
            {
              mockArray.map(loanDetails => (
                <ExpansionPanelDetails styleName="card-failure-title">
                  <Grid
                    container
                  >
                    <Grid item xs={1}>
                      <Checkbox checked={loanDetails.loancheck} style={{ height: '15px' }} />
                    </Grid>
                    <Grid item xs={4}>
                      <span styleName="loans-font">{loanDetails.loannumber}</span>
                    </Grid>
                    <Grid item xs={7}>
                      <span styleName="loans-font alert-font">
                        <WarningIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} styleName="alert-font" />
                        {loanDetails.loantext}
                      </span>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              ))
            }

          </ExpansionPanel>
        </div>


=======
        {isOperationRequested ? (<StagerPopup operationDetails={responseDetails} />) : null}

>>>>>>> 47b0e3beb30b34a7f451be1fb951d1f1c5bff619
      </>
    );
  }
}

const TestExports = {
  StagerDetailsTable,
};

StagerDetailsTable.propTypes = {
  data: PropTypes.node.isRequired,
  downloadCSVUri: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onCheckBoxClick: PropTypes.func.isRequired,
  onDocsOutClick: PropTypes.func.isRequired,
  onOrderClick: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  selectedData: PropTypes.node.isRequired,
};

export default StagerDetailsTable;
export { TestExports };
