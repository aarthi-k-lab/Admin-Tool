import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as R from 'ramda';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Icon from '@material-ui/core/Icon';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import FormControlLabelWithTooltip from 'components/RadioButtonGroup';
import './Assetverification.css';
import { selectors as incomeCalcSelectors } from 'ducks/income-calculator';
import { selectors as dashboardSelectors } from 'ducks/dashboard';
import utils from 'ducks/tasks-and-checklist/utils';
import { selectors as taskChecklistSelectors, operations as taskChecklistOperations } from '../../state/ducks/tasks-and-checklist';
import { DECEASED_BORROWER } from '../../constants/incomeCalc/DocumentList';
import processBorrowerData from '../../lib/CustomFunctions/BorrowerData/processBorrowerData';

const assetverificationTextFields = [
  {
    id: 1,
    name: 'Checking Account',
    key: 'checkingAccount',
  },
  {
    id: 2,
    name: 'Savings / Money Market Account',
    key: 'savingsAccount',
  },
  {
    id: 3,
    name: '401K / ESOP / IRA / Keogh',
    key: 'ira',
  },
  {
    id: 4,
    name: 'Stocks/Bonds/CD s/Other',
    key: 'stocks',
  },
];

const radioBtnOptions = [
  {
    displayName: 'Verified',
    value: 'Verified',
  },
  {
    displayName: 'Stated',
    value: 'Stated',
  },
];
function Assetverification(props) {
  const {
    getborrowerData, assetDetails, setAssetDetail, setRadioInAsset,
    isHistorClicked, assetHistoryDetails, assetHistoryDropdown,
    fetchHistoryDetails, fetchHistoryById, setHistoryView, isAssigned,
  } = props;
  const setBorrowers = () => {
    const data = processBorrowerData(getborrowerData);
    if (isHistorClicked) {
      const borrowersFromAsset = assetHistoryDetails.map(d => d.borrValue);
      const result = [];
      data.map((d) => {
        if (borrowersFromAsset.includes(d.value)) {
          result.push(d);
        }
        return d;
      });
      return result;
    }
    return data;
  };
  const displayList = setBorrowers();
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedBorrower, setSelectedBorrwer] = useState('');
  const [selectedAsset, setSelectedAsset] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const defaultRadioState = 'Verified';
  const isDisabled = !isAssigned || isHistorClicked ? 'disable' : '';

  const { getCSTDateTime } = utils;

  const handleTabChange = (selectedIndex) => {
    setTabIndex(selectedIndex);
    const borrowerValue = R.propOr('', 'value', R.find(R.propEq('pstnNum',
      (selectedIndex + 1)))(displayList));
    setSelectedBorrwer(borrowerValue);
    let assetObj = {};
    if (isHistorClicked) {
      assetObj = R.find(R.propEq('borrValue',
        borrowerValue))(assetHistoryDetails);
    } else {
      assetObj = R.find(R.propEq('borrValue',
        borrowerValue))(assetDetails);
    }
    if (R.isNil(assetObj) || R.isEmpty(assetObj)) {
      setSelectedAsset({});
    } else {
      setSelectedAsset(assetObj);
    }
  };

  const handleAssetDetailChange = (event, key) => {
    const inputValue = event.target.value;
    const regex = /^\d*\.?(?:\d{1,2})?$/;
    if (regex.test(inputValue)) {
      const payload = {
        value: inputValue,
        key,
        selectedBorrower,
      };
      setAssetDetail(payload);
    }
  };

  const handleViewHistoryItem = (item) => {
    const payload = {
      assetId: item.assetId,
    };
    fetchHistoryById(payload);
    setHistoryView(true);
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    fetchHistoryDetails();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const onChangeRadioGroupHandler = (event) => {
    const payload = {
      value: event.target.value,
      key: 'selectedState',
      selectedBorrower,
    };
    setRadioInAsset(payload);
  };

  useEffect(() => {
    const assetObj = R.find(R.propEq('borrValue',
      selectedBorrower))(assetDetails);
    if (R.isNil(assetObj) || R.isEmpty(assetObj)) {
      setSelectedAsset({});
    } else {
      setSelectedAsset(assetObj);
    }
  }, [assetDetails]);

  useEffect(() => {
    if (isHistorClicked) {
      const assetObj = R.find(R.propEq('borrValue',
        selectedBorrower))(assetHistoryDetails);
      if (R.isNil(assetObj) || R.isEmpty(assetObj)) {
        setSelectedAsset({});
      } else {
        setSelectedAsset(assetObj);
      }
    }
  }, [assetHistoryDetails]);

  useEffect(() => {
    let assetObj = {};
    if (isHistorClicked) {
      assetObj = R.find(R.propEq('borrValue',
        selectedBorrower))(assetHistoryDetails);
    } else {
      assetObj = R.find(R.propEq('borrValue',
        selectedBorrower))(assetDetails);
    }
    if (R.isNil(assetObj) || R.isEmpty(assetObj)) {
      setSelectedAsset({});
    } else {
      setSelectedAsset(assetObj);
    }
  }, [isHistorClicked]);

  useEffect(() => {
    const borrowerValue = R.propOr('', 'value', R.find(R.propEq('pstnNum',
      (tabIndex + 1)))(displayList));
    setSelectedBorrwer(borrowerValue);
    const assetObj = R.find(R.propEq('borrValue',
      borrowerValue))(assetDetails);
    if (R.isNil(assetObj) || R.isEmpty(assetObj)) {
      setSelectedAsset({});
    } else {
      setSelectedAsset(assetObj);
    }
    if (R.isNil(assetHistoryDropdown) || R.isEmpty(assetHistoryDropdown)) {
      fetchHistoryDetails();
    }
  }, []);


  const renderDropDownItems = () => (!R.isEmpty(assetHistoryDropdown)
    ? assetHistoryDropdown.map((item, index) => (
      <>
        <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>{getCSTDateTime(item.createdDate)}</h3>
            {item.assetId ? <h5 style={{ margin: 0, color: 'gray' }}>{item.assetId}</h5>
              : <h5 style={{ margin: 0, color: 'gray' }}>--</h5> }
          </div>
          <Icon
            color="primary"

            onClick={() => handleViewHistoryItem(item)}
            style={{ margin: '0 0.5rem', cursor: 'pointer' }}
          >
          visibility
          </Icon>
        </div>
        {index + 1 !== assetHistoryDropdown.length && <Divider style={{ height: '1px', margin: '0px 3px' }} />}
      </>
    ))
    : (
      <div style={{ display: 'flex', alignItems: 'end', margin: '1rem' }}>
        No historical checklists are available
      </div>
    ));
  return (
    <div>
      <div styleName="assetHistoryContainer">
        <>
          {isHistorClicked
            ? (
              <Grid styleName="assetHistoryDetails">
                <Grid>
                  <Typography styleName="asset">
                    {getCSTDateTime(selectedAsset.createdDate
                      ? selectedAsset.createdDate : '')}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography styleName="asset">
                    {` Asset ID: ${selectedAsset.assetId ? selectedAsset.assetId : ''}`}
                  </Typography>
                </Grid>
                <Grid>
                  <Typography styleName="asset">
                    {` Completed By: ${selectedAsset.completedBy
                      ? selectedAsset.completedBy.replace('.', ' ').replace('@mrcooper.com', '') : ''}`}
                  </Typography>
                </Grid>
              </Grid>
            ) : null }
        </>
        <div styleName="calculationHistory">
          <Tooltip placement="left" title="Calculation History">
            <Icon
              onClick={handleClick}
              style={{ cursor: 'pointer', margin: '0.6rem 0rem 0rem 0rem' }}
            >
            history
            </Icon>
          </Tooltip>
          <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            id={id}
            onClose={handleClose}
            open={Boolean(anchorEl)}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            {renderDropDownItems()}
          </Popover>
        </div>
      </div>
      <div>
        <Paper elevation={1} square styleName="borrowerBanner">
          <Tabs
            inkBarStyle={{ background: '#596feb' }}
            onChange={(_, selectedIndex) => handleTabChange(selectedIndex)}
            scrollable="true"
            style={{ width: 'auto' }}
            value={tabIndex}
            variant="scrollable"
          >
            {displayList && displayList.map(task => (
              <Tab
                key={R.propOr('', 'name', task)}
                disabled={R.propOr('', 'name', task).includes(DECEASED_BORROWER)}
                label={(
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
                )}
                styleName="borrTab"
              />
            ))}
          </Tabs>
        </Paper>
        <div>
          <Grid styleName="gridHandle">
            <Grid styleName="ficoScrGrid" xs={6}>
              <>
                <Paper styleName="paper">
                  <p>
                    <Typography styleName="fico-title">Savings and Investment Assets</Typography>
                  </p>
                  {assetverificationTextFields.map(step => (
                    <div styleName="align">
                      <div>
                        {<Typography styleName="fico-scr-title">{step.name}</Typography>}
                      </div>
                      <TextField
                        disabled={selectedBorrower.includes(DECEASED_BORROWER)}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                        margin="dense"
                        onChange={event => handleAssetDetailChange(event, step.key)}
                        size="small"
                        styleName={`textalign ${isDisabled}`}
                        value={selectedAsset[step.key] ? selectedAsset[step.key] : ''}
                        variant="outlined"
                      />
                    </div>
                  ))}

                  <div styleName="radio-btn-padding">
                    <div styleName="radio-btn">
                      <RadioGroup
                        onChange={onChangeRadioGroupHandler}
                        row
                        styleName="align-radio-btn"
                        value={selectedAsset.selectedState
                          ? selectedAsset.selectedState : defaultRadioState}
                      >
                        {
                          radioBtnOptions.map(({
                            displayName, value, hint, isChecked,
                          }) => (
                            <FormControlLabelWithTooltip
                              key={displayName}
                              control={<Radio checked={isChecked} styleName="radio-control-bubble" />}
                              disabled={isDisabled || selectedBorrower.includes(DECEASED_BORROWER)}
                              disableTooltip={R.isNil(hint) || R.isEmpty(hint)}
                              label={displayName}
                              styleName={`radio-control ${isDisabled}`}
                              tooltip={hint}
                              value={value}
                            />
                          ))
                     }
                      </RadioGroup>
                    </div>
                  </div>
                </Paper>
              </>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

Assetverification.defaultProps = {
};


Assetverification.propTypes = {
  assetDetails: PropTypes.shape().isRequired,
  assetHistoryDetails: PropTypes.func.isRequired,
  assetHistoryDropdown: PropTypes.shape().isRequired,
  fetchHistoryById: PropTypes.func.isRequired,
  fetchHistoryDetails: PropTypes.func.isRequired,
  getborrowerData: PropTypes.shape().isRequired,
  isAssigned: PropTypes.bool.isRequired,
  isHistorClicked: PropTypes.bool.isRequired,
  setAssetDetail: PropTypes.func.isRequired,
  setHistoryView: PropTypes.func.isRequired,
  setRadioInAsset: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  getborrowerData: incomeCalcSelectors.getBorrowers(state),
  assetDetails: taskChecklistSelectors.getAssetDetails(state),
  isHistorClicked: taskChecklistSelectors.getAssetHistoryClicked(state),
  assetHistoryDetails: taskChecklistSelectors.getAssetHistoryDetails(state),
  assetHistoryDropdown: taskChecklistSelectors.getAssetHistoryDropDown(state),
  isAssigned: dashboardSelectors.isAssigned(state),
});

const mapDispatchToProps = dispatch => ({
  setAssetDetail: taskChecklistOperations.setAssetDetailOperation(dispatch),
  setRadioInAsset: taskChecklistOperations.setRadioSelectDetailOperation(dispatch),
  fetchHistoryDetails: taskChecklistOperations.fetchAssetHistoriesOperations(dispatch),
  fetchHistoryById: taskChecklistOperations.fetchAssetHistoryForAssetIdOperation(dispatch),
  setHistoryView: taskChecklistOperations.setAssetHistoryViewOperation(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Assetverification);
