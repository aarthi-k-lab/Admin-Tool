import React, { useEffect, useState } from 'react';
import {
  Typography, Button, Grid, Tabs, Tab, Paper,
} from '@material-ui/core/index';
import PropTypes from 'prop-types';
import Tombstone from 'containers/Dashboard/Tombstone';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from '@material-ui/core/IconButton';
import { selectors as incomeCalcSelectors } from 'ducks/income-calculator';
import { selectors as dashboardSelectors, operations as dashboardOperations } from 'ducks/dashboard';
import { selectors as tombstoneSelectors } from 'ducks/tombstone';
import { operations as docChecklistOperations } from 'ducks/document-checklist';
import { operations as indexerOperations } from 'ducks/indexer';
import * as R from 'ramda';
import processBorrowerData from 'lib/CustomFunctions/BorrowerData/processBorrowerData';
import DocumentViewer from 'components/IncomeCalc/DocumentViewer/DocumentViewer';
import AddContributor from 'components/IncomeCalc/AddContributor/AddContirbutor';
import SweetAlertBox from 'components/SweetAlertBox';
import './Indexing.css';
import { connect } from 'react-redux';
import Loader from 'components/Loader';
import WidgetBuilder from '../../Widgets/WidgetBuilder';
import ConfirmationDialog from './ConfirmDialog';
import IndexingList from '../IndexingList';

const Indexing = (props) => {
  const {
    setDocSelectedBorrorwer, getborrowerData, handleLink,
    inProgress, loanMAState, updateLSAMSDetails,
    loanNumber, evalId, brandName, resultOperation, resetResultOperationOperation,
  } = props;
  const [tabIndex, setTabIndex] = useState(0);
  const [showAddContributorPopup, setShowAddContributorPopup] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const displayList = processBorrowerData(getborrowerData);

  const handleTabChange = (selectedIndex) => {
    setTabIndex(selectedIndex);
    const borrowerValue = R.propOr('', 'value', R.find(R.propEq('pstnNum',
      (selectedIndex + 1)))(displayList));
    setDocSelectedBorrorwer({ selectedBorrower: borrowerValue });
  };

  const handAddContributorClick = () => {
    setShowAddContributorPopup(true);
  };

  const handleCloseAddContributor = () => {
    setShowAddContributorPopup(false);
  };

  const displayBorrowerBanner = () => (
    <Paper elevation={0} square styleName="borrowerBanner">
      <Tabs
        inkBarStyle={{ background: '#596feb' }}
        onChange={(_, selectedIndex) => handleTabChange(selectedIndex)}
        scrollable="true"
        style={{ width: '90%' }}
        value={tabIndex}
        variant="scrollable"
      >
        { inProgress ? <Loader size={20} />
          : displayList && displayList.map(task => (
            <Tab
              key={R.propOr('', 'name', task)}
              label={(
                <div styleName="tabContainer">
                  <div styleName="taballign">
                    <div styleName="borrNameDiv">
                      <Typography styleName="borrName" variant="subtitle1">
                        {task && R.propOr('', 'name', task)}
                      </Typography>
                      <Typography styleName="borrDesc" variant="subtitle2">
                        {task && R.propOr('', 'description', task)}
                      </Typography>
                    </div>
                  </div>
                </div>

)}
              styleName="borrTab"
            />
          ))}
      </Tabs>
      {displayList.length > 0 && (
        <IconButton
          onClick={handAddContributorClick}
          styleName="add-contributor-button"
        >
          <img alt="add-contributor" src="/static/img/person_add.svg" />
        </IconButton>
      )}
    </Paper>
  );

  useEffect(() => {
    if (resultOperation && resultOperation.saga === 'lsamsUpdate') {
      setDialogOpen(false);
    }
  }, [resultOperation]);

  return (
    <>
      <Typography styleName="main-headline" variant="h2">INDEXING</Typography>
      <div styleName="indexing-wrapper">
        <Tombstone />
        <div styleName="indexing-container">
          <div styleName="btn-container">
            <Button onClick={() => handleLink(true)} size="large" startIcon={<ArrowBackIosIcon />} styleName="icon-btn" type="button">
              Back
            </Button>
            <Button color="primary" onClick={() => setDialogOpen(true)} variant="contained">
              Save
            </Button>
          </div>
          <div styleName="center-container">
            <Grid container direction="column">
              <Grid item styleName="tabWidth" />
              {displayBorrowerBanner()}
              <Grid item>
                <div styleName="docListContainer">
                  <IndexingList />
                </div>
              </Grid>
            </Grid>
            <div styleName="documents-container">
              <DocumentViewer />
            </div>
            {showAddContributorPopup && <AddContributor onClose={handleCloseAddContributor} />}
          </div>
        </div>
        <WidgetBuilder page="INDEXER" />
      </div>
      <ConfirmationDialog
        cancelFn={() => setDialogOpen(false)}
        handleClose={() => setDialogOpen(false)}
        isMaLoan={loanMAState}
        isOpen={dialogOpen}
        saveFn={(values) => {
          updateLSAMSDetails({
            ...values,
            evalId,
            loanNumber,
            brandName,
          });
        }}
      />
      {resultOperation && resultOperation.status && resultOperation.saga === 'lsamsUpdate' && (
        <SweetAlertBox
          message={resultOperation.status}
          onConfirm={() => {
            if (resultOperation.level === 'Success') { handleLink(true); }
            resetResultOperationOperation();
          }}
          show={resultOperation.isOpen}
          type={resultOperation.level}
        />
      )}
    </>
  );
};

Indexing.propTypes = {
  brandName: PropTypes.string.isRequired,
  evalId: PropTypes.number.isRequired,
  getborrowerData: PropTypes.shape().isRequired,
  handleLink: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  loanMAState: PropTypes.bool.isRequired,
  loanNumber: PropTypes.number.isRequired,
  resetResultOperationOperation: PropTypes.func.isRequired,
  resultOperation: PropTypes.shape({
    isOpen: PropTypes.bool,
    level: PropTypes.string,
    saga: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  setDocSelectedBorrorwer: PropTypes.func.isRequired,
  updateLSAMSDetails: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  getborrowerData: incomeCalcSelectors.getBorrowers(state),
  inProgress: dashboardSelectors.inProgress(state),
  loanMAState: tombstoneSelectors.getLoanMAState(state),
  brandName: dashboardSelectors.brand(state),
  loanNumber: dashboardSelectors.loanNumber(state),
  evalId: dashboardSelectors.evalId(state),
  resultOperation: dashboardSelectors.resultOperation(state),
});


const mapDispatchToProps = dispatch => ({
  setDocSelectedBorrorwer: docChecklistOperations.setSelectedBorrowerOperation(dispatch),
  updateLSAMSDetails: indexerOperations.updateLSAMSDetails(dispatch),
  resetResultOperationOperation: dashboardOperations.resetResultOperationOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(Indexing);
