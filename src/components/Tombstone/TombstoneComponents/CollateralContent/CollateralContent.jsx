import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  MenuItem,
  InputAdornment,
  Divider,
  Button,
  Paper,
  FormControl,
  Select,
  IconButton,
  OutlinedInput,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { operations, selectors } from 'ducks/tombstone';
import PropTypes from 'prop-types';
import './CollateralContent.css';
import CloseIcon from '@material-ui/icons/Close';
import Loader from 'components/Loader';
import * as R from 'ramda';
import TombstoneCollapse from '../../TombstoneCollapse';
import MUITable from '../../../MUITable/MUITable';
import { PROPERTY_PRIMARY_USE, PROPERTY_VALUATIONS_COLUMNS, COLLATERAL_DIALOG_MSG } from '../../../../constants/collaterlUI';
import ConfirmationDialogBox from '../../../Tasks/OptionalTask/ConfirmationDialogBox';


function CollateralContent(props) {
  const {
    populateCollateralEvents,
    primaryUsedropdown,
    populateCollateralData,
    collateralData,
    addLoanBalance,
    saveCollateralData,
    lienLoanBalance,
    loading,
    populateLienLoanBalances,
    propertyValuations,
  } = props;

  const [collateralPropertyInfo, setCollateralPropertyInfo] = useState({
    numberOfUnits: 0,
    seniorClaim: 0,
    primaryUse: '',
    assetManagerCollateralValue: 0,
    propertyValuations: [],
    lienLoanBalance: '',
    lienLoanBalances: [],
  });


  useEffect(() => {
    populateCollateralEvents(PROPERTY_PRIMARY_USE);
    populateCollateralData();
    populateLienLoanBalances();
  }, []);

  useEffect(() => {
    setCollateralPropertyInfo(collateralData);
  }, [collateralData]);

  const handleChange = (event) => {
    const value = event.target.type === 'selected' ? event.target.selected : event.target.value;
    setCollateralPropertyInfo({
      ...collateralPropertyInfo,
      [event.target.name]: value,
    });
  };

  const [localLienBalance, setLocalLienBalance] = useState('');

  const [disableButton, setDisableButton] = useState(true);

  const noOfunitsCollateralData = R.pathOr('', ['numberOfUnits'], collateralData).toString();
  const noOfUnitsPropertyInfo = R.pathOr('', ['numberOfUnits'], collateralPropertyInfo).toString();
  const amValueCollateralData = R.pathOr('', ['assetManagerCollateralValue'], collateralData).toString();
  const amValuePropertyInfo = R.pathOr('', ['assetManagerCollateralValue'], collateralPropertyInfo).toString();
  const seniorClaimCollateralData = R.pathOr('', ['seniorClaim'], collateralData).toString();
  const seniorClaimPropertyInfo = R.pathOr('', ['seniorClaim'], collateralPropertyInfo).toString();
  const primaryValueCollateralData = R.pathOr('', ['primaryUse'], collateralData).toString();
  const primaryValuePropertyInfo = R.pathOr('', ['primaryUse'], collateralPropertyInfo).toString();

  useEffect(() => {
    const value = !R.equals(noOfunitsCollateralData, noOfUnitsPropertyInfo)
|| !R.equals(amValueCollateralData, amValuePropertyInfo)
|| !R.equals(seniorClaimCollateralData, seniorClaimPropertyInfo)
|| !R.equals(primaryValueCollateralData, primaryValuePropertyInfo);
    setDisableButton(!value);
  }, [collateralPropertyInfo]);

  const handleLienChange = (event) => {
    setLocalLienBalance(event.target.value);
  };

  const handleAddLoanBalance = () => {
    if (localLienBalance && localLienBalance !== '0') {
      addLoanBalance(localLienBalance);
    }
    setLocalLienBalance('');
  };

  const handleSave = () => {
    const {
      numberOfUnits, primaryUse, assetManagerCollateralValue, seniorClaim,
    } = collateralPropertyInfo;
    const payload = {
      numberOfUnits,
      occupancyType: primaryUse,
      assetManagerCollateralValue,
      seniorClaim,
    };
    saveCollateralData(payload);
  };

  const [Dialog, setDialog] = useState(false);

  const handleClose = () => {
    const { setChecklistCenterPaneData } = props;
    const value = R.equals(noOfunitsCollateralData, noOfUnitsPropertyInfo)
&& R.equals(amValueCollateralData, amValuePropertyInfo)
&& R.equals(seniorClaimCollateralData, seniorClaimPropertyInfo)
&& R.equals(primaryValueCollateralData, primaryValuePropertyInfo)
&& R.isEmpty(localLienBalance);
    if (!value) {
      setDialog(true);
    } else {
      setChecklistCenterPaneData('Checklist');
    }
  };

  const handleAlertDialogClose = (isConfirmed) => {
    const { setChecklistCenterPaneData } = props;
    setDialog(false);
    if (R.equals(isConfirmed, true)) {
      setChecklistCenterPaneData('Checklist');
    }
  };

  const exceptThisSymbols = ['e', 'E'];

  return (
    <Grid container elevation={0}>
      <Grid item xs={11}>
        <Typography styleName="heading">
          Collateral
        </Typography>
      </Grid>
      <Grid item styleName="closeButton" xs={1}>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Grid>
      <Grid xs={4}>
        <Paper elevation={0}>
          <Box styleName="left">
            <Grid container spacing={2}>
              <Typography styleName="subTitle">Property Information</Typography>
              <Grid alignItems="center" container>
                <Grid elevation={0} item xs={6}>
                  <Typography styleName="formMargin">No. of Units</Typography>
                </Grid>
                <Grid elevation={0} item styleName="rightAllignment" xs={6}>
                  <TextField
                    fullWidth
                    name="numberOfUnits"
                    onChange={handleChange}
                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                    placeholder="1"
                    size="small"
                    styleName="fullWidth"
                    type="number"
                    value={collateralPropertyInfo.numberOfUnits}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid alignItems="center" container>
                <Grid elevation={0} item xs={6}>
                  <Typography styleName="formMargin">What is the primary use of property?</Typography>
                </Grid>
                <Grid elevation={0} item styleName="rightAllignment" xs={6}>
                  <FormControl fullWidth size="small">
                    <Select
                      displayEmpty
                      id="demo-multiple-name"
                      input={<OutlinedInput />}
                      labelId="demo-multiple-name-label"
                      name="primaryUse"
                      onChange={handleChange}
                      onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                      styleName="fullWidth"
                      value={collateralPropertyInfo.primaryUse}
                    >
                      {primaryUsedropdown
                        && primaryUsedropdown.map(({ requestType, displayText }) => (
                          <MenuItem key={requestType} value={requestType}>
                            {displayText}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid alignItems="center" container>
                <Grid elevation={0} item xs={6}>
                  <Typography styleName="formMargin">AM Collateral Value</Typography>
                </Grid>
                <Grid elevation={0} item styleName="rightAllignment" xs={6}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" styleName="dollarSign">$</InputAdornment>
                      ),
                    }}
                    name="assetManagerCollateralValue"
                    onChange={handleChange}
                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                    placeholder="0.00"
                    size="small"
                    styleName="fullWidth"
                    type="number"
                    value={collateralPropertyInfo.assetManagerCollateralValue}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid alignItems="center" container>
                <Grid elevation={0} item xs={6}>
                  <Typography styleName="formMargin">Senior claim</Typography>
                </Grid>
                <Grid elevation={0} item styleName="rightAllignment" xs={6}>
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" styleName="dollarSign">$</InputAdornment>
                      ),
                    }}
                    name="seniorClaim"
                    onChange={handleChange}
                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                    placeholder="0.00"
                    size="small"
                    styleName="fullWidth"
                    type="number"
                    value={collateralPropertyInfo.seniorClaim}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Grid alignItems="center" container>
                <Grid elevation={0} item xs={6}>
                  <Typography styleName="formMargin">Lien Loan Balance</Typography>
                </Grid>
                <Grid elevation={0} item xs={4}>
                  <TextField
                    fullWidth
                    name="loanLienBalance"
                    onChange={handleLienChange}
                    onKeyDown={e => exceptThisSymbols.includes(e.key) && e.preventDefault()}
                    size="small"
                    styleName="fullWidth"
                    type="number"
                    value={localLienBalance}
                    variant="outlined"
                  />
                </Grid>
                <Grid alignItems="center" elevation={0} item styleName="rightAllignment" xs={2}>
                  <Button onClick={handleAddLoanBalance} size="large" styleName="addButton" variant="text">+ADD</Button>
                </Grid>
                <Grid elevation={0} item xs={12}>
                  <Box styleName="collapse"><TombstoneCollapse data={lienLoanBalance.lienLoanBalances || []} /></Box>
                </Grid>
              </Grid>
            </Grid>
            <Divider light styleName="divider" />
            <Grid elevation={0} item>
              <Button
                className="material-ui-button"
                disabled={disableButton}
                onClick={handleSave}
                styleName={disableButton ? 'disabledSaveButton' : 'saveButton'}
                variant="contained"
              >
SAVE
              </Button>
            </Grid>
          </Box>
        </Paper>
      </Grid>
      <Grid xs={8}>
        {loading ? <Loader message="Please Wait" />
          : (
            <Grid item xs={12}>
              <Typography styleName="subTitle"> Property Valuation </Typography>
              <MUITable columns={PROPERTY_VALUATIONS_COLUMNS} data={propertyValuations || []} size="small" />
            </Grid>
          )}
      </Grid>
      <ConfirmationDialogBox
        isOpen={Dialog}
        message=""
        onClose={isConfirmed => handleAlertDialogClose(isConfirmed)}
        title={COLLATERAL_DIALOG_MSG}
      />
    </Grid>
  );
}

CollateralContent.defaultProps = {
  populateCollateralEvents: () => { },
  primaryUsedropdown: [],
  populateCollateralData: () => {},
  collateralData: {},
  addLoanBalance: () => { },
  saveCollateralData: () => { },
  loading: false,
  lienLoanBalance: {},
  populateLienLoanBalances: () => {},
  propertyValuations: [],
};

CollateralContent.propTypes = {
  addLoanBalance: PropTypes.func,
  collateralData: PropTypes.shape({
    assetManagerCollateralValue: PropTypes.number,
    numberOfUnits: PropTypes.number,
    primaryUse: PropTypes.string,
    propertyValuations: PropTypes.arrayOf(PropTypes.shape),
    seniorClaim: PropTypes.number,
  }),
  lienLoanBalance: PropTypes.shape({
    lienLoanBalances: PropTypes.arrayOf(),
  }),
  loading: PropTypes.bool,
  populateCollateralData: PropTypes.func,
  populateCollateralEvents: PropTypes.func,
  populateLienLoanBalances: PropTypes.func,
  primaryUsedropdown: PropTypes.arrayOf(PropTypes.Shape),
  propertyValuations: PropTypes.arrayOf(PropTypes.shape),
  saveCollateralData: PropTypes.func,
  setChecklistCenterPaneData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  primaryUsedropdown: selectors.getPrimaryUseDropdown(state),
  collateralData: selectors.getCollateralData(state),
  loading: selectors.getLoader(state),
  lienLoanBalance: selectors.getLienLoanBalance(state),
  propertyValuations: selectors.getPropertyValuations(state),
});

const mapDispatchToProps = dispatch => ({
  populateCollateralEvents: operations.populateCollateralEventsOperation(dispatch),
  populateCollateralData: operations.fetchCollateralDataOperation(dispatch),
  setChecklistCenterPaneData: operations.setChecklistCenterPaneDataOperation(dispatch),
  addLoanBalance: operations.addLoanBalanceOperation(dispatch),
  saveCollateralData: operations.saveCollateralDataOperation(dispatch),
  populateLienLoanBalances: operations.refreshLienBalanceOperation(dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(CollateralContent);
